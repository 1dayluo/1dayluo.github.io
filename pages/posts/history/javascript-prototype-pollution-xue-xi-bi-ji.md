---
title: 'Javascript Prototype Pollution 学习笔记'
date: 2022-05-26 20:45:41
tags: [javascript,学习笔记,prototype pollution]
published: true
hideInList: false
feature: 
isTop: false
---
笔记中英文混杂,问就是懒得翻译.学习笔记都是二次吸收,原始文章见Resource&Reference处. 笔记只是留给自己学习反复查阅和理解的......尽可能写的对自己来说全面一些.

~~其实学了也还不会找gadget,我都想要不要去学下前端开发了_(:3_|/_)~~ 今天也是被自己菜到抑郁的一天呢!


## Intro

Prototype Pollution is a vulnerability that allows attackers to exploit the rules of the JavaScript programming language, by injecting properties into existing JavaScript language construct prototypes

：Properties on the `Object.prototype` are then inherited by all the JavaScript objects through the prototype chain

- JavaScript allows all Object attributes to be altered，This includes their magical attributes such as `__**proto__`** , `constructor` and `prototype`

### impact

- Denial of Service: by triggering JavaScript exceptions
- RCE: by tampering with the application source code to force the code path that the attacker injects
- XSS:

## Base Knowledege

### **理解object**

最简单的object：

```jsx
var obj = {};
```

该object有一些 `property` : 

- `obj.__proto__`
- `obj.constructor`
- `obj.toString`
- ….

In JavaScript, functions can be treated like normal variablesIn JavaScript, functions can be treated like normal variables

so object  methods are definede as properties, like this:

```jsx
var o = {name: 'Ivan', surname: 'Ivanov'}
o.foo = function() {
console.log("foobar")
}
```

```jsx
> o.foo()
< foobar
< undefined
```

进一步理解：

The concept of a class in JavaScript starts with a function. The function itself serves as the constructor of the class

```jsx
function MyClass() { 
} 
 
var inst = new MyClass();
```

这里Function被所有在原型（proptotype)上声明的“MyClass”实例所使用，且原型在运行时被修改。这意味着任何时候都能够修改一个class的prototype（增加，修改，删除）

回头看最开始的（最简单的object），可以理解为该object的构造函数其实是 `Object` ，而例如 `toString` 则是 `Object` 上的prototype。 

### Property access

<aside>
💡 What’s good to note is that in JavaScript there is no distinction between a property and an instance function


</aside>

