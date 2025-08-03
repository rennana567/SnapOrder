# react 点单 APP

## 技术栈
- React 全家桶
    React 组件开发
    组件的封装
    第三方组件库
    hooks编程 自定义
    React-Router-DOM
      SPA
      懒加载
    memo
    Zustand
- module css
- vite 配置
- 移动端适配
- git 提交等编程风格
- mock 接口模拟
- axios 请求拦截和代理
- 性能优化
  防抖节流
  useMemo
-LLM
  - chat

## 项目的架构
- mock
  - data.js
- src
  - api
    - config.js
    - search.js
  - components
    - BlankLayout
    - Loading
    - MainLayout
  - hooks
    - useTitle
  - llm
  - pages
    - Account
    - Collection
    - Consultant
    - Home
    - Login
    - NotFound
    - Order
    - Search
  - store
    - useSearchStore.js
  - utils

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
- 配置路由及懒加载
  - 懒加载
  - 路由守卫
  - Layout组件
    - 嵌套路由Outlet 分组路由配置
    - 网页有几个模板 Layout
      - Route 不加path 对应的路由自动选择
      - tabbar 模板
      - blank 模板
  - tabbar
    - react-vant + @react-vant/icons
    - value + onChange 响应式
    - 直接点击tabbar 切换路由
- Search
  - 防抖
  - api
    GoogleSuggest
  - localStorage
- chatbot 模块
  - llm模块 chat 封装
  - 迭代chat， 支持任意模型
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
- 自定义组件
  useTitle  切换页面标题也切换为对应的标题
- 用户体验优化
  - 组件粒度划分
    React.memo
  - 懒加载
  - SPA
  - 搜索建议  防抖
  - 热门推荐
- 前端智能
  - chat 函数
  - 对各家模型比较感兴趣，升级为kimiChat、302ai...
    性能、能力、性价比
    随意切换大模型，通过参数抽象
## 项目遇到过什么问题，怎么解决的
- es6 特性使用
  tabbar的高亮
  - arr.findIndex
  - str.startsWith
  - promise
- Uncaught TypeError: hotList.map is not a function
  打印hotList  —— 对象？
  config拦截再加一层.data
- 自定义hooks
  两次useEffect 和页面是否加载完成没关系
  直接去掉useEffect
- chat messages 覆盖问题
  闭包问题 直接设置值导致
  (prev)=>{} 处理
- 项目迭代
  - 功能由浅入深
  - chatbot deepseek 简单chat

## 通用组件开发
- Loading
  - 居中方案
    position: fixed;+ tlrb0 + margin: auto;
  - React.memo 无状态组件，不重新渲染
  - animation