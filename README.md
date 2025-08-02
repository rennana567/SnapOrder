# react 点单 APP

## 技术栈
- React 全家桶
  待完善...
- module css
- vite 配置
- git 提交等编程风格

## 项目的架构
- mock
- src
  - api
  - components
  - hooks
  - pages
    - Account
    - Home
    - Login
    - NotFound
    - Order
    - Search
  - store

## 开发前的准备
- 安装的包
    react-router-dom zustand axios 
      react-vant（UI组件库）
    react-vant
    开发期间的依赖
    vite-plugin-mock jwt 
- vite 配置
  - alias
  - mock
  - user-scalable=no 禁止缩放
  - css 预处理
      index.css reset
      box-sizing border-box  font-family:-apply-system
      App.css  全局通用样式
      module.css  模块化样式
  - 移动端的适配 rem
      用相对单位rem html
      不同设备上体验一致
      不同尺寸手机 等比例缩放
      设计师设计稿 750px 
      css 一行代码  手机的不同尺寸 html font-size 等比例
      layout
      flexible.js 阿里的 在任何设备上
      1rem = 屏幕宽度/10
- lib-flexible
  阿里开源
  设置html fontSize = window
  innerWidth / 10
  css px 宽度 = 手机设备宽度 = 375
  1px = 2发光源
  750px 设计稿

## git 提交规范
- 项目初始化
- 忽略提交
  node_modules/
  *.local
## 功能模块
- UI 组件库
  - react-vant  第三方组件库

## 项目亮点和难点
- 移动端适配 还原设计稿
  - lib-flexible  1rem = 屏幕宽度/10
  - 设计稿 尺寸是iphone 标准尺寸 750px
  - 自动化
      postcss + postcss-pxtorem
      postcss 自动将px转换为rem css预编译器
      vite自动读取postcss.config.js 将css文件编译
- 原子css
  - 各自模块里module.css 不影响别的组件
  - postcss pxtorem 插件 快速还原设计稿
  - lib-flexible 移动端适配
  - 原子类的css
      一个元素按功能逻辑拆分成多个类，和原子一样
      元素的样式就可以由这些原子类组合而成
      样式可以复用的更好，以后几乎可以不用写样式
- 用户体验优化

## 项目遇到过什么问题，怎么解决的

## 通用组件开发