获取property的方法参考:[https://www.notion.so/Javascript-Prototype-Pollution-232f17fb812543ff9749b1257cee191e#6856032c4ccf42368be8f7e3e9447c4c](https://www.notion.so/Javascript-Prototype-Pollution-232f17fb812543ff9749b1257cee191e)

- obj.name
- obj[”name”]

### Object prototype

Let’s call  `toString()` method

```jsx
> o.toString()
< "[object Object]"
```

<aside>
💡 check the prototype of object o,call use Object.getOwnPropertyNames()


</aside>

**Where did the `tostring` method come from?**

Almost any entity is an object that includes arrays, functions, and even class definition!

**property** `[[Prototype]]`

How can you use them to implement such a convenient feature of the classes as inheritance? You can select a special property that each object will have. It will contain a reference to the parent. Let's call this property `[[Prototype]]`

what if we don't want to inherit all the properties and methods from the parent,Let's select a special property from the parent from which the properties and methods will be inherited and call it `prototype`!

When you access an object property via [o.name](http://o.name/) or o['name'] actually does the following:

1. The JavaScript engine searches for the `name` property in the `o` object.
2. If the property is present, it is returned. Otherwise, the prototype of the `o` object is taken and the property is searched for in it!

So it turns out that the `toString()` method is actually defined in `Object.prototype` 

```jsx
> o.__proto__
< {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
> o.__proto__.__proto__
< null
```

一直到null的这条prototypes的链条称为原型链

📢 By the way, the word “prototype” in JavaScript can refer to at least three different things, depending on the context:

- Internal property [[Prototype]]. It is called internal because it lives in the "guts" of the JavaScript engine, we only get access to it through the special functions **proto**, Object.getPrototypeOf(), and others.
- The prototype property: Object.prototype, Function.prototype, and others.
- The **proto** property. A rare and not quite correct use, because technically **proto** is a getter / setter and only gets a reference to the prototype of the object and returns it.

### `__proto__` 和 prototype的区别

首先 `class` 是语法糖,

`prototype` (原型)用于声明类时,创建类下的方法(不然会新建对象,其下的方法就会执行一次),**可以认为prototype是类 `Foo` 的一个属性.** 

```jsx
function Foo() {
    this.bar = 1
}

Foo.prototype.show = function show() {
    console.log(this.bar)
}

let foo = new Foo()
foo.show()
```

类对象在实例化的时候,会拥有prototype中哦你感动属性和方法

`__proto__` 用于访问原型(prototype), 即 

```jsx
foo.__proto__ == Foo.prototype
```

### 原型链继承

原型链的查找发生在对象上.

1. 每个构造函数(constructor)都有一个原型对象(prototype)
2. 对象的`__proto__`属性，指向类的原型对象`prototype`
3. JavaScript使用prototype链实现继承机制

## What is prototype pollution?

> The term prototype pollution refers to the situation when the `prototype`
>  property of [fundamental objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#fundamental_objects)
>  is changed.

what prototype pollution look like in the code

```jsx
var o = {};
var a = process.argv[2];
var b = 'test';
var v = process.argv[3];

console.log(({}).test);

o[a][b] = v;

console.log(({}).test);
```

attacker controls the parameters `a` and `v` ,they can:

- `v = __proto__`

## base sample:

sample 1:

```jsx
let someObject = {}
let user = {}

console.assert(user.isAdmin === true)
// Rerturn:Assertion failed

someObject.__proto__.isAdmin = true

console.assert(user.isAdmin === true)
// Return:udefined
```

sample 2

```jsx
// foo是一个简单的JavaScript对象
let foo = {bar: 1}

// foo.bar 此时为1
console.log(foo.bar)

// 修改foo的原型（即Object）
foo.__proto__.bar = 2

// 由于查找顺序的原因，foo.bar仍然是1
console.log(foo.bar)

// 此时再用Object创建一个空的zoo对象
let zoo = {}

// 查看zoo.bar
console.log(zoo.bar)
```

sample3

```jsx
let o1 = {}
let o2 = JSON.parse('{"a": 1, "__proto__": {"b": 2}}')
merge(o1, o2)
console.log(o1.a, o1.b)

o3 = {}
console.log(o3.b)
```

JSON解析的情况下，`__proto__`
会被认为是一个真正的“键名”，而不代表“原型”，所以在遍历o2的时候会存在这个键。

## Detection

该节参考:[https://blog.s1r1us.ninja/research/PP](https://blog.s1r1us.ninja/research/PP) 

### Case 1

检查 `query/hash`  

该例子使用了[canjs-deparam](https://www.google.com/url?q=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcan-deparam&sa=D&sntz=1&usg=AOvVaw220_I7_8edi7_BK19uQKBF) 库去解析query参数

```jsx
keyBreaker = /([^\[\]]+)|(\[\])/g,
...
module.exports = namespace.deparam = function (params, valueDeserializer) {
    valueDeserializer = valueDeserializer || idenity;
    var data = {}, pairs, lastPart;
    if (params && paramTest.test(params)) {
        pairs = params.split('&');
        pairs.forEach(function (pair) {
            var parts = pair.split('='),
                key = prep(parts.shift()),
                value = prep(parts.join('=')),
                current = data;
            if (key) {
                parts = key.match(keyBreaker);
                for (var j = 0, l = parts.length - 1; j < l; j++) {
                    var currentName = parts[j],
                        nextName = parts[j + 1],
                        currentIsArray = isArrayLikeName(currentName) && current instanceof Array;
                    if (!current[currentName]) {
                        if(currentIsArray) {
                            current.push( isArrayLikeName(nextName) ? [] : {} );
                        } else {
                            // If what we are pointing to looks like an `array`
                            current[currentName] = isArrayLikeName(nextName) ? [] : {};
                        }

                    }
                    if(currentIsArray) {
                        current = current[current.length - 1];
                    } else {
                        current = current[currentName];
                    }

                }
                lastPart = parts.pop();
                if ( isArrayLikeName(lastPart) ) {
                    current.push(valueDeserializer(value));
                } else {
                    current[lastPart] = valueDeserializer(value);
                }
            }
        });
    }
    return data;
}; 
var obj = deparam(location.hash.substr(1))
```

例如上面的例子,检测是否存在原型链污染解析的方式是遍历不同的原型链污染payload在 `location.hash` 和 `location.search` 中:

```jsx
x[__proto__][abaeead] = abaeead

x.__proto__.edcbcab = edcbcab

__proto__[eedffcb] = eedffcb

__proto__.baaebfc = baaebfc
```

### Case 2

这个例子里,我们检查一些位于客户端的**用户输入**或一些**data/response处理**的功能,会导致原型链污染.大部分时候,这个将导致self-XSS,这是因为攻击者无法控制例如case1的来自于location的输入,但,大部分时候,self-XSS能转换为reflected XSS

这部分自动化使用CodeQL,需要下载全部的javascript,然后创建CodeQL数据库并扫描是否有js会导致prototype pollution

### ****Property definition by path/location****

<aside>
💡 There are numerous JavaScript libraries which are vulnerable to Prototype Pollution due to *`document.location`*


</aside>

Prototype pollution list：https://github.com/BlackFan/client-side-prototype-pollution 

- see al available properties of the Object: `Object.prototyp`

you can pollute：

- polluting all the object with the new attribute (reference [JSON解析的情况下，`__proto__`
  会被认为是一个真正的“键名”，而不代表“原型”，所以在遍历o2的时候会存在这个键。](https://www.notion.so/JSON-__proto__-o2-a379ece6dec24bdd87fe60bc39932a04) ）
- polluting the DOM （reference [](https://www.notion.so/e19fee3d65fb47309c476cb7e103536b)  )

**unsafe merge recurses**

`lodash`and `Hoek` are examples of libraries susceptible to recursive merge attacks.

简述原型污染下merge recurses步骤：

- 检查源代码是否包含 `__proto__` 属性（被 `Object.definProperty()` 命名的），属性存在且一个object既在目标也在源代码中,且在目标上合并递归
- 攻击者定义 `Object` 来源，将properties复制到 `Object` 的prototype上

<aside>
💡 Clone operations是unsafe recursive merges的一个特殊子类：发生在recursive merges的对象是空的Object. `merge({},source)`


</aside>

**Example 1**

<aside>
💡 The impact and severity of Prototype Pollution depends on the application. Property definition by path/location is a key example.


</aside>

we create object Book as：

```jsx
var book = {bookName: "Book name", authorName: "Author of book"};
```

we can use `book.bookName` or `book["bookName"]`  to get the book’s name

- not work:

  ```jsx
  *book.constructor.protoSomeRandomName // this will not work, since there is no attribute protoSomeRandomName*
  ```

- work:

  ```jsx
  Object.__proto__["protoSomeRandomName"]="protoSomeRandomValue"
  book.constructor.protoSomeRandomName // this will work and return value protoSomeRandomValue
  ```

  - We proved this indeed polluted all the objects created from the object Object with the new attribute,and all of these new objects have inherited this attribute from the prototype.

- other ways:

  ```jsx
  Object.__proto__["protoSomeRandomName"]="protoSomeRandomValue"
  Object.__proto__.protoSomeRandomName="protoSomeRandomValue"
  Object.constructor.prototype.protoSomeRandomName="protoSomeRandomValue"
  Object.constructor["prototype"]["protoSomeRandomName"]="protoSomeRandomValue"
  ```

### ****vulnerable *document.location* parsers**

*Credits go to: [s1r1us](https://github.com/msrkp)*

有关的文章:

- [https://blog.s1r1us.ninja/research/PP](https://blog.s1r1us.ninja/research/PP)

相关学习笔记 

[*****document.location 靶场练习笔记*****](https://www.notion.so/document-location-c10ca99b748145849ac793d1ff47ce0e)

**Example 1 : `jquery-deparam`.**

[https://msrkp.github.io/pp/1.html?__proto__[protoSomeRandomName]=protoSomeRandomValue](https://msrkp.github.io/pp/1.html?__proto__[protoSomeRandomName]=protoSomeRandomValue)

related :
[https://security.snyk.io/vuln/SNYK-JS-JQUERYDEPARAM-1255651](https://security.snyk.io/vuln/SNYK-JS-JQUERYDEPARAM-1255651)

**Example 2**

[https://msrkp.github.io/pp/2.html?__proto__[protoSomeRandomName]=protoSomeRandomValue](https://msrkp.github.io/pp/2.html?__proto__[protoSomeRandomName]=protoSomeRandomValue)

**Example 3**

[https://msrkp.github.io/pp/3.html?__proto__[protoSomeRandomName]=protoSomeRandomValue](https://msrkp.github.io/pp/3.html?__proto__[protoSomeRandomName]=protoSomeRandomValue)

## Identifying the vulnerable library

我们下一步需要:

- 识别存在漏洞的library
- 明确具体那一行原型链被污染
- 哪些污染结果存储在了数据库中

如果application不复杂,可以使用以下关键词: `location.hash/decodeURIComponent/location.search` 

### Blocking the JS resource request in Firefox

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled.png20220526_a.png)

为了确认对应的js源文件是否导致了原型链污染.我们可以block url ,然后确认被污染的property是否为 `undefined` ,如果是,则确认该js源文件导致了原型链污染

### Debugger Breakpoint on setter

This technique is easier than others, we can set a breakpoint when the property is set to Obect.prototype.

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled 1.png20220526_a.png)

```jsx
function breakpoint(obj, prop){

	var tmp = obj[prop];

       Object.defineProperty(obj, prop, {

           set: function(val) {

               debugger;

               return tmp = val;

           }

       });

   };
```

### sensitive function

javascript:

- `Object.assign`

npmjs/jquery

- `canjs-deparam` - deparam

 

## Finding Script Gadgets

### What is a script gadget?

定义

On the client-side, the escalation to XSS is the most interesting. The JavaScript code that can be used to escalate prototype pollution to other vulnerability is called a gadget.

在确认了property被污染后,  是否有application logic或功能点能导致javascript execution.

这里举的例子是SwiftType Search library中的script gadget,该payload会导致XSS:

```jsx
https://example.com/#__proto__[xxx]=alert(1)
```

以下是导致产生alert的代码片段(script gadget), `$.each` 遍历 `this._userServerConfiguration.install.hooks` 对象以及位于原型(prototype)上的属性,这将导致我们污染的原型 `xxx` 被执行

```jsx
each: function(t, e, i) {

   /*removed for brevity*/
     else
         for (o in t)
             if (r = e.call(t[o], o, t[o]),
             r === !1)
                 break;

     return t

 }

pInstall._convertStringHooksToFunctions = function() {

   var functionHooks = {};

   $.each(this._userServerConfiguration.install.hooks, function(hookName, hookFunction) {

       functionHooks[hookName] = eval(hookFunction)

   }),

   this._userServerConfiguration.install.hooks = functionHooks

}
```

### using existing gadgets

First of all, it makes sense to check the existing gadgets in the [BlackFan/client-side-prototype-pollution](https://github.com/BlackFan/client-side-prototype-pollution) repository or in the [Cross-site scripting (XSS) cheat sheet.](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet#prototype-pollution)

- Using the [Wappalyzer](https://chrome.google.com/webstore/detail/wappalyzer/gppongmhjkpfnbhagpmjfkannfbllamg?hl=en) plugin.
- Using a script [fingerprint.js](https://gist.github.com/nikitastupin/b3b64a9f8c0eb74ce37626860193eaec).

fingerprint.js使用方式:

- Copy the script and execute it in the context of the vulnerable page.

  ![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled 2.png20220526_a.png)

  - *[fingerprint.js](https://gist.github.com/nikitastupin/b3b64a9f8c0eb74ce37626860193eaec) shows that the page has a Twitter Universal Website Tag gadget*

- 去https://github.com/BlackFan/client-side-prototype-pollution 搜关键词”Universal Website Tag” 发现已知gadget

- 找到后测试:we are interested in the [PoC](https://github.com/BlackFan/client-side-prototype-pollution/blob/004bf5353f6f30b720f3d68c5aca5191531f35d6/gadgets/twitter-uwt.md#poc) section with a ready-made payload. Trying out a payload on a vulnerable site `[https://ctf.nikitastupin.com/pp/known.html?__proto__[hif][]=javascript:alert(document.domain)](https://ctf.nikitastupin.com/pp/known.html?__proto__[hif][]=javascript:alert(document.domain).)`

### 👏 Finding new gadgets

like this: `[https://ctf.nikitastupin.com/pp/unknown.html?__proto__[polluted]=31337](https://ctf.nikitastupin.com/pp/unknown.html?__proto__[polluted]=31337.)`

Despite the fact that Wappalyzer reports the presence of jQuery,this is a false positive due to the jquery-deparam library that is used on the site

There are several approaches to finding new gadgets:

1. [filedescriptor/untrusted-types](https://github.com/filedescriptor/untrusted-types/tree/old). At the time of writing, there are two versions of the plugin: `main` and `old`. We will use `old` because it is simpler than `main`. This plugin was originally developed for DOM XSS search, details can be found in the video [Finding DOMXSS with DevTools | Untrusted Types Chrome Extension](https://youtu.be/CNNCCgDkt5k).
2. [pollute.js](https://github.com/securitum/research/tree/master/r2020_prototype-pollution). How this tool works, as well as what vulnerabilities it allowed you to find, can be read in the article [Prototype pollution — and bypassing client-side HTML sanitizers](https://research.securitum.com/prototype-pollution-and-bypassing-client-side-html-sanitizers/).
3. Search with your hands, using the debugger.

案例请看[https://infosecwriteups.com/javascript-prototype-pollution-practice-of-finding-and-exploitation-f97284333b2](https://infosecwriteups.com/javascript-prototype-pollution-practice-of-finding-and-exploitation-f97284333b2) 下的Edge case 接近于现实的案例.非常精彩的分析过程

### Keyword search and Source Code Review

if application is simple,we can search for keywords like:

- `srcdoc`
- `innerHTML`
- `iframe`
- `crateElement`

review the source code and check if it leads to javascript execution.

Sometimes, mentioned techniques might not find gadgets at all.

In that case, pure source code review reveals some nice gadgets like the below example.

### jQuery example

BlackFan found this cool gadget in jQuery with source code review.

```jsx
<script/src=https://code.jquery.com/jquery-3.3.1.js></script>

<script>

 Object.prototype.preventDefault='x'

 Object.prototype.handleObj='x'

 Object.prototype.delegateTarget='<img/src/onerror=alert(1)>'

 /* No extra code needed for jQuery 1 & 2 */

 $(document).off('foobar');

</script>
```

Here is the piece of code which is responsible for the gadget which is self explanatory.

```jsx
https://github.com/jquery/jquery/blob/5c2d08704e289dd2745bcb0557b35a9c0e6af4a4/src/event.js#L798

if ( types && types.preventDefault && types.handleObj ) {

   handleObj = types.handleObj;

   jQuery( types.delegateTarget ).off(

       handleObj.namespace ?

           handleObj.origType + "." + handleObj.namespace :

           handleObj.origType,

       handleObj.selector,

       handleObj.handler

   );

   return this;

}
```

## Server-side prototype pollution

It all started with the [Olivier Arteau — Prototype pollution attacks in NodeJS applications](https://youtu.be/LUsiFV3dsK8) 
, [prototype-pollution-nsec18](https://github.com/HoLyVieR/prototype-pollution-nsec18).Oliver discovered the prototype pollution vulnerability in [several npm packages](https://hackerone.com/holyvier?filter=type%3Apublic&type=user), including one of the most popular [lodash](https://www.npmjs.com/package/lodash) packages ( [CVE-2018–3721](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-3721)). The lodash package is used in many applications and packages of the JavaScript ecosystem. In particular, it is used in the popular [Ghost](https://github.com/TryGhost/Ghost) CMS

### Finding prototype pollution

没有源代码这类漏洞很难被检测和利用(有CVE和现成的payload除外).

假设,我们有源代码,代码中哪些地方值得被注意,漏洞最常见的地方在哪里?

**What language constructs are prone to the vulnerability?**

Most often, prototype pollution is found in the following constructs / operations:

- recursive merging of objects (for example, [jonschlinkert/merge-deep](https://github.com/jonschlinkert/merge-deep))
- cloning an object (for example, [jonschlinkert/clone-deep](https://github.com/jonschlinkert/clone-deep))
- converting GET parameters to a JavaScript object (for example, [AceMetrix/jquery-deparam](https://github.com/AceMetrix/jquery-deparam))
- convert `.toml` or `.ini` configuration files to a JavaScript object (for example, [npm/ini](https://github.com/npm/ini))

We can trace a pattern: those operations that take a complex data structure (for example, `.toml`
) as input and convert it into a JavaScript object are vulnerable

### Dynamic analysis

Let’s start with dynamic, as it is easier to understand and apply. The algorithm is quite simple and is already implemented in [find-vuln](https://github.com/HoLyVieR/prototype-pollution-nsec18/tree/master/find-vuln):

1. Download the npm package.
2. Call each function in the package, with a pagelode as an argument.
3. Check whether the vulnerability has worked.

The only drawback of [find-vuln.js](https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/find-vuln/find-vuln.js) is that it doesn’t check `constructor.prototype` and therefore misses some of the vulnerabilities, but this gap is easy enough to fix.In general, making small changes to [find-vuln.js](https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/find-vuln/find-vuln.js) even now you can find vulnerabilities in npm packages.

### static analysis

[CodeQL queries](https://github.com/github/codeql/tree/main/javascript/ql/src/Security/CWE-915)

### impact

在NodeJS环境里:

- guaranteed DoS:can overwrite a basic function

### vuln in template engines

In a web application, often you can spin up to remote code execution. Normally, this is done with the template engines. The details of the operation can be found in the articles below.

- [AST Injection, Prototype Pollution to RCE](https://blog.p6.is/AST-Injection/)
- [Real-world JS — 1](https://blog.p6.is/Real-World-JS-1/)
- [Prototype pollution attack in NodeJS application](https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/paper/JavaScript_prototype_pollution_attack_in_NodeJS.pdf)

## Next.js

you need know:

- Amp

escape sandbox

[16:49]

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled 3.png20220526_a.png)

## Mitigation

两种比较常用的方法:

- 字段黑名单(Field black list)
- Json模式(JSON schema)

### Field black list

大部分开发者是添加 `__proto__` 到黑名单(不推荐)

黑名单推荐:

- `constructor.prototype`
  - 优点:能修复大部分问题,但是同时它没有完全解决问题
  - 缺点:仍然存在修改 `Object.prototype` 和其他 `prototype` 问题
- `Object.create(null)`
  - 优点:使用没有prototype的object,这样修改prototype将变得不可能
  - 缺点:对功能性有些损失,例如有人想用 `toString()` 的场景,但会被提示 `o.toString is not a function`
- `Object.freeze()`
  - 优点:使用 `Object.freeze()` 来冻结 `Object.prototype` ,这样,在这之后, `Object.prototype` 不能被修改.
  - 缺点/pitfalls:
    - 修改 `Object.prototype` 的依赖关系可能被中断
    - 通常也需要冻结 `Array.prototype` 和其他object

### JSON schema

验证通过[JSON schema](https://json-schema.org/)预定义的输入数据,并丢弃其他参数

For example, you can do this using the [avj](https://github.com/ajv-validator/ajv) library with the `additionalProperties = false`
 parameter.

## Resource&Reference:

**Video:**

- [https://www.youtube.com/watch?v=XS_UMqQalLI](https://www.youtube.com/watch?v=XS_UMqQalLI)
- [https://www.youtube.com/watch?v=oGeEoaplMWA](https://www.youtube.com/watch?v=oGeEoaplMWA) **DEF CON Safe Mode - Feng Xiao - Discovering Hidden Properties to Attack Node js Ecosystem**

**Ariticle**

- [https://brightsec.com/blog/prototype-pollution/](https://brightsec.com/blog/prototype-pollution/)
- [https://www.leavesongs.com/PENETRATION/javascript-prototype-pollution-attack.html](https://www.leavesongs.com/PENETRATION/javascript-prototype-pollution-attack.html) 推荐 讲的不错
- [https://infosecwriteups.com/javascript-prototype-pollution-practice-of-finding-and-exploitation-f97284333b2](https://infosecwriteups.com/javascript-prototype-pollution-practice-of-finding-and-exploitation-f97284333b2)  这个写的好好

**Book**

- Prototype pollution attack in NodeJS application: [https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/paper/JavaScript_prototype_pollution_attack_in_NodeJS.pdf](https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/paper/JavaScript_prototype_pollution_attack_in_NodeJS.pdf)

**Demo:**

- https://github.com/PwnFunction/Next.js-Flat-Prototype-Pollution

**github:**

- [https://github.com/BlackFan/client-side-prototype-pollution](https://github.com/BlackFan/client-side-prototype-pollution)

