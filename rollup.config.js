import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import eslint from '@rollup/plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
// rollup.config.js
export default {
    // 核心选项
    'input': './src/index.ts', // 必须
    'plugins': [
        eslint({
            'fix': true,
            'throwOnError': true,
            'throwOnWarning': false,
            'include': ['src/**']
        }),
        typescript(),
        commonjs({ 'extensions': ['.js', '.ts'] }), // the ".ts" extension is required
        babel({
            'exclude': 'node_modules/**' // 只编译我们的源代码
        }),
        uglify(),
        terser()
    ],
    'output': { // 必须 (如果要输出多个，可以是一个数组)
        // 核心选项
        'file': './dist/bundle.js', // 必须
        'format': 'cjs' // 必须
    }
};