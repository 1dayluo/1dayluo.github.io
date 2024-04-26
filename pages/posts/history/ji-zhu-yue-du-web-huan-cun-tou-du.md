---
title: '[技术阅读]web缓存投毒'
date: 2021-07-28 13:39:59
tags: [技术阅读,知识点巩固]
published: true
hideInList: false
feature: 
isTop: false
---

<!-- more -->
# Introduction to web cache poisoning

原文链接：

[Introduction to web cache poisoning](https://www.netsparker.com/blog/web-security/web-cache-poisoning-introduction/)

写在开头：具体实践还是要做题。题目没有刷到这个专题，先做阅读了解。
英语能力太差了，整体时间有点安排不过来。所以视频的翻译和笔记记录停留在了[32:30]（视频为文章内提到的视频，非常不错，讲的很清晰）。等自己有时间继续补充这篇文章。


## web caching

和客户端缓存类似，客户端缓存：暂时地保存图片到本地，下次访问便会很快。

内容交付链下，

web服务器，中间系统，内容交付网络（CNDs）都被用于web缓存，以应对多个客户端请求（无需每次建索原始内容）。有利于负载均衡。

如图，左边为client，中间为caching server，最右为web application。

![Introduction%20to%20web%20cache%20poisoning%20ee64dd99798e4715bc71cd0bf544f5c4/Untitled.png](https://i.loli.net/2021/07/28/wjbuyLzdKNFncJS.png)

<!-- more -->

caching server会解压request中的cache key，然后查看是否在存储的key中是否有匹配该cache key的数据（视频在讲接该图的时候还解释了如果是实际架构该如何，例如，redis+mongo，或在niginx下如何配置caching server）

![Introduction%20to%20web%20cache%20poisoning%20ee64dd99798e4715bc71cd0bf544f5c4/Untitled%201.png](https://i.loli.net/2021/07/28/9pNK82QAT65mvsl.png)

如果一个请求，你第一次发送，测算response响应时间为2s，第二次为0.25s，那么服务器很有可能缓存了你的请求

## cache keys work

确认一个东西是否被缓存，缓存服务器会保存一张全部缓存内容的index表。然后用**cache key**来查找请求。

直观上去理解cache key：

- 本质上，是用于缓存服务器的request的签名
- 决定两个单独的请求是否加载同样的资源
- 每个缓存机制计算cache key都不同，但大多时候它就像获取request的基础部分，并把全部内容拼接成字符串一样简单。

    ![Introduction%20to%20web%20cache%20poisoning%20ee64dd99798e4715bc71cd0bf544f5c4/Untitled%202.png](https://i.loli.net/2021/07/28/h169is3AjoIFNOt.png)

- 例如，以上请求，加入cache key的有GET和HOST两行，那么如果有独立请求在request中有同样的两行（即使其他不一样），就会被缓存服务器所处理对应的响应。
- 没有被加入cache key的被称为：unkeyed input。（同样的例子，例如，User-Agent，Accept，Cookie）
- [21:20]视频中提问的回答：有时缓存服务器也会将有关内容发送到user的浏览器中，例如header中的`xslash` (关联着对应的版本）

cache key的组成：

- request中的不同字符 且能反映header中的value

注意：

Each caching mechanism will have its own way of building the cache key.

request请求中包含cache key的部分叫keyed inputs。剩余部分叫unkeyed inputs。

所有的cache key都必须至少包含path和host

但是取决于缓存机制和应用程序，其他的header 的值也可能被用。

**理解cache busting**

- 一般缓存服务器中，requery的参数，Origin都被加入cache key的表中。一般测试写POC的时候，通常会构造origin（仅作为漏洞存在证明，防止其他普通用户受害）
- 会选择位于cache key的参数并修改，但修改该参数时不会影响整体服务器。
- 是调查与缓存有关的漏洞和攻击的重要方法。
- 允许渗透测试者实验缓存投毒而不影响其他用户。

## web cache poisoning

web缓存投毒就是偷偷把web缓存中的数据修改成不合法的内容。通常，被修改的内容本身不是攻击，而是作为可利用漏洞（payload）的载体。通常此处的漏洞多为：

- cross-site scripting(XSS)
- [host header injection](https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/http-header-injection/)

web缓存投毒很难实现，也很难被发现和排错。

这里有一些方法能够实现修改缓存，取决于缓存机制，应用程序和浏览器。

**理解缓存投毒**

如图，左图和右图都是两个单独的request。在这个例子中Cookie是unkeyed input。没有被加入cache key。

第二个请求更改了cookie处的language，但是返回的仍然是`en`。这是为什么呢?

因为第二个请求的`GET`和`HOST`都和第一个请求一样，而同时`GET`和`HOST`同时作为keyed input存储在cache key中的。所以对于缓存服务器来说，二者是相同的请求。第二次请求时，会读取第一次请求的缓存。

![Introduction%20to%20web%20cache%20poisoning%20ee64dd99798e4715bc71cd0bf544f5c4/Untitled%203.png](https://i.loli.net/2021/07/28/nagY7d9xrMK61Lp.png)

## ways of modifying caches

### Reflected unkeyed headers

如果该应用程序的response的响应直接响应unkeyed header，这种情况很容易被缓存投毒。因为如果有header是unkeyed的话，它的值就不能成为cache key的一部分（看笔记中的cache keys work)。这个header就不参与缓存命中。

如果攻击者发送了一个请求，且只有这个header被恶意修改，那么会有新的针对此request的response被缓存，便完成恶意负载。（恶意负载例如：针对跨站脚本的漏洞）。用户随后的请求内存将匹配到同样的cache key，并且会从缓存中收到该恶意版本。

### Unkeyed port

如果端口不参与组成cache key，就有可能被缓存投毒利用不可访问的端口来实现拒绝服务（DoS）攻击。如果攻击者发送了一个包含上述的端口数字的request请求，并且错误的response被缓存。用户访问/request请求同样的URL即使没有端口的情况下，也会立即得到被缓存的错误而不是期待的页面内容。

这将会使页面无法被用户访问到，实际上只针对特定的URL执行微妙的DoS攻击

### Unkeyed request method

一些时候，HTTP的请求方式（GET,POST,PUT等等）可能不参与组成cache key的部分。应用程序容易受到参数污染（parameter pollution)的攻击。这很有可能发送一个POST请求，包含修改过参数的恶意的payload——通常去实现XSS攻击。

### Fat GET requests

如果应用程序接受，非标准的带有body的GET请求（所谓的fat GET requests）和request中的body部分 都是unkeyede且被response响应。这可以为缓存投毒的另一个途径。

攻击者可能在GET请求中包含恶意负载。对应的response被缓存（因为request body不是key的部分），用户发送常规get请求会命中同样的cache key，并接受到被投毒的response。

一些案例中，会在头部用到`X-HTTP-Method-Override`

去欺骗应用程序：将一个fat GET请求视作普通的POST请求。

### Unkeyed query string

最后，如果一带查询字符的request是unkeyed并且会反应在response中。就可能注入恶意负载（payload）在查询参数上，且response被缓存。客户端发送的request与之匹配（且没有带参数）就会接受到被投毒的response。

由于该攻击是典型的脚本注入，可以说这种方法是将反射型 XSS 转换为存储型 XSS，并将脚本存储在 Web 缓存中。虽然如果直接使用这种技术很容易被发现，但它可能会在更复杂的场景中逃避检测。

## Preventing

- 规范化HOST标头：比如防止DoS，用默认端口，被生成cache key前在Host header中去掉端口号。
- 只缓存GET和HEAD的请求：repost和其他HTTP请求需要服务器直接相应。response全部都用缓存技术是没有太大的好处的
- 不要允许fat GET的请求。
- (Optional) Disable caching headers