import { babel } from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";

export default {
  input: "src/index.js",
  output: {
    format: "umd", // 模块化类型
    name: "Vue", // 打包后的全局变量的名字
    file: "dist/umd/vue.js",
    sourcemap: true, // es6 -> es5 开启源码调试 可以找到源代码的报错位置
  },
  plugins: [
    babel({
      exclude: "node_modules/**", // 不进行转义
    }),
    serve({
      open: true,
      port: 3000, // 打开的浏览器端口号是3000
      contentBase: "", // 以哪个文件夹作为静态服务 为空表示默认当前目录下的html
    }),
  ],
};
