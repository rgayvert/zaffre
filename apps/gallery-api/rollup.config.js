import esbuild from 'rollup-plugin-esbuild'

const bundle = config => ({
  ...config,
  input: 'src/server.ts',
  external: id => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `./out/server.js`,
        format: 'es',
        sourcemap: false,
      },
    ],
  }),
]
