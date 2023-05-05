### 目标

使用 React, <strong style="color:#FF0000;">参考下述需求优先级和设计稿</strong>，实现倒计时抢券组件。

### 关键需求点

- **功能1:** 按钮自动倒计时(此功能重要占比60%)
  - 进入页面时，卡片中的按钮开始自动 10s 倒计时
  - 倒计时过程中, 按钮显示剩余时间 (文案为: 10s、9s、8s、...、1s)
  - 倒计时结束后，按钮文案变为「**抢购**」
- **功能2:** 抢购功能模拟(此功能重要占比20%)
  - 点击抢购按钮时，调用异步模拟请求方法，请求完成后按钮文字变为「**已抢购**」
  - 异步请求模拟方法需自行实现，延迟 1s 后返回成功即可
- **功能3:** 还原券css样式(此功能重要占比20%)
  - 副标题最多支持2行, 多余2行省略号表示

### 设计稿

<p style="text-align:center;">
  <img
    src="https://gw.alipayobjects.com/mdn/rms_c89991/afts/img/A*7ayRRKqI5jUAAAAAAAAAAAAAARQnAQ"
    style="width:80%;max-width:500px;"
  />
  <br />
  <a href="https://gw.alipayobjects.com/mdn/rms_c89991/afts/img/A*7ayRRKqI5jUAAAAAAAAAAAAAARQnAQ" target="_blank">
    点击查看设计稿原图
  </a>
</p>
