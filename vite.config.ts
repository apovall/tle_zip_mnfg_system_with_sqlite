import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os' // Import the os module
import {
  type Plugin,
  defineConfig,
  normalizePath,
} from 'vite'
// import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

export default defineConfig(({ command }) => {
  const isServe = command === 'serve'

  return {
    build: {
      minify: false,
      commonjsOptions: {
        ignoreDynamicRequires: true,
      },
    },
    plugins: [
      electron({
        main: {
          entry: 'electron/main.ts',
        },
        preload: {
          input: path.join(__dirname, 'electron/preload.ts'),
        },
        renderer: {
          resolve: isServe ? {
            'better-sqlite3': { type: 'cjs' },
          } : undefined,
        },
      }),
      bindingSqlite3({ command }),
    ],
  }
})

function bindingSqlite3(options: {
  output?: string;
  better_sqlite3_node?: string;
  command?: string;
} = {}): Plugin {
  const TAG = '[vite-plugin-binding-sqlite3]'
  options.output ??= 'dist-native'
  options.better_sqlite3_node ??= 'better_sqlite3.node'
  options.command ??= 'build'

  // Determine the correct path functions based on the operating system
  const isWindows = os.platform() === 'win32'
  const pathResolve = isWindows ? path.win32.resolve : path.posix.resolve
  const pathJoin = isWindows ? path.win32.join : path.posix.join

  return {
    name: 'vite-plugin-binding-sqlite3',
    config(config) {
      const resolvedRoot = normalizePath(config.root ? pathResolve(config.root) : process.cwd())
      const output = pathResolve(resolvedRoot, options.output) // Use the conditionally chosen path.resolve
      const better_sqlite3 = require.resolve('better-sqlite3')
      const better_sqlite3_root = pathJoin(better_sqlite3.slice(0, better_sqlite3.lastIndexOf('node_modules')), 'node_modules', 'better-sqlite3')
      const better_sqlite3_node = pathJoin(better_sqlite3_root, 'build', 'Release', options.better_sqlite3_node)
      const better_sqlite3_copy = pathJoin(output, options.better_sqlite3_node)

      if (!fs.existsSync(better_sqlite3_node)) {
        throw new Error(`${TAG} Cannot find "${better_sqlite3_node}".`)
      }

      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true })
      }

      fs.copyFileSync(better_sqlite3_node, better_sqlite3_copy)

      // Read the content of the .env.dev file
      let envDevContent = ''
      const envDevPath = path.join(resolvedRoot, '.env.aws')
      if (fs.existsSync(envDevPath)) {
        envDevContent = fs.readFileSync(envDevPath, 'utf-8')
      }

      
      const BETTER_SQLITE3_BINDING = better_sqlite3_copy.replace(`${resolvedRoot}${path.sep}`, '')
      fs.writeFileSync(
        path.join(resolvedRoot, '.env'),
`${envDevContent}
VITE_BETTER_SQLITE3_BINDING=${BETTER_SQLITE3_BINDING}
VITE_COMMAND=${options.command}
VITE_DEV_ROOT=${resolvedRoot}`.trim(),
      )
      console.log(TAG, `binding to ${BETTER_SQLITE3_BINDING}`)
    },
  }
}
