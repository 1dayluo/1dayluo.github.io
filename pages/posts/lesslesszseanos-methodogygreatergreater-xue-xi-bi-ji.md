---
title: '《zseano''s methodogy》学习笔记'
date: 2022-02-01 22:25:01
tags: [笔记,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---
# 《zseano's methodogy》学习笔记

一些图片没有上传,本地和notion好好的,上传上来格式有些emmm(看阅读时间要35min也能够知道完整的文章目前博客显示不完整),完整笔记可以联系我tg. 之前看书写的了,现在分享出来,希望能帮助到其他人.zseano的这本书可以在他的网站上找到,对于小白的我非常的有帮助!


- never go in with the mindset of trying every type of vulnerability possible
- all about spending months on the same program with the intention of diving as deep as possible 
- to begin with I am focused purely
  on finding areas（第一次尝试，需要确认一个你主要尝试的目标/方向）



# Common issues I start with & why

## Cross Siet Scripting(XSS)

XSS是最好预防的漏洞，存在WAF拦截，往往意味着application易受XSS攻击。关于绕WAF的payload：https://github.com/0xInfection/Awesome-WAF#how-wafs-work



### Step One:Testing different encoding and checking for any weird behaviour



尝试：

- 输入`<h2>`,`<img>`等

- 去看那些是被允许的，哪些是不被允许的。理解，目标是如何处理encoding的。例如：如果被过滤为`&lt` or `%3C`,那么尝试double encoding,例如：`%253C`以及`%26lt;`去看看如何处理这类的encoding.

  - 如果不管你尝试什么，你总是看到`&lt;script&gt; `或`%3Cscript%3E` ,那么，该相关参数可能不易受到XSS攻击

  补充：一些有趣的encoding：https://d3adend.org/xss/ghettoBypass



### Step Two: Reverse engineering the developers' thoughts

(this gets easier with time & experience)

这一步站在开发者的视角去推测他们会创造什么类型的过滤（以及问：为什么？）

- 切入点1-是否过滤完整的HTML tag：
  - 如果发现他们过滤`<script>`，`<iframe>`,`"onerror"=`,但是同时注意到他们不过滤`<script`。那么我们猜测：“是否只过滤完整的HTML tag”。我们可以尝试`<script src=//mysite.com?c=`
- 切入点2-是否维护着一个黑名单
  - 忽略了一些HTML tag：也许开发者忽略了类似于`<svg>`
  - 覆盖面：也许并不是全部参数都存在黑名单
  - 对于encoding如何处理？` <%00iframe`, `on%0derro` 



**Testing for XSS flow:" **

- 测试非而已HTML tag,例如`<h2>`

- 测试不完全的tag,例如`<iframe src=//zseano.com/c=`

- 测试encoding,例如`<%00h2?`（There are LOTS to try here,
  `%0d`,` %0a`,` %09` etc）

- 存在硬编码字符串的黑名单吗？测试` </script/x>` 有效吗？或者<ScRipt> 等

  

推荐的资源：

[Browser's-XSS-Filter-Bypass-Cheat-Sheet](https://github.com/masatokinugawa/filterbypass/wiki/Browser's-XSS-Filter-Bypass-Cheat-Sheet)





## Cross Site Request Forgery(CSRF)

CSRF一般是通过HTML form (`<form action=”/login”
method=”POST”>`),而且很容易被找到。经典的CSRF的例子是，改变一个用户的email为你 所控制的email地址，这将导致账户接管（account takeover)。

- 当你尝试发送空白的CSRF值时，是否有任何framework的信息通过error泄漏。

- 它是否反映了你的更改，但出现的了CSRF错误。

- 你是否在其他网站上看到了这个参数的名字

  

 Test their most secure features (account functions usually as mentioned above) and work your way backwards. you may
discover that some features have different CSRF protection. Now consider, why?



- 一个常见的开发者检查referer header的值是否是他们的网站。会适得其反因为检查只存在与referer标头被查找到，而标头不存在，不会检查。

  - 你可以构造一个空的referrer，如下：

  ​	`<meta name="referrer" content="no-referrer" /><iframe src="data:text/html;base64,form_code_here">`

  - 他们检查他们的域名是否存在于referer标头，你可以构造这样的referer：`https://www.yoursite.com/https://www.theirsite.com/` 

