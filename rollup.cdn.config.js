import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { toCamelCase } from 'ntils';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

const externals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
}

const createConf = ({
  name = pkg.name,
  min = false
} = {}) => {
  const suffix = min ? '.min' : '';
  return {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/${name}-umd${suffix}.js`,
        format: 'umd',
        globals: externals,
        name: toCamelCase(name, 1)
      },
      {
        file: `./dist/${name}-iife${suffix}.js`,
        format: 'iife',
        globals: externals,
        name: toCamelCase(name, 1)
      }
    ],
    external: Object.keys(externals),
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
          'path-browserify': [
            'resolve',
            'normalize',
          ]
        }
      }),
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