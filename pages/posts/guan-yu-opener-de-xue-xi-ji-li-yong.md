---
title: '关于opener的学习及利用'
date: 2021-08-27 08:01:04
tags: [技术阅读,XSS]
published: true
hideInList: false
feature: 
isTop: false
---
# window.opener 学习

[15:40]

关于window.opener的补充学习：

[](https://medium.com/tsscyber/penetration-testing-window-opener-xss-vectors-part-2-7810ebfccc1d](https://medium.com/tsscyber/penetration-testing-window-opener-xss-vectors-part-2-7810ebfccc1d))

还是从part1开始读起吧（

学习的过程偶尔会发愁，遇到很多英文，我还是一个头两个大。但是还是啃吧）：

part1：[https://medium.com/tsscyber/penetration-testing-window-opener-xss-vectors-part-1-c6be37701cab](https://medium.com/tsscyber/penetration-testing-window-opener-xss-vectors-part-1-c6be37701cab)

和视频补充学习：[https://www.youtube.com/watch?v=veXDFx2qJBk](https://www.youtube.com/watch?v=veXDFx2qJBk)

**part1介绍的内容：**

- opener 变量 以及如何与同源政策相关联。
- 该变量如何呗滥用以实现接近客户端重定向

**part2介绍的内容：**

- 在part1概念的基础上探讨新型XSS向量

**part3介绍的内容：**

- 来混淆一些有趣的跨窗口`eval` 函数 从而在第四部分讨论通用XSS的问题

# Part 1

## Introducing the window.opener variable

open 函数通常被用于在弹出的窗口中打开一个URL。这个函数经常被不良的网站打开烦人或恶意的广告，但是同样也有合法的使用。当你调用open函数，浏览器自动在新窗口中赋值一个变量指向打开该窗口的源窗口。这个变量自然地称作”opener‘

<!-- more -->

其中之一的opener变量的合法使用是让单点登录函数无需离开当前页面。这个过程像这样：

（Notion不支持gif，见原始网页）

![Untitled](https://i.loli.net/2021/08/27/MhPyvB1ex254aJw.png)

上面的动画有一组有趣的事情值得注意：

1. `oepner`变量在被右边弹出窗口的第一个域名时就被赋值了（opener指向原始window），并一直**持续**到新页面的加载（‘https://singlesignonprov…’ -> ‘http://xss.vg?token=abc…’) 这不同于大多数javascript的变量：通常他们不会持续到当前窗口加载新页面。
2. 单点登陆重定向到original domain是在利`opener` 变量与original window交互之前的。The single sign-on provider redirects back to the original domain before utilising the opener variable to communicate with the original window

为什么单点登陆不提供简单的`opener`变量去发送登陆token重定向到original window，像`opener.token` ?因为这个违背同源政策。

## The same origin policy and pop-up windows

要利用opener变量在另一个window中进行更改，任何windows都要满足以下三个检查：

1. Same domain (e.g. tsscyber.com.au)
2. Same URL scheme (e.g. HTTP, HTTPS, FTP etc)
3. Same port (usually 80 for HTTP and 443 for HTTPS)

如果你跳过了三个检查你就跳过了同源政策，浏览器将允许javascript去在windows之间执行（同样的检查被用于javascript与iframes或其他嵌入内容进行交互）

例如，假设你是一个坏家伙，你构建了一个恶意网站（[http://xss.vg:80](http://xss.vg/) in this example)，当有人浏览你的网站时，Javascript将打开弹出的窗口，然后将受害者的gmail账户加载进opener。你的恶意javascript尝试用`opener.document.body.innerHTML` 读取受害者的邮件或类似的事情。

不幸的是，用`opener`变量读去gmail所在窗口的数据违背了全部的三个同源政策。而且浏览器安全控制将阻止未授权的访问。

## **Same origin check example**

*http://xss.vg:80* **VS** *https://mail.google.com:443*

1. Domain: xss.vg != mail.google.com
2. URL Scheme: HTTP != HTTPS
3. Port: 80 != 443

## ’Safe‘cross-domain operations

你能够读取修改跨域窗口这很明显是一个安全问题，这有一组函数和方法是由浏览器提供的尽管同源检查是失败的。以下是我所知道的安全跨域 操作/函数：

1. [blur](https://developer.mozilla.org/en-US/docs/Web/API/Window/blur) — shifts focus away from the window
2. [close](https://developer.mozilla.org/en-US/docs/Web/API/Window/close) — closes the window (but only if it was opened by JavaScript)
3. [closed](https://developer.mozilla.org/en-US/docs/Web/API/Window/closed) — indicates if the windows was closed
4. [focus](https://developer.mozilla.org/en-US/docs/Web/API/Window/focus) — focuses the window (but doesn’t always focus the window…)
5. [frames](https://developer.mozilla.org/en-US/docs/Web/API/Window/frames) — same as *opener*
6. [length](https://developer.mozilla.org/en-US/docs/Web/API/Window/length) — the number of iframes in the *opener*
7. [location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location) — write-only access to the *opener’s* URL
8. opener — the *opener’s opener* (or null if it doesn’t have one)
9. [parent](https://developer.mozilla.org/en-US/docs/Web/API/Window/parent) — gets the *opener’s* parent window (which might be itself)
10. [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) — the safe way to do cross origin communication
11. [self](https://developer.mozilla.org/en-US/docs/Web/API/Window/self) — I’m not entirely sure on the usage of this one. Is apparently useful for web workers
12. [top](https://developer.mozilla.org/en-US/docs/Web/API/Window/top) — the *opener’s* top window (which might be itself)

Of these 12 safe cross-domain operations/variables, number 7: ‘location’ and the ability to access the opener’s iframes is of particular interest.

## Messing with cross-origin locations

首先潜在的问题需要想到的是通过将opener的location值改为javascript或者Data URI来获得写权限。我们上面的例子中，以下命令达到了同样的效果：

```jsx
opener.secretValue
opener.location = 'javascript:window.secretValue' //note the use of window.secretValue here as opposed to opener.secretValue as the goal is for the JavaScript to run in the context of the opener's window
```

注意，这里location是`window.scretValue`而不是`opner.scretValue`  是因为当前javascript运行的上下文在opener的窗口（原）

幸运的是浏览器已经想到这个变量而且这个命令会造成安全性报错。等同于的功能用URI实现像这样：

```jsx
opener.location = 'data:text/html,<script>window.secretValue</script>'
```

但是，这里有两个问题。

第一，URI结构造成了opener指向的window去重载导致所有用户定义的变量重置为了`undefined`  （例如，window.secretValue丢失了）。将当前窗口的上下文的域名变为弹出窗口的上下文（this is opposed to a JavaScript URI which doesn’t always cause the window to reload/change context）

第二，大多浏览器禁用顶层窗口被导航到URI数据。如果你尝试这个导航在Chrome不会发生任何事情（一个报错信息会在console中打印），在firefox中造成了窗口关闭（也许是bug）

你仍然被允许用data URIs在被嵌入的目标中（例如一个iframe）。由于我们可以访问`opener.length`  ，我们可以知道我们打开的窗口是否包含任何iframes。你可以用index来获得iframe，例如 `var openersFirstIframe = opener[0]`  将会获得opner所在窗口的第一个iframe。然而，尝试跨域设置iframe的location会因为浏览器的安全规则拒绝。除非你在opner本身所在或者是它的parent。

即使浏览器已阻止了XSS利用location的能力，你仍然可以导航opener去任何你想去的域名（例如`opner.location='http://xss.vg'` ) 这是一种客户端的重定向，恶意网站能够劫持另一个window/tab的导航来强迫用户浏览制定网站（有趣的是，在写这个的时候，chrome禁止了在用户导航到另一个页面后，改变opener的location。这一步在我看来是朝着正确的方向）

我见过有程序用半合法化的方式去绕过弹出限制，看起来弹出窗口阻止程序对于弹出窗口的合法（或是否垃圾邮件）性有一些启发式看法。所以一些网站加载自己到弹出窗口中，而将原始窗口导航到广告网站。这个欺骗了弹出窗口组织程序，因为弹出的窗口不包含垃圾信息，但原始网站有。

## The story so far

到目前为止我们已经讨论了弹出窗口和opener变量。我们看到了浏览器实现了安全控制：基于同源控制阻止javascript执行发生在windows之间。除了a poor person’s client side open redirect issue，opener变量看起来能够安全使用且避免邪恶用途。part2将扩展我们的知识：如何我们用新的变量实现XSS。

# part2

tldr;`opener.location.*` 和 `onhashchange` 事件都是XSS向量。都存在于旧版本的reveal.js中。

这是四部分中的第二部分：探索与弹出窗口相关连的安全概念和javascript opner变量。这部分假设你已阅读过第一部分。在第一部分我们总结了唯一的安全问题与opener相关连的是poor-mans 客户端开放重定向。

## opener.location DOM XSS

我们的目标是滥用我们对于location变量的控制去欺骗客户端javascript以执行我们控制js命令。一个很明显的且有名的方式是location值能够在 application以不安全的方式注入它的值时被 滥用。例如，以下的javascript片段创建了一个a标签：源自window的当前location

```jsx
document.body.innerHTML = "<a href='" + window.location + "/nextPage'>unsafe!</a>"
```

特制的URL能够实现XSS，例如

```jsx
http://xss.vg/'onClick='alert(1)
```

将会被DOM树呈现：

```jsx
<a href="http://xss.vg/" onClick="alert(1)" nextpage="">unsafe!</a>
```

要注意到href标签如何变成`http://xss.vg` 以`onClick`

javascript handler被作为额外的标签属性被注入进去的。(If this makes no sense to you I suggest you go and read up about XSS Basics and DOM based XSS).

如果我们改变了这段javascript片段为opener呢？它仍然存在漏洞么？

```jsx
document.body.innerHTML = "<a href='" + opener.location + "/nextPage'>unsafe!</a>"
```

当我们用我们的恶意URL尝试上面的片段，我们获取了关于opener变量不存在的报错。

![Untitled](https://i.loli.net/2021/08/27/nCvJDWT69LzOYxS.png)

解决这个问题我们需要确保javascript尝试使用它之前去定义opener变量。最明显的方法是用open函数填充变量以加载恶意URL。但，

- 不具备执行javascript能力的有易受攻击页面上如何运行open方法
- 如何欺骗受害者访问我们的控制的页面，以及如何从我们自己的网站调用open方法

但是这些也行不通，因为易受攻击的网站尝试去从我们的网站读location的值时，这个行为会因为违背同源政策而被浏览器阻止。（bad site是opener，然后对方网站读取opener.location)

这里有两个方法能够解决我们的同源政策问题。

用`_self`  关键字能够让我们打开恶意链接时，让opener指向我们自己的窗口。

`_self` 标签将导致URL被当前窗口加载并会填充opner变量。当易受攻击的javascript遇到`opener.location` 变量时就相当于是`window.location` 。于是我们的XSS攻击像这样：

```jsx
open("http://xss.vg/'onClick='alert(1)", "_self")
```

这个策略在chrome和firefox中有用，edge无用，在edge下，即使用`_self` 加载了新页面但是也不会填充opener变量。在edge下生效，需要一些小技巧（混淆）

我们的目标不是完全的绕过同源政策，this would be a zero day in the browser’s security model。相反，我们需要对窗口进行一些设置使得他们满足同源政策。我们需要：

- bad site open bad site（满足同源政策）、
- 修改opener所在的location为payload
- 修改opener定义处所在窗口的location目标域名（到此步满足同源政策）

## onhashchange event XSS

有一个经常被客户端的javascript使用的URL元素是`location.hash` ，如果我们尝试给跨域窗口设置hash，浏览器安全控制将介入并阻止我们。

![Untitled](https://i.loli.net/2021/08/27/z9dtGSx5Vq4MemQ.png)

如果我们间接地将hash值包含在完整的URL中我们可以设置hash，像这样：

```jsx
opener.location = "http://xss.vg/#HashValueHere";
```

关于hash片段，一个有趣的是，当它是URL的一部分时，改变它并不能触发页面重载。

以下三个url后两个都会导致页面重载。第一个会触发onhashchange事件。

```jsx
location = location + "#first" //doesn't trigger a page reload, will focus the element with the id 'first' if it exists and trigger an onhashchange event
location = location + "/oops" //causes the page to reload as the pathname has changed
location = location + "?oops" //causes the page to reload as the search (query string) has changed
```

如果我们在opener的location做同样的事情会怎么样呢？

如下，最后一个会触发onhanshchange。只有第一个会被阻止报错。

```jsx
opener.location = opener.location + "#first" //error, we aren't allowed to read the value of opener.location
opener.location = "http://vulnsite/" //this is ok
opener.location = "http://vulnsite/#hash change" //triggers onhashchange event on the opener's window!
```

一些网站会监控hash值，以在application中作出对应的逻辑判断。例如，在gmail中，gmail会在实现查询邮件的时候用hash值

![Untitled](https://i.loli.net/2021/08/27/ne1Fl3Asvqt8OpM.png)

能够在gmail进行跨域搜索并不会让攻击者能够做任何邪恶的事情。但，这个并不是XSS。虽然一个域的javascript会导致另一个域的做一些事情，但我们无法在gmail域中执行一些额外的javascript命令。下面是一个简单的script片段，将会导致你的gmail实现跨域改变hash

```jsx
index = 0; 
setInterval(function() {  
    var hash = 'you+have+been+hacked++++++';  
    var url = "https://mail.google.com/mail/u/0/#search/" + hash.substr(0, index++ % hash.length);  
    open(url,'gmailPopup') 
},1000)
```

 `open(url,'gmailPopup')` 函数的第二个参数gmailPopup是用来给弹出窗口命名的。通过此参数，浏览器会首先检查是否有叫gmailPopup的窗口存在，如果存在，会设置location的值为第一个参数下的url而不是创建一个新的弹出窗口。这个很重要，如果每次都创建新的弹出窗口，每个窗口都会有不同的hash值。而只有一个窗口意味着你只需改变一个现存窗口的hash值。

为什么我们要改变hash值而不是加载有特定hash值的窗口？因为这样我们能够用我们控制的hash值在window中触发`onhashchange` 事件。思考以下javascript片段：用hash值的改变去聚焦页面的不同元素：

```jsx
location.hash = "";
$(window).on('hashchange', function() {
  $(location.hash.split('#')[1]).focus();
});
```

对于以上的代码，只改变location（[`http://vulnerable/#](http://vulnerable/#)<img src=x onerrer=alert() />` ）是不够的，还需要触发hash值的改变。你可以像这样：

```jsx
var payload = "#<img src=x onerror=alert()/>";
open(vulnerablePage, "popup")
//give the vulnerable page a few seconds to fully load before changing the hash value
setTimeout(function() { open(vulnerablePage + payload, "popup");
    }, 2000);
```

这变得更加有趣，因为甚至很多开发者都会忽略掉这个安全问题。

## Example of unsafe opener usage — Reveal.js

在这个阶段你可能在想：这样的代码真的存在么？我也是这样想的，然后通过谷歌搜索发现旧版的`reveal.js` 有着基于DOM的XSS问题：通过使用`opener.location` 变量在presenter notes functionality (versions prior to v2.6.0).以下是这个易受攻击的代码行：

[https://github.com/hakimel/reveal.js/blob/4164200474e2af27803dc7683054f5443743c8a9/plugin/notes/notes.html#L142](https://github.com/hakimel/reveal.js/blob/4164200474e2af27803dc7683054f5443743c8a9/plugin/notes/notes.html#L142)

```jsx
document.write( '<iframe width="1280" height="1024" id="current-slide" src="'+ window.opener.location.href +'"></iframe>' );
```

对于这段代码，XSS攻击有一些难度：我们需要逃逸src属性下的双引号（“）。

在URL编码中，双引号是 %22,同样的，<和>也是要编码。URL像这样

```jsx
http://xss.vg/"></iframe><script>alert()</script>
```

在HTML中会变成这样：

```jsx
<iframe width="1280" height="1024" id="current-slide" src="http://xss.vg/%22%3e%3c/iframe%3e%3cscript%3ealert()%%3c/script3e"></iframe>
```

这是XSS安全的。然而，同一时间，我发现了这个问题`**hash` 在chrome和edge中是不会被URL编码的。**

所以以下的url

```jsx
http://xss.vg/#"></iframe><script>alert()</script>
```

将会变成

```jsx
<iframe width="1280" height="1024" id="current-slide" src="http://xss.vg/#"></iframe><script>alert()</script>"</iframe>
```

alert()的XSS会被出发。在写作的同一时间，chrome改变了hash不进行编码的问题。但是edge和explorer仍然存在这个问题。

## The story so far

目前为止，我们讨论了弹出窗口和opener变量。我们看到浏览器一些安全控制像同源政策去阻止javascript在两个窗口之间执行。但是

`opener.location` 变量能够被用于XSS向量，而且出发onhashChange事件。第三部分：Join me in part three (coming soon) as we play around with cross-window eval.

然后发现并没有part3，作者鸽了。。。pAq