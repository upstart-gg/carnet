import { defineConfig } from 'bunup'

export default defineConfig({
  name: 'lib',
  format: 'esm',
  entry: ['src/lib/index.ts', 'src/cli/index.ts'],
  outDir: 'dist',
  dts: {
    splitting: true,
    // entry: ['src/lib/index.ts'],
  },
})
