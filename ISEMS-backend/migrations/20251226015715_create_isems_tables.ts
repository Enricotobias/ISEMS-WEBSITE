import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    
    // 1. Tabel Devices (Master Data)
    await knex.schema.createTable('devices', (table) => {
        table.string('device_id', 50).primary();
        table.string('name', 100);
        table.string('status', 50).defaultTo('offline');
        table.dateTime('last_seen').defaultTo(knex.fn.now());
        table.string('ip_address', 45);
        table.string('mac_address', 20);
        table.string('fw_version', 20);
        table.string('wifi_ssid', 50);
        table.integer('rssi');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // 2. Tabel Telemetry Logs
    await knex.schema.createTable('telemetry_logs', (table) => {
        table.bigIncrements('id').primary();
        table.string('device_id', 50).index();
        table.dateTime('timestamp').defaultTo(knex.fn.now());
        table.boolean('power'); // 1/0
        table.decimal('current_temp', 4, 1);
        table.string('mode', 20);
        table.string('fan_speed', 20);
        table.string('error_code', 20);
        table.boolean('read_unit').defaultTo(false); // Kolom yang tadi kita perbaiki
        table.integer('wifi_rssi');
        table.string('rtc_status', 10);

        // Foreign Key
        table.foreign('device_id').references('devices.device_id').onDelete('CASCADE');
    });

    // 3. Tabel Device Settings
    await knex.schema.createTable('device_settings', (table) => {
        table.string('device_id', 50).primary();
        table.boolean('automation');
        table.integer('max_temp');
        table.integer('min_temp');
        table.integer('set_temp');
        table.string('set_mode', 20);
        table.string('pause_reason', 50).defaultTo('-');
        table.integer('manual_remaining_s').defaultTo(0);
        table.string('system_mode', 20).defaultTo('AUTO');
        table.json('schedule_json'); // Tipe JSON
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('device_id').references('devices.device_id').onDelete('CASCADE');
    });

    // 4. Tabel Device Health (Diagnostics)
    await knex.schema.createTable('device_health', (table) => {
        table.bigIncrements('id').primary();
        table.string('device_id', 50).index();
        table.dateTime('timestamp').defaultTo(knex.fn.now());
        table.bigInteger('uptime_sec');
        table.integer('heap_free');
        table.decimal('heap_fragmentation', 5, 2);
        table.integer('health_score');
        table.string('health_status', 20);
        table.decimal('crash_rate', 5, 2);
        table.integer('mqtt_reconnects');
        table.integer('wifi_disconnects');
        table.json('raw_json'); // Simpan raw data

        table.foreign('device_id').references('devices.device_id').onDelete('CASCADE');
    });

    // 5. Tabel Event Logs (Logs & ACK)
    await knex.schema.createTable('event_logs', (table) => {
        table.bigIncrements('id').primary();
        table.string('device_id', 50).index();
        table.dateTime('timestamp').defaultTo(knex.fn.now());
        table.string('type', 20); // 'ACK', 'LOG', 'ERROR'
        table.string('command', 50).nullable();
        table.text('message');
        table.string('status', 20).nullable();

        table.foreign('device_id').references('devices.device_id').onDelete('CASCADE');
    });

    // 6. Tabel Command History
    await knex.schema.createTable('command_history', (table) => {
        table.bigIncrements('id').primary();
        table.string('device_id', 50).index();
        table.string('command_type', 50);
        table.text('payload');
        table.timestamp('sent_at').defaultTo(knex.fn.now());

        table.foreign('device_id').references('devices.device_id').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    // Hapus tabel dengan urutan terbalik (Child dulu baru Parent)
    // agar tidak kena error foreign key constraint
    await knex.schema.dropTableIfExists('command_history');
    await knex.schema.dropTableIfExists('event_logs');
    await knex.schema.dropTableIfExists('device_health');
    await knex.schema.dropTableIfExists('device_settings');
    await knex.schema.dropTableIfExists('telemetry_logs');
    await knex.schema.dropTableIfExists('devices');
}