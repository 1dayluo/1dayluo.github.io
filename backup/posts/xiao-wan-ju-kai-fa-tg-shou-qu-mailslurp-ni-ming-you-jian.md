---
title: '小玩具开发:tg收取mailslurp匿名邮件'
date: 2023-11-26 19:25:53
tags: []
published: false
hideInList: false
feature: 
isTop: false
---
## 写在开头
因为日常会经常用到匿名邮箱进行测试/注册一些临时用户, 觉得web页面有点麻烦, 而且批量收发的话,把APT KEY写一起,然后集中管理多个不同帐号下的邮箱会比较方便.于是写了一个基于mailslurp的多帐号匿名邮箱管理:https://github.com/1dayluo/tgbot_anonymousmail 
包括:创建匿名邮箱,多用户支持, 和创建新匿名邮箱,未来还考虑支持发送邮件.
( 没什么系统前端学习经验,都是所到之处学到哪里,欢迎指出一些不太规范的内容)



## tg bot开发指北
首先,先去https://t.me/BotFather申请创建bot,然后把你的TOKEN拷贝下来.
tg bot支持两种模式: polling和webhook,这里polling不作为推荐,一个是耗费资源,另一个其并不支持serverless部署.但本地开发我这边还是会用polling的模式进行测试的.另外,我的项目开发主要采用cmmoonJS规范

创建一个bot
```javascript
const { Telegraf, } = require('telegraf')

const bot = TGTOKEN?new Telegraf(TGTOKEN):new Telegraf(process.env.TGTOKEN)
```

bot回应命令:
```javascript
bot.command('hello', async (ctx) => {
     await ctx.reply('hello world');

});
```
其余看文档吧 文档很全. 如果需要部署在cf worker上,这里是配合cf worker提供的全局变量来做的, 例如,你可以在我的代码里看到:
```javascript
const bot = TGTOKEN?new Telegraf(TGTOKEN):new Telegraf(process.env.TGTOKEN)
```
这个就是用于支持cf worker或本地读取环境变量两种模式的.
另外,我也参考了:https://moe.best/tutorial/cfworker-telegraf-tgbot.html 上的内容,
