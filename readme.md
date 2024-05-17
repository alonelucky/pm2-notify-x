# pm2-notify-x

> 当前项目是一个pm2的进程通知插件模块
> 已实现借助企业微信群机器人的 pm2 进程错误信息实时提醒进程

### 1. 安装使用
```
# 安装并启动模块
pm2 install pm2-notify-x
# 合并通知间隔: 单位秒, 默认 15s
pm2 set pm2-notify-x:delay 15
# 配置机器人key,英文逗号分割，可以同时通知多个机器人
pm2 set pm2-notify-x:wxwork yourbotkey
# 配置机器人key,英文逗号分割，可以同时通知多个Bark终端 https://api.day.app/yourkey
pm2 set pm2-notify-x:bark yoururl
# 配置前增加 pm2 进程名称，可以为进程单独设置配置,例如: pname = your_name, configkey = your_name_bark
pm2 set pm2-notify-x:your_pname_bark yoururl

# 增加 jsonpath 查找，查找规则 https://radash-docs.vercel.app/docs/object/get，查不到依然通知，只不过通知的是消息整体
pm2 set pm2-notify-x:find $.msg
# 增加正则查找，正则支持 正则表达式及字符串, 正则表达式匹配不到的消息不进行通知
pm2 set pm2-notify-x:find /"msg":/ig // will eval('/"msg":/ig')
pm2 set pm2-notify-x:find "msg":   // will new Regexp('"msg":')

# 同时支持进程名称前缀设置指定进程规则
pm2 set pm2-notify-x:your_pname_find $.msg
```

### 2. 项目规划

- [x] 企业微信 `wxwork` [文档](https://developer.work.weixin.qq.com/document/path/91770)
- [x] Bark通知 `bark` [文档](https://bark.day.app/#/tutorial?id=url%e6%a0%bc%e5%bc%8f)
- [x] Slack通知 `slack` [文档](https://api.slack.com/reference/surfaces/formatting#attachments)
- [x] Telegram通知 `telegram` [文档](https://core.telegram.org/bots/api#formatting-options)
- [x] 钉钉通知 `dingtalk` [文档](https://open.dingtalk.com/document/orgapp/custom-bot-send-message-type#)
- [x] 飞书通知 `feishu` [文档](https://open.feishu.cn/document/common-capabilities/message-card/message-cards-content/card-structure/card-content)
- [x] 按进程区分通知
- [x] 增加消息规则匹配

### 3. 使用示例

```
$> pm2 l
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 4  │ test               │ fork     │ 378  │ online    │ 0%       │ 0b       │
│ 9  │ test               │ fork     │ 64   │ online    │ 0%       │ 0b       │
│ 6  │ test111            │ fork     │ 15   │ online    │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```
- 全局配置
```bash
# 合并通知间隔: 单位秒, 默认 15s
$> pm2 set pm2-notify-x:delay 15
# 设置调试日志输出
$> pm2 set pm2-notify-x:debug true
# 设置日志匹配规则
# 增加 jsonpath 查找，查找规则 https://radash-docs.vercel.app/docs/object/get，查不到依然通知，只不过通知的是消息整体
pm2 set pm2-notify-x:find $.msg
# 增加正则查找，正则支持 正则表达式及字符串, 正则表达式匹配不到的消息不进行通知
pm2 set pm2-notify-x:find /"msg":/ig    # will eval('/"msg":/ig')
pm2 set pm2-notify-x:find "msg":        # will new Regexp('"msg":')
```

- 设置企微通知
```bash
$> pm2 set pm2-notify-x:wxwrok uuidkey

# 为 test 程序设置企微通知
$> pm2 set pm2-notify-x:test_wxwrok uuidkey
```

- 设置Slack通知
```bash
# 为 test111 程序设置企微通知
$> pm2 set pm2-notify-x:test111_slack slackurl
```

- 设置 telegram 通知
```bash
# 为 test111 程序设置指定解析匹配通知
$> pm2 set pm2-notify-x:test111_telegram tgboturl
$> pm2 set pm2-notify-x:test111_find $.msg
```