but typically all sensitive features should
be protected from CSRF, so find them and test there



## Open url redirects

> My favorite bug to find because I usually have a 100% success rate of using a
> “harmless” redirect in a chain if the target has some type of Oauth flow which
> handles a token along with a redirect



Open Url redirect举例，类似于：https://www.google.com/redirect?goto=https://www.bing.com/ 当浏览时，将会重定向URL到给定的参数（这里是www.bing.com）。许多开发者未对这类链接进行过滤或限制。但即使如此，过滤器有时可能会阻止你的前进。

以下是一些用于检测过滤器（filter）是否被使用的payload：

````
\/yoururl.com
\/\/yoururl.com
\\yoururl.com
//yoururl.com
//theirsite@yoursite.com
/\/yoursite.com
https://yoursite.com%3F.theirsite.com/
https://yoursite.com%2523.theirsite.com/
https://yoursite?c=.theirsite.com/ (use # \ also)
//%2F/yoursite.com
////yoursite.com
https://theirsite.computer/
https://theirsite.com.mysite.com
/%0D/yoursite.com (Also try %09, %00, %0a, %07)
/%2F/yoururl.com
/%5Cyoururl.com
//google%E3%80%82com
````

Some common words I dork for on google to find vulnerable endpoints: (don't forget
to test for upper & lower case!)

````
return, return_url, rUrl, cancelUrl, url, redirect, follow, goto, returnTo, returnUrl, r_url,
history, goback, redirectTo, redirectUrl, redirUrl
````



-----------------------------

学习Oauth login flow works相关的知识：

https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2

 在Ouath login的场景中，如果有一个登陆页面发出像这样的请求

https://www.target.com/login?client_id=123&redirect_url=/sosecure

通常redirect_url在`*.target.com`  的白名单中。Spot the mistake?
Armed with an open url redirect on their website you can leak the token because as the redirect occurs the token is smuggled with the request.

用户发送：

https://www.target.com/login?client_id=123&redirect_url=https://www.target.com/redirect?url=https://www.google.com/

登陆后被重定向到攻击者的网站并伴随授权的token.Account take over report incoming!

-----------------------------------

另一个常见的问题是人们没有正确编码，特别是目标只允许`/localRedirects`。你的payload可能看起来有些像`/redirect?goto=https://zseano.com/` ，但是当使用它时，`?goto=parameter`可能会在重定向中被丢弃。

在有多个参数的时候（通过&链接）重定向参数也有可能丢失。zseano总是要将特定值例如`& ? # / \ `进行编码，去让览器在第一个跳转后强行解码。

`Location: /redirect%3Fgoto=https://www.zseano.com/%253Fexample=hax`

第一次跳转，链接变为（浏览器自动将`%3F`化为`?`：

`https://www.example.com/redirect?goto=https://www.zseano.com/%3Fexample=hax`

当它再次跳转时，将会允许`?example`也一起被发送。你将会在下文读到更多关于此更有趣的。



有时你将需要根据跳转次数，来对`&`参数选择double encode次数

````
https://example.com/login?return=https://example.com/?redirect=1%26returnurl=https%3A%2F%2Fwww.google.com%2F


#第二条与第一条区别是需要两次解码。第一次解码后为：
#https://example.com/login？return=https://example.com/?redirect=1%26returnurl=https%3A%2F%2Fwww.google.com%2F
#第二次解码后则是和第一条完全一样。


https://example.com/login?return=https%3A%2F%2Fexample.com%2F%3Fredirect=
1%2526returnurl%3Dhttps%253A%252F%252Fwww.google.com%252F 

````

**当寻找open url redirects时也要牢记，他们可以被用来SSRF漏洞**

如果你发现重定向是通过`Location:`标头进行的，那么XSS是**不可能的**,然而如果它通过一些例如`window.location`来重定向，那么你应该测试`javascript:`而不是测试重定向到你的网站。因为这里有可能出现XSS。

一些常见的bypass filter

````
java%0d%0ascript%0d%0a:alert(0)
j%0d%0aava%0d%0aas%0d%0acrip%0d%0at%0d%0a:confirm`0`
java%07script:prompt`0`
java%09scrip%07t:prompt`0`
jjavascriptajavascriptvjavascriptajavascriptsjavascriptcjavascriptrjavascriptijavascript
pjavascriptt:confirm`0`
````



