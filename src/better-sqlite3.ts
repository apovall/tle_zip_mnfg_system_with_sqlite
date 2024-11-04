
import path from 'node:path'
import Database from 'better-sqlite3'
import { UnitDetails } from './types/interfaces'

const root = import.meta.env.VITE_COMMAND === 'serve'
  ? import.meta.env.VITE_DEV_ROOT
  : path.join(__dirname, '..')
const TAG = '[better-sqlite3]'
let database: Database.Database
const tableName = 'zip_h2_manufacturing_test'
// const tableNames = {"test": "zip_h2_manufacturing_test", "assembly": "zip_h2_assembly"}
const tableSchema = {
  "zip_h2_manufacturing_test": `
    CREATE TABLE IF NOT EXISTS zip_h2_manufacturing_test (
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
      vcell_unloaded REAL,
      h2cellBatch TEXT
    );
  `,
  "zip_h2_assembly": `
    CREATE TABLE IF NOT EXISTS zip_h2_assembly (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_number TEXT,
      dispenser_serial TEXT,
      pcb_serial TEXT,
      dispenser_type TEXT,
      timestamp TEXT
    );
  `,
  "zip_dispenser_filling": `
    CREATE TABLE IF NOT EXISTS zip_dispenser_filling (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_number TEXT,
      dispenser_serial TEXT,
      filling_serials TEXT,
      times_filled INTEGER,
      timestamp TEXT
    );
  `
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
  createTable(tableSchema['zip_h2_manufacturing_test'])
  createTable(tableSchema['zip_h2_assembly'])
  createTable(tableSchema['zip_dispenser_filling'])

  // Check if necessary to add new column to the table specified
  // Doing it this way allows the app to always be kept up to date programatically 
  // with no user-manual intervention required
  updateTableSchema("zip_h2_manufacturing_test", {name: "h2cellBatch", type: "TEXT"})

  let rows = readTable('zip_h2_manufacturing_test')
  console.log("zip_h2_manufacturing_test table: \n", rows)
  rows = readTable('zip_h2_assembly')
  console.log("zip_h2_assembly table: \n", rows)
  // rows = readTable('saveDispenserFillingDetails')
  // console.log("saveDispenserFillingDetails table: \n", rows)
  return database
}
// From tableSchema object
export function createTable(schema:string) {
  const createTable = database.prepare(schema);
  createTable.run();
}

export function readTable(tableName:string, clause?:string) {
  let query = `SELECT * FROM ${tableName}`;
  if (clause) {
    query += ` ${clause};`;
  }
  console.log("query", query)
  const selectStatement = database.prepare(query);
  const rows = selectStatement.all();
  return rows;
}

export function saveUnitResults(data:UnitDetails) {
  const stmt = database.prepare(`
    INSERT INTO zip_h2_manufacturing_test (
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
      vcell_unloaded,
      h2cellBatch
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    data.vcell_unloaded == 'unknown' ? null : data.vcell_unloaded,
    data.h2cellBatch
  );
  console.log("zip_h2_manufacturing_test saving ==>", result)
}

export function saveAssemblyResults(data:any) {
  const stmt = database.prepare(`
    INSERT INTO zip_h2_assembly (
      batch_number,
      dispenser_serial,
      pcb_serial,
      dispenser_type,
      timestamp
    ) VALUES (?, ?, ?, ?, ?)
  `);

  const timestamp = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', hour12: false });
  let result = stmt.run(
    data.batchNumber,
    data.dispenserSerial,
    data.pcbSerial,
    data.dispenserType,
    timestamp
  );
  console.log("zip_h2_assembly saving ==>", result)
}

// Used for adding new table columns to a specific table, after the tables have already
// been created.
function updateTableSchema(tableName:string, newColumn:{name:string, type:string}) {
  const columns = getColumnNamesAndTypes(tableName);
  let columnExists = false

  columns.forEach((column) => {
    if (columnExists){
      return
    } 
    if (column.name == newColumn.name){
      columnExists = true
      return
    }
  })

  if (columnExists){
    return
  } else {
    addColumnToTable(tableName, newColumn.name, newColumn.type)
  }
}

function addColumnToTable(tableName:string, columnName:string, columnType:string) {
  const stmt = database.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
  stmt.run();
}

function getColumnNamesAndTypes(tableName: string): { name: string, type: string }[] {
  if (!database) {
    throw new Error('Database not initialized');
  }

  const stmt = database.prepare(`PRAGMA table_info(${tableName})`);
  const rows = stmt.all();
  const columns = rows.map((row: any) => ({ name: row.name, type: row.type }));
  return columns;
}


interface DispenserResultsDetails {
  jobNumber: string,
  dispenser_serial: string,
  filling_serials: string[] | null,
  times_filled: number | null,
  timestamp: string | null
}

type DispenserResults = DispenserResultsDetails | Error;

export function readDispenserFillingDetails(jobNumber: string, dispenserSerial: string, ): DispenserResults {
  const query = `SELECT * FROM zip_dispenser_filling WHERE dispenser_serial = ? ORDER BY times_filled DESC LIMIT 1`;
  const selectStatement = database.prepare(query);
  let rows = selectStatement.all(dispenserSerial);
  console.log('here', rows)
  if (rows.length != 0) {
    return rows[0] as DispenserResults;
  }
  return {
    jobNumber: jobNumber,
    dispenser_serial: dispenserSerial,
    filling_serials: null,
    times_filled: 0,
    timestamp: null
  }

  // const stmt = database.prepare(`
  //   INSERT INTO zip_dispenser_filling (
  //     job_number,
  //     dispenser_serial,
  //     times_filled
  //   ) VALUES (?, ?, ?)`)
  // try {
  //   const result = stmt.run(
  //     jobNumber,
  //     dispenserSerial, 
  //     0
  //   );
  //   console.log("zip_dispenser_filling saving ==>", result);
  //   return {
  //     jobNumber: jobNumber,
  //     dispenser_serial: dispenserSerial,
  //     filling_serials: null,
  //     times_filled: 0,
  //     timestamp: null
  //   }
  // } catch (error) {
  //   console.error("Error inserting into zip_dispenser_filling:", error);
  //   return error as Error
  // }
}

export function createDispenserFillingEntry(jobNumber: string, dispenserSerial: string, timesFilled: number): void {
  const stmt = database.prepare(`
    INSERT INTO zip_dispenser_filling (
      job_number,
      dispenser_serial,
      times_filled
    ) VALUES (?, ?, ?)`);
  const result = stmt.run(
    jobNumber,
    dispenserSerial,
    timesFilled
  );
  console.log("zip_dispenser_filling saving ==>", result);
}
