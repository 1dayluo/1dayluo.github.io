---
title: '新主题：Cute-Notes & 简明二次开发指北'
date: 2023-01-29 09:55:48
tags: [前端,折腾,全栈]
published: true
hideInList: false
feature: 
isTop: false
---
年前就有自定义自己的blog主题的想法，直到tg有人问我当前默认主题我也没有开动，但是提醒了我之前的这个计划……趁着过年补学了nodejs的web framework：express和view engine:ejs的相关知识。在这里，我将用不需要系统学习这些额外开发知识的方法，简单地讲一下如何自己魔改官方的主题（这里我魔改的是Gridea的Notes，且暂时没有用到less开发）
首先，先是~~一波卖瓜自夸（不是)~~ 主题展示：
![](https://camo.githubusercontent.com/0f36cfef1f4390500f55936cb206615c420571baafc014fac58587c3c39f0176/68747470733a2f2f692e696d6775722e636f6d2f6f5451304a53482e706e67)

默认文章图片配图，和首页右侧的图片都是可以自定义的。
在这里，我用了tailwindcss引擎来输出首页要用的css主题模板，同时修改了首页的nodejs，让他们读取配置文件。


## 修改需要的知识

### ejs
ejs是为了实现动态模板，加载javascript变量到html中而设计的，它是配合express使用的view engine之一。文件扩展名不再是 `.html` 而是 `.ejs` 。在 `ejs` 文件下，有以下几种表达
- `<%  %>` : 用于插入一些javascript的语法，例如一些逻辑判断，循环，数组遍历等
- `<%= %>` : 用于将对应的javascript变量显示出来。默认变量处理后，输出的都是 string类型
- `<%- %>` : 用于读取一些raw html的内容，为了将header，footer这种重复的html导入。从而减少代码冗余
  

### Gridea-自定义配置文件
在 `config.json` 下。注意符合json格式要求，不然gridea会闪退而不是报错（昨天不小心多了一个逗号）。我的主题新增了以下两个配置：
```json
    {
      "name": "defaultPostPic",
      "label": "默认首页文章图片",
      "group": "图片",
      "value": "https://i.imgur.com/9gj5PAl.png",
      "type": "textarea",
      "card": "other",
      "note": "图片网址"
    },
    {
      "name": "bgPic",
      "label": "首页侧边图",
      "group": "图片",
      "value": "https://i2.100024.xyz/2023/01/29/1764550262.webp",
      "type": "textarea",
      "card": "other",
      "note": "图片网址"
    }
```
当你使用ejs的时候，导入则仅用 ` site.customConfig.bgPic ` 即可
```ejs
  <body class="bg-custom" style="background-image: url('<%= site.customConfig.bgPic %>')" >
```
未来考虑首页文章默认配图可以提供多个，然后随机选择为文章配图。（当然，如果文章本身设置了配图选项，则不会调用这个配图库随机选择的函数）


最后的最后大雾吐槽：明明是喜欢萌妹，可是为什么现在首页看起来这么的弍刺螈（恼）