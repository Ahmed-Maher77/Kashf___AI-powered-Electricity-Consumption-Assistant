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
    rolldownOptions: {
      plugins: [
        {
          name: 'es-toolkit-default-export-rolldown',
          transform(code, id) {
            if (id.endsWith('.mjs') && (id.includes('es-toolkit/dist/compat/') || id.includes('es-toolkit\\dist\\compat\\'))) {
              const exportMatch = code.match(/export\s+\{\s*(\w[\w$]*)\s*\};?\s*$/)
              if (exportMatch) {
                const name = exportMatch[1]
                return {
                  code: code + `\nexport { ${name} as default };`,
                  map: null
                }
              }
            }
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
