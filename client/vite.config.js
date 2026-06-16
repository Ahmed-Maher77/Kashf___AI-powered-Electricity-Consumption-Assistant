import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'


const esToolkitRoot = path.resolve('node_modules/es-toolkit')
const esToolkitEsm = {}
const shimNames = ['get', 'omit', 'range', 'maxBy', 'sumBy', 'minBy', 'sortBy', 'throttle', 'last', 'isPlainObject', 'uniqBy']
const shimDirs = { get: 'object', omit: 'object', range: 'math', maxBy: 'math', sumBy: 'math', minBy: 'math', sortBy: 'array', throttle: 'function', last: 'array', isPlainObject: 'predicate', uniqBy: 'array' }
for (const name of shimNames) {
  esToolkitEsm['es-toolkit/compat/' + name] = path.join(esToolkitRoot, 'dist/compat', shimDirs[name], name + '.mjs')
}


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'es-toolkit-default-export',
      transform(code, id) {
        if (id.endsWith('.mjs') && id.includes('es-toolkit/dist/compat/')) {
          const exportMatch = code.match(/export\s+\{\s*(\w[\w$]*)\s*\};?\s*$/)
          if (exportMatch) {
            const name = exportMatch[1]
            return code + `\nexport { ${name} as default };`
          }
        }
      }
    }
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'es-toolkit-default-export-esbuild',
          setup(build) {
            build.onLoad({ filter: /es-toolkit\/dist\/compat\/.*\.mjs$/ }, async (args) => {
              let code = await fs.promises.readFile(args.path, 'utf-8')
              const exportMatch = code.match(/export\s+\{\s*(\w[\w$]*)\s*\};?\s*$/)
              if (exportMatch) {
                const name = exportMatch[1]
                code += `\nexport { ${name} as default };`
              }
              return { contents: code, loader: 'js' }
            })
          }
        }
      ]
    }
  },
  resolve: {
    alias: esToolkitEsm
  },
  server: {
    port: 5173
  }
})