## Server Side Request Forgery(SSRF)

SSRF是in-scope domain发出的一个请求到你所定义的一个URL/endpoint。有时并不总是标志着目标易受攻击。当hunting for SSRF，zseano通常寻找已经使用URL参数的特性。重点关注处理URL的参数的名称

当你测试srrf时，你应该总是测试他们如何处理重定向的。你能够通过XAMPP & NGrok 来（zseano写过这个方法找到apple的漏洞，见另一个笔记）



- 设置一个简单的重定向脚本，并查看目标如何解析和跟随重定向：。增加sleep(1000)在重定向前，你能导致服务器处理超时或挂起？
- 也许fileter只检查参数值而不检查redirect value.从而你能成功访问到内网。
- 当目标过滤外在网站时，利用开放重定向作为你的chain中的一部分。



除了关注URL参数，也需要查找他们可能使用的第三方软件，例如jira.



## File uploads for stored XSS & remote code execution

There is a 99% chance the developer has created a filter as to what files to allow and what to block.通常至少会有一个（或更多的）过滤在这里。

一般先尝试上传例如：

`.txt`,`.svg`,`.xml` 类型的文件。

这三种文件类型又是会被遗忘，并且通过过滤器。

- 首先上传`.txt` 检查filter过滤有多严格（是否说只允许图片，例如:`.jpg .png .gif`等) 
  - 以及只是简单地上传三种类型的图片（`.png .gif .jpg`)，通过这个给你一条狗他们是如何处理上传的指示
    - 例如，是否所有的照片被保存为统一格式而忽视我们上传的格式？他们是否不信任我们的任何输入并始终保存为 `.jpg`？
- 测试上传文件名（类似于XSS）
  - 测试名字`zseano.php/jpg` 。代码可能会看到`.jpg` 通过。但实则写入服务器的为`zseano.php`并忽略`/`后所有的内容。
  - 测试例如`zseano.html%0d%0a.jpg`  在这里`%0d%0a`是代表着换行。所以将保存为`zseano.html`。
  - 不要忘记文件名通常反应在页面上。你也可以走私一些XSS字符在文件名内。（一些开发者认为用户不会保存文件用`<`或`》`）

````
------WebKitFormBoundarySrtFN30pCNmqmNz2
Content-Disposition: form-data; name="file"; filename="58832_300x300.jpg<svg
onload=confirm()>"
Content-Type: image/jpeg
ÿØÿà
````



开发者究竟会检查什么，以及如何处理它。他们会相信任意我们所输入的吗？例如，我提供了以下：

````
------WebKitFormBoundaryAxbOlwnrQnLjU1j9
Content-Disposition: form-data; name="imageupload"; filename="zseano.jpg"
Content-Type: text/html
````

代码看到`.jpg` 思考这是图片扩展。从而相信了我的`content-type`并且把它作为`Content-Type:text/html`来映射吗？或者它基于file extension来设置content-type。如果，你提供了不带文件扩展名的（或者没有文件名），它会设置默认`content-type` 或默认文件扩展名吗？

````
------WebKitFormBoundaryAxbOlwnrQnLjU1j9
Content-Disposition: form-data; name="imageupload"; filename="zseano."
Content-Type: text/html

````



````
------WebKitFormBoundaryAxbOlwnrQnLjU1j9
Content-Disposition: form-data; name="imageupload"; filename=".html"
Content-Type: image/png
<html>HTML code!</html>
````

这些都是为了给它提供畸形（malformed)的输入以及看它们所信任的有多少。也许他们并不检查文件扩展名，相反检查图片大小。一些时候，如果你leave the image header this is enough to bypass the checks

````
------WebKitFormBoundaryoMZOWnpiPkiDc0yV
Content-Disposition: form-data; name="oauth_application[logo_image_file]";
filename="testing1.html"
Content-Type: text/html
‰PNG
<script>alert(0)</script>
````

File upload 将很可能包括某种类型的过滤器去防止恶意上传，所以一定要花足够时间去测试它们。



## Insecure Direct Object Reference(IDOR)

