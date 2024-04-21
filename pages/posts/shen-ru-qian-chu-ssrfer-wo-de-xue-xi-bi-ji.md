---
title: '深入浅出SSRF（二）：我的学习笔记'
date: 2022-11-30 23:22:46
tags: [SSRF,笔记]
published: true
hideInList: false
feature: 
isTop: false
---
困困更blog…… 
之前拿着本来要发blog的文章去“换”了一个会员...其实我不太喜欢闭源小圈子分享（虽然能换积分/社区认同），我还是喜欢自己博客发，要么不发....小透明的坚持，等找工作/需要交换资源需要再说= = 目前还是一个能自闭就自闭的宅宅一枚
一写blog才知道自己语言表达有多差，尽请谅解。顺便强调 学习笔记 。都是学别人的呜呜，我只是整理在了一起，做个整理工。

## XSS+PDF==SSRF

来自：[https://docs.google.com/presentation/d/1JdIjHHPsFSgLbaJcHmMkE904jmwPM4xdhEuwhy2ebvo/htmlpresent](https://docs.google.com/presentation/d/1JdIjHHPsFSgLbaJcHmMkE904jmwPM4xdhEuwhy2ebvo/htmlpresent)

通常pdf生成不是直接生成的，需要通过一些微调。

> The attack strategy used will depend on what conversion system is in use in the application, but these can be broken into two categories: Headless browsers and HTML renderers.

补充：之前还遇到pdf根据yml文件生成，构造恶意yml文件，从而导致任意命令执行（Ruby漏洞）

### Headless Browsers & HTML Renderers

**Headless Browsers**

常见的headless browsr有：

- wkhtmlpdf ： Webkit implementation
- headless chrome
  - Unlike wkhtmltopdf, it cares if you try to load an http resource inside an https page
  - JS engine cares about SOP(Same-Origin Policy)

**HTML Renderers**

不同于普通浏览器引擎，渲染器直接解析html和css来工作，不需要任何javascript

WeasyPrint is a great example of this class of HTML->PDF converters (more later)

### 构想：

**XSS → SSRF via wkhtmltopdf**

payload

```bash
<iframe src=”http://169.254.169.254/user-data”>
````

**XSS via escaping style tag**

we are allowed to customize the fonts and styling of the generated PDF

- Confirm it renders HTML within the PDF Generator
- Can it fetch anything from a remote host”?

payload like this

```bash
<style><iframe src=”http://169.254.169.254/user-data”>
```

### 根据pdf generaterer 构造payload 之 WeasyPrint：

以上构想，weasyprint pdf生成器不会渲染iframe下的链接。weasyprint 仅支持渲染：

- img
- embed
- object
- link

这里用link构造payload

```bash
<link rel=attachment href=”file:///etc/passwd”>
```

## CVE

- JIRA CVE-2017-9506
  - ~~这个例子搜的话，有一篇对应的文章是将DOD（美国防部）下的三大主网之一的NIPRNet下出现的ssrf~~ 什么的我才不会说

## How to prevent

- Whitelisting
- Blacklisting
  - 如果内网地址加入了黑名单,可以用指向该内网地址的域名来跳过防御
- Restricted Content-Type,extensions,or characters -Only allows a particular file type
- No response

## SSRF Tools

### HTTPRebind

Rebinding attacks can be very valuable for SSRF, but they require a lot of setup work, tweaking, and programming. HTTPRebind combines a DNS server with an HTTP server to automatically handle all of this for you.

- Usable against any headless browser
- Takes only seconds to run due to DNS cache flushing
- Automatically pulls critical data from GCP, AWS, and Azure

Get the source at [https://github.com/daeken/httprebind](https://www.google.com/url?q=https://github.com/daeken/httprebind&sa=D&source=editors&ust=1669802685477614&usg=AOvVaw0ZOeVy2tBaGWcMI47AFqyE)

### SSRFTest

This tool lets you quickly do a first-pass test for SSRF. It will record incoming requests for your different targets as well as automatically attempt to access and dump data from EC2 metadata service.

The optimal targets for SSRFTest’s automated functionality are real headless browsers living in the cloud, but it’s a useful starting point for any SSRF exploitation.

Get the code at [https://github.com/daeken/SSRFTest](https://www.google.com/url?q=https://github.com/daeken/SSRFTest&sa=D&source=editors&ust=1669802685480299&usg=AOvVaw36eed8jzuiS_G8FLPo1Ho5) or use the public instance at [https://ssrftest.com/


## Reference

Udemy

- [https://www.udemy.com/course/intro-to-bug-bounty-by-nahamsec/learn/lecture/24998004#overview](https://www.udemy.com/course/intro-to-bug-bounty-by-nahamsec/learn/lecture/24998004#overview)

Medium

- [https://vickieli.medium.com/bypassing-ssrf-protection-e111ae70727b](https://vickieli.medium.com/bypassing-ssrf-protection-e111ae70727b)
- [https://infosecwriteups.com/piercing-the-veil-server-side-request-forgery-to-niprnet-access-c358fd5e249a](https://infosecwriteups.com/piercing-the-veil-server-side-request-forgery-to-niprnet-access-c358fd5e249a)

PPT

- Google doc
  - [https://docs.google.com/presentation/d/1JdIjHHPsFSgLbaJcHmMkE904jmwPM4xdhEuwhy2ebvo/htmlpresent