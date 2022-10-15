import babel from "@rollup/plugin-babel";
// rollup.config.js
export default {
    // 核心选项
    input: './src/index.js',     // 必须
    plugins: [
      babel({
        exclude: 'node_modules/**' // 只编译我们的源代码
      })
    ],
    output: {  // 必须 (如果要输出多个，可以是一个数组)
      // 核心选项
      file: './dist/bundle.js',    // 必须
      format: 'cjs',  // 必须 
    },
  };