---
title: '我的「搞机」日常（破真）  - 开源系统GrapheneOS的推荐'
date: 2022-11-26 15:23:30
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
## 开端

关于我是怎么突然想到需要搞机想法，说（一）来（篇）话（水）长（文）系列（？）

如果从手机算起的话（~~不算高中生涯的尝试给自己ipod越狱，最后第二次越狱变砖没敢告诉我爹这件事的话~~），首先最初的搞机男票票送我的多亲2觉得原生系统用起来卡顿，想解锁重装，安第三方ROM。当年看的教程指路：https://listed.to/p/xchVAPt0nB（重装后依旧是良好的遥控器w），那个时候就又一次燃起了信心，突然想再多玩几次

但，我是个很懒的用户，虽然很早买了一加手机，可最开始没有进行刷机，后来想到数据迁移，数据备份一堆的事情又很麻烦，就一直不了了之，直到后来，看到了一个subreddit的论坛....

在好奇心的趋势下，我开始了解如何拥有第一个属于自己的开源系统手机

### AOSP Derivatives

AOSP，即Android Open Soure Project，是由google领导的开源移动操作系统，具体介绍可以看官方：

https://www.privacyguides.org/android/

>  Most phones sold with Android are modified to include invasive integrations and apps such as Google Play Services, so you can significantly improve your privacy on your mobile device by replacing your phone's default installation with a version of Android without these invasive features

所以为了摆脱Android系统的捆绑，实现个人隐私，我们可以安装一些开源的操作系统，可选的开源操作系统有：

- GrapheneOS
  
- DivestOS
  

这里推荐使用GrapheneOS,它实现了一些额外的安全加固（[security hardening](https://en.wikipedia.org/wiki/Hardening_(computing)) ）和隐私实现：GrapheneOS also comes with full firmware updates and signed builds, so verified boot is fully supported.

具体的全部安全特性可查看：[Features overview | GrapheneOS](https://grapheneos.org/features)

同时它也支持沙盒化的Google Play（关于如何以匿名用户，不用google框架下载google play商店的app我会在后文写出）。

## 选择手机

因为官方指南中提到“Google Pixel phones are the only devices that currently meet GrapheneOS's [hardware security requirements](https://grapheneos.org/faq#device-support).“，所以我选择了Google pixel，因为经济原因，不考虑买最新的pixel。看了很多评测视频，总结如下：

- pixel 4 系列是性价比最高的机型 ，便宜（
  
- pixel 5 系列支持5G，支持指纹解锁，若是主用机则可考虑
  

购买我选择了某海鲜市场，这里注意，一定要避开运营商版本的，例如Verizon版的。买了运营商版本的，基本等于白买，是无法开启OEM锁的。

这里我第一次踩坑，买了5发现OEM打不开，又买了4xl （~~而且想到日用机被什么微信和健康宝被迫绑定~~)

手感的话，pixel 5 其实对于手小的我来说更好，手感体验也更好，同时支持指纹解锁。

## 开装系统

装系统推荐使用GrapheneOS的web installer，真的特别简单，简单点几下就可以

注意安装前一定要确保：

- OEM可开
- BL（bootloader）可解
- 最好是c2c线，如果没有，一定要保证一根质量不错的a2c线

指南见：[Web installer | Install | GrapheneOS](https://grapheneos.org/install/web)

### 安装完成后

首先推荐一个网站叫做 Alternativeto ，用于提供可以替换的同类型网站/APP

还有其他一些推荐的，例如：

- Aurora store ：
  
  - 会提供一个匿名帐号。可下google play内的任意app，下载前可设置”伪装“，伪装成任一机型和语言
    
- andOTP：
  
  - 手机两步验证
    
- NewPipe：
  
  - 开源youtube客户端，感觉比youtube好用很多。目前用好像不支持帐号登录，但是支持”订阅“
    
- F-Droid
  
  - 开源app应用商店，这个搞机的貌似都知道
    

## Reference:

- [Android - Privacy Guides](https://www.privacyguides.org/android/)
  
- [Web installer | Install | GrapheneOS](https://grapheneos.org/install/web)
  
- https://www.youtube.com/watch?v=hrDUOtWXGv8