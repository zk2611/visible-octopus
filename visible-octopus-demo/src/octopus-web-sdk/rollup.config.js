// import typescript from 'rollup-plugin-typescript2';			// TS转译
import { nodeResolve } from '@rollup/plugin-node-resolve';  // 加载通过npm安装的第三方依赖
import { babel } from '@rollup/plugin-babel';								// 转译插件，ES6转ES5
import commonjs from '@rollup/plugin-commonjs';							// 加载commonjs模块
import { terser } from "rollup-plugin-terser";							// 压缩
import livereload from 'rollup-plugin-livereload';          // 热更新

export default {
  input: './index.js',
  output: {
    file:'dist/bundle.js',           // 输出文件
    format: 'umd',                   // 五种输出格式：amd | es6 | iife | umd | cjs
    name:'visible-octopus-js-sdk',   // 当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
    sourcemap: true                  // 生成bundle.map.js文件，方便调试
  },
  plugins: [
    // typescript(),  // 会自动读取 文件tsconfig.json配置
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
    livereload(),
  ]
};