---
title: '[wafbypass]使用python发送chunked'
date: 2020-11-08 15:04:15
tags: []
published: false
hideInList: false
feature: 
isTop: false
---
遇到云盾，网上查询bypass方法一有利用http协议中，使用chunked编码分块发送HTTP消息。既然以后会用到就干脆写一个发送工具好啦（仅供参考）
我也不知道自己写的对不对_(:3_|/_)独自摸索x
> 参考：
>-  https://stackoverflow.com/questions/24500752/how-can-i-read-exactly-one-response-chunk-with-pythons-http-client
> - https://cloud.tencent.com/developer/article/1606911


chunked编码格式如下

**格式：**

- 如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。

- 每一个非空的块都以该块包含数据的字节数（字节数以十六进制表示）开始，跟随一个CRLF （回车及换行），然后是数据本身，最后块CRLF结束。在一些实现中，块大小和CRLF之间填充有白空格（0x20）。

- 最后一块是单行，由块大小（0），一些可选的填充白空格，以及CRLF。最后一块不再包含任何数据，但是可以发送可选的尾部，包括消息头字段。消息最后以CRLF结尾。

<!-- more -->

