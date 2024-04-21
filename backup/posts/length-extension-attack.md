---
title: 'Length Extension Attack'
date: 2023-05-23 05:16:32
tags: [刷题,学习笔记,加密攻击]
published: true
hideInList: false
feature: 
isTop: false
---

关键词:MD5, SHA-1,Length Extension Attack

## Outline

网站通常会hash对应的secret以防止被篡改。而Length extension attack是指攻击者使用已知hash值的长度和hash算法类型，构造出新的有效hash值，而**无需知道**原始数据的内容。攻击成功后，攻击者可以向hash后的数据追加新的数据并重新计算hash值，而该hash值仍将保持有效。这种攻击通常会影响使用MD5和SHA-1等算法的网站。

备注:

- 可以通过data长度判断加密方式,例如128可能是MD5(it's the most common 128-bit hashing algorithm)

## 基础

首先要对散列函数的基础概念有所了解.散列函数具有以下特性:

1. 散列函数的运算过程是不可逆的，这个称为散列函数的单向性。
2. 对于一个已知的消息及其散列值，要找到另外一个消息使其获得相同的散列值是不可能的，这个特性称为散列函数的弱碰撞性。这个特性可以用来防止消息伪造。
3. 任意两个不同消息的散列值一定不同。
4. 对原始消息长度没有限制。

还有加密过程也是前置知识.

## 构造过程

加密函数如下：

```php
HASH([SECRET][DATA])
```

攻击者则需要通过以下方式去计算

```php
HASH([SECRET][DATA][PADDING][SUFFIX])
```

其中secret为用于保护signature的secret，data为signed后的字符串

攻击者需要知道对应的[SECRET]的size，以及[DATA]从而计算[PADDING]

类似于CBC(我是说将第一次生成的结果作为下一次输入的一部分) 这里的长度攻击是从中间状态继续进行hash计算.

具体的方式如下(总结自[github](https://github.com/iagox86/hash_extender)),先假设前提:

![Untitled](https://i.imgur.com/RPMarJU.png)

首先,服务器有一个初始的输入`secretdata`,并计算了其MD5 hash值:

```
6ee582a1669ce442f3719c47430dadee
```

然后,攻击者想在`secretdata`后面追加`append`,并伪造`secretdataappend`的hash值,以骗过服务器。但是攻击者不知道`secret`的值。那么如何计算`secretdataappend`的hash值呢?攻击者的方法是:

1. 已知`secretdata`的hash值`6ee582a1669ce442f3719c47430dadee`。这是MD5函数计算完成后的状态。
  
2. 攻击者创建一个新的MD5上下文,并设置其初始状态为上一步得到的状态。这样,这个上下文就像是在`secretdata`后继续运行的。
  
3. 攻击者在这个上下文中再hash `append` 得到的hash值就是`secretdataappend`的hash值。

4. 攻击者可以将`dataappend`和伪造的hash值发送给服务器。服务器会在前面加上`secret`,计算hash值,得到的结果和攻击者一致,于是就被欺骗了。所以这个攻击的关键就是利用了MD5的长度扩展性质:知道一个hash值,可以继续从那个状态开始hash更长的输入。这就是所谓的长度扩展攻击。

### 举例

引用wiki的例子, 例如:

```php
Original Data: count=10&lat=37.351&user_id=1&long=-119.827&waffle=eggo
Original Signature: 6d5f807e23db210bc254a28be2d6759a0f5f5d99
```

这个请求负责将10个类型为eggo的waffle运送到user_id为1的用户所指定的位置,当且仅当signature对用户来说是有效的.

可以设计成以下:

```php
Desired New Data: count=10&lat=37.351&user_id=1&long=-119.827&waffle=eggo&waffle=liege
```

这里message在遇到重复会优先选择最后一个waffle的值

在长度攻击这里,可以将hash(上面的 `signature` ) 作为hashing function的状态输入, 并继续原来得请求.这里原始key(`count=10&lat=37.351&user_id=1&long=-119.827&waffle=eggo`)的长度是14, 可以伪造请求长度看服务器接受哪个长度.构造新的数据:

```php
New Data: count=10&lat=37.351&user_id=1&long=-119.827&waffle=eggo\x80\x00\x00
          \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00
          \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00
          \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00
          \x00\x00\x00\x02\x28&waffle=liege
```

在这里DATA后跟着PADDING,然后SUFFIX为 `&waffle=liege`

其中 `0x80` 为128 为原始长度.这里大多数算法包括MD4,MD5,RIPEMD-160,SHA-0,SHA-1,SHA-256都是string+padding直到长度为56 bytes(mod 64)然后再加一个8 bytes 的encoded 长度字段的大小端/an 8-byte little-endian length

这里80 00 00 …. 作为PADDING部分.

这里我觉得wiki的解释里的例子不太好,见github这个利用脚本的README里的讲解吧(https://github.com/iagox86/hash_extender)

## 工具

[https://github.com/iagox86/hash_extender](https://github.com/iagox86/hash_extender)

`git clone` 到本地后用makefile自动化编译.如果make报错的话需要从Makefile里移除 `Werror`

## Reference

- [https://en.wikipedia.org/wiki/Length_extension_attack](https://en.wikipedia.org/wiki/Length_extension_attack)
- Pentesterlab：Green
- https://github.com/iagox86/hash_extender
- [https://m.freebuf.com/articles/database/137129.html](https://m.freebuf.com/articles/database/137129.html)