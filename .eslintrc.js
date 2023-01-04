module.exports = {
  root: false,
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'never',
          component: 'never'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 禁用debugger
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off', // // 禁用未声明的变量，除非它们在 /*global */
    // 'eslint-disable': true,
    // 首行缩进
    // "indent": [2, "tab"],
    camelcase: [0, { properties: 'never' }],
    eqeqeq: 0, // 关闭强制使用 ===  !==
    // "indent": [2, "tab"], // 首行缩进
    'no-tabs': 0, // 不允许使用 tab 字符，包括在注释内
    'vue/no-use-v-if-with-v-for': 0,
    'space-before-function-paren': ['error', 'never'], // 要求或禁止函数圆括号之前有一个空格
    'arrow-parens': ['error', 'as-needed'], // 要求箭头函数的参数使用圆括号
    'eslint no-return-assign': 0 // 禁止在返回语句中赋值
  }//,
  // parserOptions: {
  //   parser: 'babel-eslint'
  // }
}