一个IDOR bug的例子。例如：https://api.zseano.com/user/1当查询的时候所给你的信息仅有用户的userid为“1”。改变user id为“2”，则应该给你一个错误的，并拒绝——想你展示你访问了其他的用户的详情。然而，如果他们是易受攻击的，那么，它将给你展示其他用户的信息。简而言之，IDOR就是改变数字为其他用户，并能看到返回的结果。

但并不总是简单的整数（1）那么简单，有时，你将会看到GUID（2b7498e3-9634-4667-b9ce-a8e81428641e）或者其他类型被加密的值。暴力破解GUID不可取，通常会检查该值是否哪里有泄漏。



- Tips：即使你看到了一些encrypted value,也要试着尝试一下integer！
- Tips：笔者对mobile apps的IDOR很重视。通常会有IDOR漏洞产生。

可能存在IDOR的地方：

- 网站上传照片功能处，你也可以查看其他用户的照片
  - 深入思考，如果你注册不同角色，你能以guest身份实施admin身份的动作吗？
- 非付费用户可以使用付费用户的内容吗？
- 在post请求处见到postdata为JSON，格式为以下(也适用于非JSON格式）：
  - `{"example":"example"},` 则就可以尝试诸如一个新的参数名：`{"example":"example","id":"1"}`



## CORS(Cross-Origin Resource Sharing)

另一个常被推荐的领域是查找**filtering** 

当你看到response中的header出现:“Access-Control-Allow-Origin:”。那么同时,有时根据场景你也需要"Access-Allow-Credentials:true"。这些header允许外部网站去阅读网站的内容。

如果request中需要会话cookie，则需要Allow-credentials。开发者通常创造过滤器从而只允许他们的domain去阅读内容，但是，谨记，只要存在过滤就存在绕过的可能性。

最常见的方式是尝试anythinghere**theirdomain.com**，他们通常ui检查他们的域名是否被查找到，就像这个例子中的一样。

在测试CORS的时候，你仅需添加`Origin: theirdomain.com` 在每一个你发起的请求里，然后创建一个grep,来检测`Access-Control-Allow-Origin` 。即使你发现了一个确认的endpoint包含该header,但是却不包含任意敏感信息，你也需要花费时间去尝试bypass。过滤器。开发人员总是重复使用代码，这里的“harmless” bypass也许会在你研究的随后起到作用。



## SQL Injection

特别需要注意的是，遗留代码更容易受到SQL injection,所以留意旧有功能。SQL injection能够简单地在站点上被测试，因为大多数代码都会进行某些数据库查询（举个例子，比如查询，他通常会用你的输入查询数据库）。

过去：

- 当测试SQL注入时，你能够简单地利用`‘ and `  去寻找错误，但自从过去以来发生了很多变化，许多开发者开始禁止error messages。

现在：

- 使用`sleep`进行盲注。例如：
  - `' or sleep(15) and 1=1#`
  - `' or sleep(15)#`
  - `' union select sleep(15),null#`



测试SQL诸如，采取和XSS一样的方法，并且是在整个web application中测试。

作者：**Being honest I do not have as much success
finding SQL as I do with other vulnerability types**



## Business/Application Logic

理解网站是如何工作的，并且尝试不同的技术去创造奇怪的行为，可能会导致一些有趣的发现。例如想象你的目标测试网站发放贷款，他们有最大限制是`£1,000`，如果你能简单地改为10000,并且bypass了他们的限制，那么你什么也没做仅仅是利用了你前面的功能。不需要扫描，没有奇怪的filter，没有真正涉及黑客行为，只是简单地检查该过程是否正常工作。

另一个常见的当hunting for application logic bugs的查找是新特性和旧特性的交互（**new features which interact with old features**），想象一些，你可以声明页面的所有权，但是你需要提供身份证明。

新特性出现让你升级页面去获取一些额外的好处，但是唯一需要的信息是有效付款数据。一旦提供，他们将加你为页面的所有者，且你会bypass掉认证步骤。当你继续阅读时，你会发现笔者的方法论就是花几天/几周时间去了解一个网站如何运行的，以及开发人员希望用户去输入/做什么，以及相处打破和绕过的方法。

另一个例子是一些企业逻辑漏洞能够注册一个用户，以example@target.com注册。一些时候这些账户拥有特权，例如没有速率限制和绕过某些验证。

当你对一个web application如何工作了解的时候，business/application逻辑漏洞就会浮出水面。你对他们所提供的也有了更清晰的了解。The more you use their website the more you’ll start to
understand how things SHOULD work





# Chosing a program

> I typically choose wide scope and well known names

> **There is no right or wrong answer to choosing a bug bounty program if I'm
> honest.**

> If the first few reports go well then I will continue



以下是确认你是否参与了运行良好的漏洞赏金计划的清单：

- 团队是否直接与你沟通，或是否100%依赖平台？能够与团队直接沟通与交流是最好的，如过program使用的是托管服务，则务必谨慎
- program活跃吗？scope最后一次更新是什么时候？（通常在bug bounty platform上存在"update"的tab）
- 团队如何处理“low hanging furit bugs” 在chains中能够制造更大的影响？团队是否视不同XSS都是一样的，或者他们认可你的工作甚至奖励更多？这是你的风险与回报将发挥作用的地方。一些programs将会为XSS支付相同的回报，而另一些则会根据影响来支付。
- 大概在3～5篇报告的响应时间。如果你在报告3个月以上仍在等待答复，那么思考在这个program是否值得花费更多的时间。很可能没有



# Writing notes as you hack

在前面笔者自己后悔自己第一次参与赏金计划时，没有记笔记（我也需要注意）

写笔记能够切实在当你未来卡住的时候起到帮助。当你觉得，你已经浏览过所有提供的特性时，你需要**回顾你的笔记** 去重温有趣的点，以及用新的心态尝试新的方法。

记录笔记的方法没有正确的和错误的，这里笔者提出了参考，

- 他自己使用sublime，，并且记录有趣的endpoint，有趣的行为，或参数。有时候，笔者会测试无法利用的某个feature/endpoint（想着我之后会回来的）。**Never burn yourself out**
- 另一件笔记需要记录的，是**create custom wordlists**
  - 假设，我们测试example.com的时候，发现了`/admin`,`/admin-new`,以及`/server_health`，伴随着参数`debug`和`isTrue` 。我们可以创建一个`examplecom-endpoints.txt & params.txt`,这样我们知道这些endpoint在特定的domain上工作。
  - 而且，你可以跨多个domains来测试所有的endpoints/parameters。并且创造一个 “global-endpoints.txt” ，开始提供常见的发现到的endpoint。Over time you will end up with lots of endpoints/parameters for specific domains and you will begin to map out a web application much easier.







# Let’s apply my methodology & hack！



## Step One: Getting a feel for things



 With that said, before I even open a program's in-scope domain I
want to know something.

**Has anyone else found anything and disclosed a writeup?**

在开始hacking之前，笔者将会google,hackerone disclosed以及OpenBugBounty上查找任何过去发现的问题。因为笔者想是否有有效的问题被发现，以及是否存在任何有趣的bypass.

- https://www.google.com/?q=domain.com+vulnerability
- https://www.hackerone.com/hacktivity
- https://www.openbugbounty.org/



测试公开披露的漏洞能够给你一个立即开始的起点，以及当你感受网站如何工作时，给你一个站在不同问题类型上的视角。一些时候，你甚至需要bypass old disclosed bugs！（https://hackerone.com/reports/504509 )

1. 在开始最初检查和运行任何扫描器前，笔者也先了解一下他们的web application是怎样工作的。在这一点上，笔者将测试上述列出的bugs足为他自己的总体意图——理解这些东西在一开始是怎样运行的。基于假设：”网站是安全的“ & ”它应该按意图的流程来“

2. 记住要**记笔记**。当笔者测试一些feature,例如register&login的时候，通常在大脑中会有一系列的问题，例如，我能够用我的社交账户登陆吗？这个在mobile app上表现的一致吗？如果我尝试其他的地里定位，我能够登陆后有更多的选项，例如WeChat。 哪些字符是不允许的？

   > **I let my thoughts naturally go down the rabbit hole because that's what makes you a natural hacker.**

​	  当你注册时，那些输入是你可控的？他们反映在那里？再次，手机注册时网站会使用不同的代码吗？笔者喜欢从简单的注册这里找到大量的XSS在mobile app上，而不是desktop。并且没有过滤！



-----



Below is a list of key features I go for on my first initial look & questions I ask
myself when looking for vulnerabilities in these areas. Follow this same approach
and ask the same questions and you may very well end up with the same answer I
get... a valid vulnerability!



### **Registration Process**



- 注册需要什么？
- 是否需要大量信息（Name,Location,bio,etc)
- 这些那里会在注册后所反映

