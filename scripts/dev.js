/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

运行Rollup的watch模式用于开发

如果需要指定watch的包，传入包名name、build格式即可（默认format是global，即iife自调函数的格式，可在浏览器使用）

```
# name supports fuzzy match. will watch all packages with name containing "dom"
yarn dev dom

# specify the format to output
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false yarn dev

# 构建名字/即package名 支持模糊匹配
# 例如yarn dev dom，支持所有名称包含dom的包

# 声明输出格式
# 例如cjs模式：yarn dev core --formats cjs

# 如果想使用生产模式，可以将__DEV__环境变量设置为false
rollup文件逻辑：const isProductionBuild = process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
```
*/

// execa：https://github.com/sindresorhus/execa
const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')

// minimist库：http://jarvys.github.io/2014/06/01/minimist-js/
// args：执行当前文件的脚本的所有参数
const args = require('minimist')(process.argv.slice(2))

// args._是指所有的游离参数（游离是指单个参数，--paraName paraValue是成对的参数和值）
// target：构建目标
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'

// formats打包的格式：例如-f global，或者 --formats global
const formats = args.formats || args.f

// --sourcemap -s 映射文件
const sourceMap = args.sourcemap || args.s

// git仓库检测
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

// 执行rollup命令
execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`,
      sourceMap ? `SOURCE_MAP:true` : ``
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
