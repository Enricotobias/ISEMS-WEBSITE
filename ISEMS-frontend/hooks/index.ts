import { useEffect, useState, useCallback, useRef } from 'react';
import useSWR from 'swr';
import { devicesAPI, telemetryAPI, eventsAPI, controlAPI, healthAPI } from '@/lib/api';
import type { EventLog } from '@/lib/types';
import { mqttService } from '@/lib/mqtt'; 
import type { 
  Device, 
  TelemetryLog, 
  RemoteCommand, 
  MQTTDataMessage,
  MQTTStatusMessage,
  ACMode,
  FanSpeed 
} from '@/lib/types';

// =================== DEVICES HOOK ===================
export function useDevices() {
  const { data, error, mutate } = useSWR('/devices', () => 
    devicesAPI.getAll().then(res => res.data)
  );

  return {
    devices: data as Device[] || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}

// =================== TELEMETRY HOOK WITH MQTT ===================
export function useTelemetry(deviceId: string, limit = 50) {
  // PERBAIKAN DI SINI:
  // Tambahkan query param ?limit=${limit} ke dalam Key SWR
  // Agar request "Card" (limit 1) dan "Chart" (limit 50) tidak tabrakan cache-nya.
  const { data, error, mutate } = useSWR(
    deviceId ? `/logs/${deviceId}?limit=${limit}` : null,
    () => telemetryAPI.getLogs(deviceId, limit).then(res => res.data),
    { refreshInterval: 5000 } 
  );

  const [realtimeData, setRealtimeData] = useState<TelemetryLog[]>([]);

  useEffect(() => {
    if (!deviceId) return;

    if (data) {
      setRealtimeData(data);
    }

    const cleanup = mqttService.addMessageHandler((topic, message) => {
      const dataTopic = `isems/devices/${deviceId}/data`;
      
      if (topic === dataTopic) {
        try {
          const mqttData: MQTTDataMessage = JSON.parse(message);
          
          const newLog: TelemetryLog = {
            id: Date.now(), 
            device_id: deviceId,
            power: mqttData.power,
            current_temp: mqttData.current_temp,
            mode: mqttData.mode,
            fan_speed: mqttData.fan_speed,
            error_code: mqttData.error_code,
            wifi_rssi: mqttData.wifi_rssi,
            rtc_status: mqttData.rtc_status,
            read_unit: mqttData.read_unit,
            timestamp: new Date().toISOString(),
          };

          setRealtimeData(prev => [newLog, ...prev.slice(0, limit - 1)]);
        } catch (err) {
          console.error('[useTelemetry] Parse error:', err);
        }
      }
    });

    return cleanup;
  }, [deviceId, limit, data]);

  return {
    logs: realtimeData,
    latest: realtimeData[0] || null,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}

export function useDeviceHealth(deviceId: string) {
  const { data, error, mutate } = useSWR(
    deviceId ? `/health/${deviceId}` : null,
    () => healthAPI.getLatest(deviceId).then(res => {
      // Handle jika return array atau object tunggal
      return Array.isArray(res.data) ? res.data[0] : res.data;
    }),
    { refreshInterval: 10000 } // Cek kesehatan setiap 10 detik
  );

  return {
    health: data as DeviceHealth | null,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}

// =================== DEVICE STATUS HOOK ===================
export function useDeviceStatus(deviceId: string) {
  const [status, setStatus] = useState<string>('offline');
  const [lastDisconnect, setLastDisconnect] = useState<string>('');
  const [offlineDuration, setOfflineDuration] = useState<number>(0);

  // 1. Fetch Status Awal dari Database
  useEffect(() => {
    if (!deviceId) return;
    devicesAPI.getAll().then((res) => {
      const device = res.data.find((d: any) => d.device_id === deviceId);
      if (device && device.status) {
        setStatus(device.status);
      }
    });
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId) return;

    const cleanup = mqttService.addMessageHandler((topic, message) => {
      const statusTopic = `isems/devices/${deviceId}/status`;
      
      if (topic === statusTopic) {
        try {
          if (message.startsWith('{')) {
            const statusData: MQTTStatusMessage = JSON.parse(message);
            setStatus(statusData.status);
            if (statusData.last_disconnect) setLastDisconnect(statusData.last_disconnect);
            if (statusData.offline_duration_s) setOfflineDuration(statusData.offline_duration_s);
          } else {
            setStatus(message);
          }
        } catch (err) {
          setStatus(message);
        }
      }
    });

    return cleanup;
  }, [deviceId]);

  return {
    status,
    isOnline: status === 'online',
    lastDisconnect,
    offlineDuration,
  };
}

// =================== REMOTE CONTROL HOOK ===================
export function useRemoteControl(deviceId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState<RemoteCommand | null>(null);
  const [ackStatus, setAckStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    const cleanup = mqttService.addMessageHandler((topic, message) => {
      const ackTopic = `isems/devices/${deviceId}/ack`;
      
      if (topic === ackTopic) {
        try {
          const ack = JSON.parse(message);
          if (ack.cmd === 'remote') {
            setAckStatus(ack.status);
            setIsLoading(false);
            setTimeout(() => setAckStatus(null), 3000);
          }
        } catch (err) {
          console.error('[useRemoteControl] ACK parse error:', err);
        }
      }
    });

    return cleanup;
  }, [deviceId]);

  const sendCommand = useCallback(async (command: RemoteCommand) => {
    setIsLoading(true);
    setLastCommand(command);
    
    try {
      await controlAPI.sendRemote(deviceId, command);
      
      setTimeout(() => {
        setIsLoading((currentLoading) => {
           if (currentLoading) {
             setAckStatus('failed');
             return false;
           }
           return currentLoading;
        });
      }, 5000);
      
    } catch (error) {
      console.error('[RemoteControl] Send error:', error);
      setIsLoading(false);
      setAckStatus('failed');
    }
  }, [deviceId]);

  return {
    sendCommand,
    isLoading,
    lastCommand,
    ackStatus,
  };
}

// =================== MQTT CONNECTION HOOK ===================
export function useMQTTConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const connectionAttempted = useRef(false);

  useEffect(() => {
    if (!connectionAttempted.current) {
      connectionAttempted.current = true;
      mqttService.connect();
    }

    const interval = setInterval(() => {
      if (typeof mqttService.isConnected === 'function') {
        setIsConnected(mqttService.isConnected());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected };
}

// =================== TEMPERATURE CONTROL HOOK ===================
export function useTemperatureControl(deviceId: string, initialTemp = 24) {
  const [temperature, setTemperature] = useState(initialTemp);
  const { sendCommand, isLoading } = useRemoteControl(deviceId);

  const increaseTemp = useCallback(() => {
    const newTemp = Math.min(temperature + 1, 30);
    setTemperature(newTemp);
    sendCommand({ temp: newTemp });
  }, [temperature, sendCommand]);

  const decreaseTemp = useCallback(() => {
    const newTemp = Math.max(temperature - 1, 16);
    setTemperature(newTemp);
    sendCommand({ temp: newTemp });
  }, [temperature, sendCommand]);

  const setTemp = useCallback((temp: number) => {
    const validTemp = Math.max(16, Math.min(30, temp));
    setTemperature(validTemp);
    sendCommand({ temp: validTemp });
  }, [sendCommand]);

  return {
    temperature,
    increaseTemp,
    decreaseTemp,
    setTemp,
    isLoading,
  };
}

export function useEventLogs(deviceId: string) {
  const { data, error, mutate } = useSWR(
    deviceId ? `/events/${deviceId}` : null,
    () => eventsAPI.getLogs(deviceId).then(res => res.data),
    { refreshInterval: 5000 } // Auto refresh setiap 5 detik
  );

  return {
    initialLogs: data as EventLog[] || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}

// =================== MODE CYCLE HOOK ===================
export function useModeControl(deviceId: string, initialMode: ACMode = 'COOL') {
  const modes: ACMode[] = ['COOL', 'DRY', 'FAN', 'HEAT', 'AUTO'];
  const [currentMode, setCurrentMode] = useState<ACMode>(initialMode);
  const { sendCommand, isLoading } = useRemoteControl(deviceId);

  const cycleMode = useCallback(() => {
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    
    setCurrentMode(nextMode);
    sendCommand({ mode: nextMode });
  }, [currentMode, sendCommand, modes]);

  const setMode = useCallback((mode: ACMode) => {
    setCurrentMode(mode);
    sendCommand({ mode });
  }, [sendCommand]);

  return {
    currentMode,
    cycleMode,
    setMode,
    isLoading,
  };
}