一个随后的例子，当你注册以`BARKER`时，它会要求你输入display name,profile description以及upload a photo。他要求了很多信息能让你玩上几个小时，让我们分解它，并弄清楚我们应该寻找什么。



**Uploading a photo**

上文提到，我们想知道我们能上传什么类型的图片，所以我们上传普通的jpeg图片。但，改变扩展名为`.txt` ,`.xml`，`.svg`，然后看它如何处理的。这取决于web application工作方式，你可能看不到你上传的photo，直到你完成了注册流程。Now can you see why re-testing features multiple times comes into action?



**Display name and profile description**

同样，在你完成注册过程之前，这些可能会不被看到。但是他们在那里反映，哪些字符被允许？

不仅如此，还要考虑这些信息会在**哪里**被使用。想象一下，你能够通过`<``>`但是当你在桌面上浏览个人资料时却不会受到攻击，这个时候考虑mobile apps，或者与网站交互时（发布一个文章，添加一个人）。开发者只阻止了你页面的XSS吗？

Q&A:

- 我能够用自己的社交媒体张号码？

  - 如果是，这是通过某个类型的Oauth flow实现的并且包含我的token,我的token可能会被泄漏？允许哪类社交媒体？他们信任我的社交媒体上的哪些信息？

- Google知道这些注册页面吗？

  - Login/register页面的改变（为了用户体验），google机器人索引能够记住很多：

    ````
    site:example.com inurl:register inurl:& 
    
    site:example.com inurl:signup inurl:&
    
    site:example.com inurl:join inurl:&
    ````

    

