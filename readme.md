# pm2-notify-x

> 当前项目是一个pm2的进程通知插件模块
> 已实现借助企业微信群机器人的 pm2 进程错误信息实时提醒进程

### 1. 安装使用
```
# 安装并启动模块
pm2 install pm2-notify-x
# 配置机器人key
pm2 set pm2-notify-x:wxworkBotKeys yourbotkey
# 配置多个机器人Key分隔符, 默认值 `,`
pm2 set pm2-notify-x:splitChar ,
```

### 2. 项目后期

[x] 企业微信
[] 邮件通知
[] 对接tg
[] 自定义提醒url
[] 自定义请求模板
[] 自定义提醒错误类型

### 3. 常见问题

1. 中文展示
linux服务器上默认的字符集是`en_US.utf8`, 因此输出文字中包含中文,则展示未乱码, 参照如下文章配置中文

[linux服务器默认使用中文字符集zh_CN.UTF-8](https://www.cnblogs.com/xuanbjut/p/11578154.html)