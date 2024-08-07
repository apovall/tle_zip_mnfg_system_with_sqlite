
import path from 'node:path'
import Database from 'better-sqlite3'

const root = import.meta.env.VITE_COMMAND === 'serve'
  ? import.meta.env.VITE_DEV_ROOT
  : path.join(__dirname, '..')
const TAG = '[better-sqlite3]'
let database: Database.Database

export function createTable(tableName) {
  const createTable = database.prepare(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL
    );
  `);
  createTable.run();
}

function readTable(tableName) {
  const selectStatement = database.prepare(`SELECT * FROM ${tableName}`);
  const rows = selectStatement.all();
  // console.log(rows);
  return rows;
}

export function getSqlite3(filename: string) {
  // console.log(filename)
  // console.log(root)
  // console.log(import.meta.env.VITE_BETTER_SQLITE3_BINDING)
  database ??= new Database(filename, {
    // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L36
    // https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/lib/database.js#L50
    nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING),
  })
  createTable('cats')
  const statement = database.prepare('INSERT INTO cats (name, age) VALUES (?, ?)');
  const result = statement.run('Horaz', 12);  // Pass parameters to the query
  // console.log(result)

  const rows = readTable('cats')
  // console.log(rows)
  return database
}