### **Login Process ( and reset password)**

- 登陆页面上是否使用了重定向参数？

  答案通常是“是”，如果他们想人用户完成登陆后受控制的跳转。Even if you don’t see one being used always try the most common, in various upper/lower cases: ==returnUrl, goto,
  return_url, returnUri, cancelUrl, back, returnTo==

  



![image-20211202110132955](/home/koui/Documents/BB Notes/《zseano's methodogy》学习笔记.assets/image-20211202110132955-16384140965051.png)



- 如果我尝试使用`myemail%00@email.com`登陆会如何？它会识别为`myemail@email.com`吗，或许允许我登陆进？如果是，尝试注册`my%00email@email.com` 并尝试一个用户的takeover.在声明用户名时也要考虑同样的问题

- 我能够用我的社交账户登陆吗？

  If yes, is this implemented via some
  type of Oauth flow which contains tokens which I may be able to leak? What social
  media accounts are allowed? Is it the same for all countries? This would typically be
  related to the registration process however not always. Sometimes you can only
  login via social media and NOT register, and you connect it once logged in. (Which
  would be another process to test in itself!)

- mobile登陆流会和desktop有所不同吗？

​    记住，用户体验！mobile websites设计给不需要鼠标去导航只需要简单的导航。

- 重置你的密码的时候，用了哪些参数？

​	也许，这里有IDOR的漏洞（尝试诸如id参数）。host标头是否可信？尝试重置密码时，设置host为`Host: evil.com`，网站会信任该值并且发送到email吗，当用户点击这个链接的时候，是否会导致重置密码token泄漏（比如，链接到`evil.com/resetpassword?token=123`)

​     通常，你进行login/register/reset密码的时候要有速率限制（brute force），但通常考虑**informative/out of scope**，所以笔者不总是浪费世界。检查 program policy以及和他们对立的立场。大多数网站都采用了稳固的密码政策和2FA





### **Updating account information**



- 当你更新页面信息的时候，是否存在CSRF保护？

  （这里应该有，并且期待它存在。记住，我们期待这个网站一切都是安全的，并且我们要挑战我们自己绕过他们）。如果是，它是怎样生效的？如果我发送一个空白的CSRF token,或者同样长度的token会发生什么。



- 更改你的email/password,有第二步确认吗？

  如果没有，那么你可以将其与XSS（用XSS来实现账户接管）来作为一个攻击链。通常，它本身不是问题。但是如果program想看到XSS的影响，这个是必须的。



