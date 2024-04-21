---
title: '[gruyere|笔记]一个web平台的漏洞学习笔记-'
date: 2021-03-02 11:15:59
tags: [靶场]
published: true
hideInList: false
feature: 
isTop: false
---
Web Application Exploits and Defenses (google-gruyere.appspot.com) 
据说是包括了所有web2.0的漏洞

## 使用前需知

### 漏洞发现方法
you'll use both black-box hacking and white-box hacking

### 白盒审计说明（source code）
http://google-gruyere.appspot.com/code/


Gruyere is small and compact. Here is a quick rundown of the application code:
- gruyere.py is the main Gruyere web 
- serverdata.py stores the default data in the database. There is an administrator account and two default users.
- gtl.py is the Gruyere template language
- sanitize.py is the Gruyere module used for sanitizing HTML to protect the application from security holes.
- resources/... holds all template files, images, CSS, etc.
### 重置沙盒状态（Reset Button）：
在沙盒环境变得无法使用时……
As noted above, each instance is sandboxed so it can't consume infinite resources and it can't interfere with anyone else's instance. Notwithstanding that, it is possible to put your Gruyere instance into a state where it is completely unusable. If that happens, you can push a magic "reset button" to wipe out all the data in your instance and start from scratch. To do this, visit this URL with your instance id:
https://google-gruyere.appspot.com/resetbutton/123
### 关于id

在第一关的时候你会获取一个id。以后的关卡都需要第一次给你的id，如果你需要给别人分享你正在破解的关卡也可以把带id的url分享给别人。

Your Gruyere instance id is 

558692305032828541672765603645926815579
注册了个uzks的用户 
http://google-gruyere.appspot.com/558692305032828541672765603645926815579/

我这里主要采用黑盒审计的方式
## 笔记位置：
印象笔记导出MD太难了。。。还直接导出pdf共享notion 的连接好啦。一个刷题记录。基本是全刷了。不能刷的多半是讲知识点。
**🍡链接：**

https://www.notion.so/Gruyere-web2-0-web-securit-fd0c03f4cf4740d9b3ba85f2b02c6d9c