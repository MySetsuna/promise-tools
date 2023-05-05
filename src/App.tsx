import './App.css'
import { Markdown, Paper } from '@ant-campus/exam-react';
import '@ant-campus/exam-react/dist/style.css';
import exam$1 from './exams/1/index';
import exam$2 from './exams/2/index';
import exam$3 from './exams/3/index';

const headline = "## 笔试说明\n\n1. 请根据下面的题目说明在限定时间内完成 exams 目录中的题目\n2. 每道题目都有运行结果，仅供你参考\n3. 请写好必要的注释\n4. TypeScript 不是必选项，你可以写纯 JavaScript\n";

/** @type Array<import('@ant-campus/exam-react').IExamDef> */
const exams = [
      { title: "第一题", render: exam$1, description: "### 目标\n\n使用 React, <strong style=\"color:#FF0000;\">参考下述需求优先级和设计稿</strong>，实现倒计时抢券组件。\n\n### 关键需求点\n\n- **功能1:** 按钮自动倒计时(此功能重要占比60%)\n  - 进入页面时，卡片中的按钮开始自动 10s 倒计时\n  - 倒计时过程中, 按钮显示剩余时间 (文案为: 10s、9s、8s、...、1s)\n  - 倒计时结束后，按钮文案变为「**抢购**」\n- **功能2:** 抢购功能模拟(此功能重要占比20%)\n  - 点击抢购按钮时，调用异步模拟请求方法，请求完成后按钮文字变为「**已抢购**」\n  - 异步请求模拟方法需自行实现，延迟 1s 后返回成功即可\n- **功能3:** 还原券css样式(此功能重要占比20%)\n  - 副标题最多支持2行, 多余2行省略号表示\n\n### 设计稿\n\n<p style=\"text-align:center;\">\n  <img\n    src=\"https://gw.alipayobjects.com/mdn/rms_c89991/afts/img/A*7ayRRKqI5jUAAAAAAAAAAAAAARQnAQ\"\n    style=\"width:80%;max-width:500px;\"\n  />\n  <br />\n  <a href=\"https://gw.alipayobjects.com/mdn/rms_c89991/afts/img/A*7ayRRKqI5jUAAAAAAAAAAAAAARQnAQ\" target=\"_blank\">\n    点击查看设计稿原图\n  </a>\n</p>\n" },
  { title: "第二题", test: exam$2, description: "### 目标\n\n优化 `getUserInfo` 请求\n\n### 要求\n\n`getUserInfo` 是个通用接口，在各个模块里面都有可能使用\n`requestUserInfo` 模拟的是请求服务端真正获取用户信息的方法\n\n业务背景\n- 在一个页面有 A, B, C 3个功能模块，A, B, C 模块渲染执行顺序不可控\n- 每个模块都会调用 getUserInfo 这个方法， 这个方法是可以直接调用 requestUserInfo 获取用户信息\n- 调用三次就会发起三次网络请求\n- 现在需要优化 getUserInfo 这个方法， 保证 getUserInfo 方法3次调用后， 最终只会发出**一次**网络请求。" },
  { title: "第三题", test: exam$3, description: "### 目标\n\n进阶加分可选：优化 `requestUserProfile` 并发请求\n\n### 要求\n\n业务背景\n- `requestUserProfile` 是个通用查询用户信息接口，通过传入uid，拿用户昵称\n- 在一个支付宝群聊里有10多个用户，点击群聊信息，展示各个人的昵称\n  -  10个并发请求，会阻塞接口\n  -  10个依次请求，耗时久，显示昵称太慢\n- 需要优化请求，在并发和耗时之间掌握一个平衡\n" }
    ];

function App() {
  return (
    <div className="App">
    <Markdown text={headline} />
    <Paper exams={exams} />
  </div>
  )
}

export default App