- 他们是如何处理基础的`< > " '` 字符，以及他们在哪里被映射？

  unicode又是怎样的呢？像`%09 %07 %0d%0a` 这些字符应该在一切可能的地方进行测试，  It’s mentioned a few times, but sometimes things can be overlooked. **Leave no stone unturned**

  

- 我能否在我自己的profile中输入我自己的URL？

  有什么针对`javascript:alert(0)`的过滤？这是我在设置个人资料时寻找的关键

  

- 更新账户的页面与mobile app有什么区别？

  大多数mobile app使用api来更新信息，所以也许它很容易受到IDOR影响。除了这个，也可以采用不同的过滤系统。笔者有很多例子：desktop端存在XSS过滤，但是对于mobile application却没有针对XSS的过滤。Perhaps the mobile team is
  not as educated on security as the desktop team? Maybe it was rushed.

- 如何处理photo/video上传（如果提供的话）？

  在它说仅能上传`.jpg` `.png`的前提下我还能上传`.txt`吗？他们存储这些文件在root domain还是托管在某处？即使他们托管在某处（example-cnd.com)检查该域名是否被包含在CSP，也许它会有用。

- 在我公开的profile上，有哪些信息是我可控的？

  关键是在于你能控制的在哪和怎样被映射。例如，有什么可以防止我在我的bio输入恶意HTML？也许它们过滤了`<``>`，并且反映为如下：

  `<div id=”example” onclick=”runjs(‘userinput&lt;&quot;’);”>`

  但是你可以使用` ‘);alert(‘example’);`



### Developer tools

开发者工具有时会包括一些类似于测试webhooks,oauth flows,graphql explorers。这些工具专门为 开发者设置的工具能够测试各种公开API.



- 托管到哪里？

  这个很重要，如果托管到AWS，你的目标则为AWS密钥

- **google for SSRF webhook and you’ll see**



这一章节不做过多笔记



### The main feature of the site

比如dropbox,笔者就会着重在处理文件上传并从那里开始。会在不同网站上链接自己账户查看第三方如何交互工作的。

**Map their features starting from the top**

As you test each feature you should overtime get a
mental mind map of how the website is put together 



- 所有的features仅在web application上提供，还是都提供了

他们有什么不同吗？如果你发现了只在手机app上的feature,而没有桌面版的 。不要忘记测试不同国家地区的，你也许发现不同国家/区域提供的也是不一样的。



- What features are actually available to me, what do they do and what type of data is handled?Do multiple features all use the same data source?



-  Can I pay for any upgraded features? If yes test with a paid vs free account. Can
   the free account access paid content without actually paying? Typically payment
   areas are the most missed as researchers are not happy to pay for potentially not
   finding an issue. Personally I have always found a bug after upgrading but this may
   differ from program to program.



- What are the oldest features? 

  Old code = bugs

- What new features do they plan on releasing?Can I find any reference to it already on their site？ Follow them on twitter & signup to their newsletters.

  一篇不错的文章：https://www.jonbottarini.com/2019/06/17/using-burp-suite-match-and-replace-settings-to-escalate-your-user-privileges-and-find-hidden-features/  ==《USING BURP SUITE MATCH AND REPLACE SETTINGS TO ESCALATE YOUR USER PRIVILEGES AND FIND HIDDEN FEATURES》==

- Do any features offer a privacy setting (private & public)? Spend time testing if
  something is simply working as they’ve intended it to. Is that post really private?

- If any features have different account level permissions (admin, moderator,user, guest)

#### Payment feature

- What features are available if I upgrade my account? Can I access them without paying? 

- \- What payment options are available for different countries?

  一些用于测试的卡号：http://support.worldpay.com/support/kb/bg/testandgolive/tgl5103.html

  以及：https://www.paypalobjects.com/en_GB/vhelp/paypalmanager_help/credit_card_numbers.htm



## Step Two:Expanding our attack surface

 

这一部分，笔者跑上述文中提到的subdomain扫描工具，去看看列出来的结果有什么新的。

笔者写到，在工具扫描的时候，会对网站的一些feature进行测试。例如如下的关键字：
`developer, affiliate, careers, upload, mobile, upgrade, passwordreset`



当你测试主要功能的时候，你需要记录下有趣的endpoints,这些endpoint会帮助你解决问题。

> There is no right answer as to what to dork for, the possibilities
> are endless. There is a great post I recommend you check out here - https://exposingtheinvisible.org/guides/google-dorking/



