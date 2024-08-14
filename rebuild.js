const path = require('path');
const child = require('child_process');

// If you prefer electron-rebuild:
// 👉 https://github.com/WiseLibs/better-sqlite3/blob/v8.5.2/docs/troubleshooting.md#electron
// 👉 https://stackoverflow.com/questions/46384591/node-was-compiled-against-a-different-node-js-version-using-node-module-versio/52796884#52796884
// TODO: These posix paths work for mac and ubuntu, but break for Windows
// Removing them works for windows, so need to update the code to dynamically select the path
const better_sqlite3 = require.resolve('better-sqlite3');
let better_sqlite3_root
let cmd
let platform = process.platform
if (platform == 'win32' || platform == 'win64'){
  better_sqlite3_root = path.join(better_sqlite3.slice(0, better_sqlite3.lastIndexOf('node_modules')), 'node_modules/better-sqlite3');
  cmd = "npm.cmd"
} else {
  better_sqlite3_root = path.posix.join(better_sqlite3.slice(0, better_sqlite3.lastIndexOf('node_modules')), 'node_modules/better-sqlite3');
  cmd = 'npm'
}

console.log('Spawning process with the following parameters:');
console.log(`Arguments: ['run', 'build-release', '--target=${process.versions.electron}', '--dist-url=https://electronjs.org/headers']`);
console.log(`Working Directory: ${better_sqlite3_root}`);

const cp = child.spawn(
  cmd,
  [
    'run',
    'build-release',
    `--target=${process.versions.electron}`,
    // https://github.com/electron/electron/blob/v26.1.0/docs/tutorial/using-native-node-modules.md#manually-building-for-electron
    '--dist-url=https://electronjs.org/headers',
  ],
  {
    cwd: better_sqlite3_root,
    stdio: 'inherit',
  },
);

cp.on('error', (err) => {
  console.error(`Error occurred while spawning the process: ${err.message}`);
  process.exit(1);
});

cp.on('exit', code => {
  if (code === 0) {
    console.log('Rebuild better-sqlite3 success.');
  }
  process.exit(code);
});
