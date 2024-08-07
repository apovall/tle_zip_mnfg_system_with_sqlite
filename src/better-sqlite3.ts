
import path from 'node:path'
import Database from 'better-sqlite3'
import { UnitDetails } from './types/interfaces'

const root = import.meta.env.VITE_COMMAND === 'serve'
  ? import.meta.env.VITE_DEV_ROOT
  : path.join(__dirname, '..')
const TAG = '[better-sqlite3]'
let database: Database.Database
const tableName = 'zip_h2_manufacturing_test'

export function createTable(tableName) {
  const createTable = database.prepare(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qrCode TEXT,
      result TEXT,
      batt_contact_ok BOOLEAN,
      batt_voltage_ok BOOLEAN,
      tilt_sw_opens BOOLEAN,
      tilt_sw_closes BOOLEAN,
      resistance_ok BOOLEAN,
      resistance REAL,
      vcell_loaded REAL,
      vcell_unloaded REAL,
      action TEXT NOT NULL
    );
  `);
  createTable.run();
}

function readTable(tableName:string) {
  const selectStatement = database.prepare(`SELECT * FROM ${tableName}`);
  const rows = selectStatement.all();
  // console.log(rows);
  return rows;
}

export function getSqlite3(filename: string) {

  console.log(filename)
  console.log(root)
  console.log(import.meta.env.VITE_BETTER_SQLITE3_BINDING)
  database ??= new Database(filename, {
    // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L36
    // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L50
    nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING),
  })
  createTable(tableName)
  // const statement = database.prepare('INSERT INTO cats (name, age) VALUES (?, ?)');
  // const result = statement.run('Horaz', 12);  // Pass parameters to the query
  // // console.log(result)

  const rows = readTable(tableName)
  console.log(rows)
  return database
}

export function saveUnitResults(data:UnitDetails){
  const stmt = database.prepare(`
    INSERT INTO ${tableName} (
      qrCode,
      result,
      batt_contact_ok,
      batt_voltage_ok,
      tilt_sw_opens,
      tilt_sw_closes,
      resistance_ok,
      resistance,
      vcell_loaded,
      vcell_unloaded,
      action
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  // Execute the statement with the data
  let result = stmt.run(
    data.qrCode,
    data.result,
    data.batt_contact_ok,
    data.batt_voltage_ok,
    data.tilt_sw_opens,
    data.tilt_sw_closes,
    data.resistance_ok,
    data.resistance,
    data.vcell_loaded,
    data.vcell_unloaded,
    data.action
  );
  console.log("saving ==>", result)
}
