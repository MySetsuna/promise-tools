### 目标

优化 `getUserInfo` 请求

### 要求

`getUserInfo` 是个通用接口，在各个模块里面都有可能使用
`requestUserInfo` 模拟的是请求服务端真正获取用户信息的方法

业务背景
- 在一个页面有 A, B, C 3个功能模块，A, B, C 模块渲染执行顺序不可控
- 每个模块都会调用 getUserInfo 这个方法， 这个方法是可以直接调用 requestUserInfo 获取用户信息
- 调用三次就会发起三次网络请求
- 现在需要优化 getUserInfo 这个方法， 保证 getUserInfo 方法3次调用后， 最终只会发出**一次**网络请求。