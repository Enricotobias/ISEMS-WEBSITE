import mqtt, { MqttClient } from 'mqtt';

export type MQTTMessageHandler = (topic: string, message: string) => void;

class MQTTService {
  private client: MqttClient | null = null;
  private messageHandlers: Set<MQTTMessageHandler> = new Set();
  private isConnecting = false;

  connect() {
    if (this.client?.connected || this.isConnecting) {
      return this.client;
    }

    const host = process.env.NEXT_PUBLIC_MQTT_HOST;
    const port = process.env.NEXT_PUBLIC_MQTT_PORT;
    const protocol = process.env.NEXT_PUBLIC_MQTT_PROTOCOL || 'wss';
    
    // PENTING: /mqtt path untuk WebSocket
    const url = `${protocol}://${host}:${port}/mqtt`;
    
    console.log(`[MQTT] Connecting to: ${url}`);
    this.isConnecting = true;

    this.client = mqtt.connect(url, {
      username: process.env.NEXT_PUBLIC_MQTT_USER,
      password: process.env.NEXT_PUBLIC_MQTT_PASS,
      clientId: `web_client_${Math.random().toString(16).slice(2, 8)}`,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      keepalive: 60,
      clean: true,
    });

    this.client.on('connect', () => {
      console.log('[MQTT] ✓ Connected via WebSocket Secure');
      this.isConnecting = false;
      
      // Subscribe global untuk menangkap data devices & command feedbacks
      this.subscribe('isems/devices/#');
      this.subscribe('isems/command/#');
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Connection Error:', err.message);
      this.isConnecting = false;
    });
    
    this.client.on('close', () => {
        console.log('[MQTT] Connection Closed');
        this.isConnecting = false;
    });

    this.client.on('message', (topic, message) => {
      const msgString = message.toString();
      this.messageHandlers.forEach(handler => handler(topic, msgString));
    });

    return this.client;
  }

  subscribe(topic: string) {
    if (!this.client) return;
    this.client.subscribe(topic, (err) => {
      if (err) console.error(`[MQTT] Subscribe failed: ${topic}`);
      // else console.log(`[MQTT] Subscribed: ${topic}`); // Uncomment jika ingin log verbose
    });
  }

  publish(topic: string, message: string | object) {
    if (!this.client?.connected) {
      console.warn('[MQTT] Cannot publish - Offline');
      return;
    }
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    this.client.publish(topic, payload, { qos: 1 });
  }

  addMessageHandler(handler: MQTTMessageHandler) {
    this.messageHandlers.add(handler);
    // Return fungsi cleanup
    return () => { this.messageHandlers.delete(handler); };
  }

  isConnected(): boolean {
    return !!this.client?.connected;
  }

  // [BARU] Helper untuk mengambil raw client jika dibutuhkan komponen luar
  getClient(): MqttClient | null {
    return this.client;
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.isConnecting = false;
    }
  }
}

export const mqttService = new MQTTService();
export default mqttService;