有时，这里会让作者忙上几天，因为google是世界上最出色的爬虫。

- 另一个研究人员容易忽视的问题就是在dorking是google的重复结果时。当你点击搜索的最后一也，点击“repeat the search with the
  omitted results included“会有更多的结果。

- 当你搜索的时候，你可以用"`-keyword`" 来去掉特定的你不感兴趣的endpoint。

> Don't forget to also check the results with a mobile user-agent as the Google results on a mobile are different to desktop.





- 笔者也会使用文件后缀名进行google dorking,例如：`php, aspx, jsp, txt, xml, bak` 。文件后缀名的泄漏会给你domain/server在网站上使用了什么技术栈的视角，也会帮助你决定使用什么样的**worldlist** （你甚至可能会幸运的找到敏感文件泄漏）。

>  **Don’t blindly use wordlists on your targets and actually use meaningful wordlists to yield better results**



- 同样的方法适用于Github（and other Search engines such as
  Shodan, BinaryEdg）。Dorking和搜索特定的字符串，例如：“domain.com” **api_secret, api_key, apiKey, apiSecret,password,admin_password **



-------

**After dorking**:

subdomain工具搜索完成，笔者使用XAMPP来快速扫描/robots.txt.

/robots.txt是一个很好的标识：子域名是否值得进一步扫描文件/目录

> Why robots.txt? 
>
> Because Robots.txt contains a list of endpoints the website owner does & does NOT want indexed by
> google so for example if the subdomain is using some type of third-party software then this may reveal information about what's on the subdomain.





> You can expand your robots.txt data by scraping results from WayBackMachine.org. WayBackMachine enables you to view a site's history from years ago and sometimes old files referenced in robots.txt from years ago are still present today
>
> I have high success with wide-scope programs and WayBackMachine





在对/robots.txt及子域名做对应处理后，接着，扫描一些公共endpoint,例如：`/admin`,`/server-status`以及成功扩大我的单词列表。你能够在本指南开发找到wordlists的引用以及工具。



​		主要看一些敏感文件/目录的暴露



>  creating a custom wordlist as you hunt can help you find
>  more endpoints to test for. 



学习进行扫描的同时——进行发现新的endpoint,也同时检查一些更新。学习如何构建自定义wordlists。，这对于你的研究来说至关重要。

在hunting中，记录你所发现的参数（特别是变量参数）是特别重要的。这节省了大量的时间。同时，积累的wordlists后，可以用burp配合在每一个endpoint使用。测试是否存在多个漏洞，例如XSS。







> This is one reason I created “InputScanner” so I could easily scrape each endpoint for any input name/id listed on the page, test them & note down for future reference.



> I define the position on /endpoint and then simply add discovered parameters onto the request, and from there I can use Grep to quickly check the results for any interesting behaviour. /endpoint?param1=xss”&param2=xss”. Lots of endpoints, lots of common parameters = bugs! (Don’t forget to test GET.POST! I have had cases where it wasn’t vulnerable in a GET request but it was in a POST. _GET vs $_POST)



深入研究。重复每个过程。尽可能学习一切。**The more you look, the more you learn.**



## Time to automate! Step Three:Rinse & Repeat

在这个点上，我花费了数月在同一个program上。而且有着完整的关于目标的mental mind map，我一路上所写的全部的笔记。

牢记这个事实，开发人员每天在持续更新新的代码，而十年前犯的错误如今仍在继续。保持tools检查新的改变，在你的笔记中列出有趣的endpoint。，保持dorking,测试他们提出的新的features。并且，你可以采用这个方法到另一个program中，

以下是笔者对于读者的几个建议：

- **扫描子域名，文件，目录&泄漏**

你需要将这个扫描流程自动化。这些过程耗费时间，你应当将时间耗费在hacking。上。You can use a service such as CertSpotter by SSLMate to keep up to date with new HTTPS certificates a company is creating and @NahamSecreleased LazyRecon to help automate your recon:https://github.com/nahamsec/lazyrecon



- **Changes on a website**

了解网站是如何工作的，然后不断地检查是否有新功能&特性。Don’t forget to also include .js files in those daily scans as they typically contain new code first before the feature goes live



# 笔者过去经验



把感兴趣的截图了（





## 补充

https://www.startpage.com/ 隐私搜索（google）