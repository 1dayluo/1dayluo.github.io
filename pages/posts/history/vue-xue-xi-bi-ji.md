---
title: 'Vue学习笔记'
date: 2020-12-03 11:28:18
tags: [vue,前端,全栈]
published: true
hideInList: false
feature: 
isTop: false
---
通过一天时间了解了一下vue，把一些对于新人来说比较混淆/不清楚的概念总结了一下

# Vue基本组件学习记录

## 简单组件sample

![Image](https://i.loli.net/2020/12/03/LbFE5mSApPRhJXe.png)

## 局部注册

![Image](https://i.loli.net/2020/12/03/vbGenP2js36Mo7V.png)

# 基础指令

## v-bind

v-bind解释

![Image](https://i.loli.net/2020/12/03/EYJrAj9caf1i6N3.png)

<!-- more -->

v-bind动态赋值给prop

````html
    <div id='app'>
    <a v-bind:href="url">link</a>
    
    </div>


    <script>
    var vm = new Vue({
        el:'#app',
        data:{
            url:'http://www.baidu.com/'
        }
    })


    
    </script>
        
````

![Image](https://i.loli.net/2020/12/03/sovRSWKbf4GMk8O.png)

## v-on

监听事件指令：v-on

![Image](https://i.loli.net/2020/12/03/uSlih8Vp2r35ad1.png)

## v-if

````html
 <div id='app'>
    <h1 v-if="awesome">Vue is awesome!</h1>
    <h1 v-else>Oh no 😢</h1>
    
    </div>


    <script>
    var vm = new Vue({
        el:'#app',
        data:{
            awesome:false
        }
    })


    
    </script>
````

# 单文件组件

## 项目基础

![Image](https://i.loli.net/2020/12/03/gapQD1Sdt94BZYG.png)

然后在你需要创建项目的文件夹路径下输入：vue ui

**然后 创建项目**

## 目录结构

>  public 打包后部署到生产环境
>
> src 开发目录
>
> src -components 组件目录
>
> App.vue 入口文件
>
> helloword.vue 单文件按钮

## 如何运行

如图

![Image](https://i.loli.net/2020/12/03/ajP96DnRUSKvQMf.png)



![Image](https://i.loli.net/2020/12/03/Tp3c9nvXFw1lQHe.png)

访问终端显示的地址

<!-- more -->



## 单文件组件的结构

script 声明数据，属性，方法

![img](https://i.loli.net/2020/12/03/m2a4HpqOtfyZEb3.png)



然后在App.vue import这个单文件组件，然后在components中局部注册这个组件