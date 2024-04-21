---
title: 'XSS水题篇：关于DOM Colbbering一些个人理解'
date: 2023-02-01 14:44:38
tags: [XSS,学习笔记,技术阅读]
published: true
hideInList: false
feature: https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_2/Untitled.png
isTop: false
---
遇到一个DOM Colbbering题目
题目

```jsx
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

本打算使用：

```jsx
javascript:prompt(1)#{"name":"Matt"}
```

但是会forbidden

这里禁止了所有的javascript和vbscript脚本执行。

这里name和对应的value的attribute属性可以被重写，比如将name改为action，这样就可以通过 `input` 标签来破坏form的action属性（由于DOM clobbering）
后发现这里用DOM Clobbering解决：
```jsx
javascript:prompt(1)#{"action":1}
```

先来一段console：

![](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_2/Untitled.png)

*注意 我这里写成actions是为了直接在沙盒下调出console方便调试。

由于DOM 存在可破坏性，所以document.forms[0].action 会寻找除了form自带action外，所有form下name为action的内容。从而跳过了判断。但这是依据什么标准呢？为什么会有这种情况出现呢？为了继续探索DOM clobbering，而不是停留在一道题的了解下，我又去进行了搜索：

[淺談 DOM Clobbering 的原理及應用](https://blog.huli.tw/2021/01/23/dom-clobbering/)

huli大佬这里form的利用姿势还提到了一个用form和a结合的方法。基于对huli大佬文章的阅读我来对这个题目的DOM  clobbering的原理进行一些推论，首先，关联form标签，huli大佬提到了两个标准特性：

第一个：这里我们知道了form标签下存在属性可覆盖性（可能描述不准确，请看原文）。

```jsx
`form[name]`

Returns the form control (or, if there are several, a `[RadioNodeList](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#radionodelist)` of the form controls) in the form with the given [ID](https://dom.spec.whatwg.org/#concept-id) or `[name](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-name)` (excluding image buttons for historical reasons); or, if there are none, returns the `[img](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)` element with the given ID.
Once an element has been referenced using a particular name, that name will continue being available as a way to reference that element in this method, even if the element's actual [ID](https://dom.spec.whatwg.org/#concept-id) or `[name](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-name)` changes, for as long as the element remains in the [tree](https://dom.spec.whatwg.org/#concept-tree).
If there are multiple matching items, then a `[RadioNodeList](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#radionodelist)` object containing all those elements is returned.
```

这里写的即使原始的ID或name被修改，也会将之前的element保存在tree里。同时，还存在RadioNodeList，负责处理多个匹配到的items

第二个标准提到的就是：HTMLCollection

```jsx
The namedItem(key) method steps are:

If key is the empty string, return null.

Return the first element in the collection for which at least one of the following is true:

it has an ID which is key;
it is in the HTML namespace and has a name attribute whose value is key;
or null if there is no such element.
```

那么这里用到的是哪一个呢？我的猜想是这里用到的是HTMLCollection特性，由于没有特定说明id的原因，所以默认form和内层标签为同一id，`document.forms[0].action` 取到的为form内层的action。 
最后，dom clobbering的应用场景是什么呢？我的理解是，如果javascript的过滤过于“严密”，或者没有javascript注入的地方，就可以利用dom clobbering来用html标签的注入，来改变js的内容或跳过js的判断。

这里我关于文章里的”层级“的理解不是很深入再加上我前端知识学的还尚浅，后续希望遇到类似的实际场景进行探索和理解修正。也欢迎各位评论区指正，非常感谢。

## Reference&Resource：

- 参考：[https://blog.huli.tw/2021/01/23/dom-clobbering/](https://blog.huli.tw/2021/01/23/dom-clobbering/)
- 扩展阅读：[https://portswigger.net/research/dom-clobbering-strikes-back](https://portswigger.net/research/dom-clobbering-strikes-back)