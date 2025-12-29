import type { Knex } from "knex";


exports.up = function(knex) {
  return knex.schema.table('telemetry_logs', function(table) {
    table.string('mac_address', 20).after('device_id'); // Tambah kolom mac
  });
};

exports.down = function(knex) {
  return knex.schema.table('telemetry_logs', function(table) {
    table.dropColumn('mac_address');
  });
};
