
import path from 'node:path'
import Database from 'better-sqlite3'
import { UnitDetails } from './types/interfaces'

const root = import.meta.env.VITE_COMMAND === 'serve'
  ? import.meta.env.VITE_DEV_ROOT
  : path.join(__dirname, '..')
const TAG = '[better-sqlite3]'
let database: Database.Database
const tableName = 'zip_h2_manufacturing_test'

export function createTable(tableName:string) {
  /* Schema for the table
    
  qrCode: string | null,
    batchNumber: string | null,
    resistorLoaded: number | null,
    result: "pass" | "fail" | null
    batt_contact_ok: "pass" | "fail" null
    batt_voltage_ok: "pass" | "fail" null
    tilt_sw_opens: "pass" | "fail" null
    tilt_sw_closes: "pass" | "fail" null
    resistance_ok: "pass" | "fail" null
    resistance: "unknown" | number | null
    vcell_loaded: number | null
    vcell_unloaded: number | null

  */
 
  const createTable = database.prepare(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchNumber TEXT,
      resistorLoaded REAL,
      timestamp TEXT,
      qrCode TEXT,
      result TEXT,
      batt_contact_ok TEXT,
      batt_voltage_ok TEXT,
      tilt_sw_opens TEXT,
      tilt_sw_closes TEXT,
      resistance_ok TEXT,
      resistance REAL,
      vcell_loaded REAL,
      vcell_unloaded REAL
    );
  `);
  createTable.run();
}

function readTable(tableName:string) {
  const selectStatement = database.prepare(`SELECT * FROM ${tableName}`);
  const rows = selectStatement.all();
  return rows;
}

export function getSqlite3(filename: string) {

  let dbPath 
  let platform = process.platform

  if (platform == 'win32'){
    dbPath = path.join(root, "/dist-native/better_sqlite3.node")
  } else {
    dbPath = path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING)
  }

  console.log(filename)
  console.log(root)
  console.log(import.meta.env.VITE_BETTER_SQLITE3_BINDING)
  database ??= new Database(filename, {
    // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L36
    // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L50
    nativeBinding: dbPath,
  })
  createTable(tableName)
  const rows = readTable(tableName)
  console.log(rows)
  return database
}

export function saveUnitResults(data:UnitDetails){
  const stmt = database.prepare(`
    INSERT INTO ${tableName} (
      batchNumber,
      resistorLoaded,
      timestamp,
      qrCode,
      result,
      batt_contact_ok,
      batt_voltage_ok,
      tilt_sw_opens,
      tilt_sw_closes,
      resistance_ok,
      resistance,
      vcell_loaded,
      vcell_unloaded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const timestamp = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', hour12: false });
  let result = stmt.run(
    data.batchNumber,
    data.resistorLoaded,
    timestamp,
    data.qrCode,
    data.result,
    data.batt_contact_ok == "unknown" ? null : data.batt_contact_ok,
    data.batt_voltage_ok == "unknown" ? null : data.batt_voltage_ok,
    data.tilt_sw_opens == "unknown" ? null : data.tilt_sw_opens,
    data.tilt_sw_closes == "unknown" ? null : data.tilt_sw_closes,
    data.resistance_ok == "unknown" ? null : data.resistance_ok,
    data.resistance == 'unknown' ? null : data.resistance,
    data.vcell_loaded == 'unknown' ? null : data.vcell_loaded,
    data.vcell_unloaded == 'unknown' ? null : data.vcell_unloaded
  );
  console.log("saving ==>", result)
}
