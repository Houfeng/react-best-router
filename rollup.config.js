import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const externals = [
  'react',
  'react-dom',
  'path-to-regexp',
  'path-browserify',
];

const createConf = ({
  name = pkg.name,
  min = false
} = {}) => {
  const suffix = min ? '.min' : '';
  return {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/${name}-es${suffix}.js`,
        format: 'es',
      },
      {
        file: `./dist/${name}-cjs${suffix}.js`,
        format: 'cjs'
      },
    ],
    external: externals,
    plugins: [
      resolve(),
      min && terser(),
      cleanup({ comments: 'none' }),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ].filter(Boolean)
  };
};

export default [
  createConf(),
  createConf({ min: true }),
];