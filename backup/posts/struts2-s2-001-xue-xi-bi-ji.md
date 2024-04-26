---
title: 'Struts2 s2-001 学习笔记'
date: 2022-04-09 17:16:44
tags: [笔记,java漏洞]
published: true
hideInList: false
feature: 
isTop: false
---
# Struts2 s2-001 学习笔记

notion阅读版:https://cubic-brace-c93.notion.site/Struts2-s2-001-1629a6906fba4d7f96659221cff4481a

希望我的学习经验能对和我一样想入门的java小白起到帮助~

## 部署&调试

<aside>
💡 需要提前配好IDEA下载jar依赖：File -> Setting ->Maven ->Importing：选中Automatically download中的两个多选框Sources和Documentation


</aside>

❗备注：前两种remote及docker部署方式有坑，尚未解决

### 部署漏洞环境

我使用vulhub，到struts2目录下 `docker-compose up -d` 

调试我使用的IDEA，第一次使用这个工具，不是很熟悉。做了一些笔记。

### 普通远程调试

**直接configuration创建remote**

远程调试的条件:

1. 本地需要拥有代码文件（注意lib下的jar文件需要导入）
2. 远程java版本与project Structure内的java版本保持一致
3. 修改java程序启动命令，增加调试支持

如果是docker内部的还需要：

1. 开放调试端口
2. docker中拖出的class或jar添加为库（？
3. 查看启动命令：进入docker容器，使用 `ps` 等找到java程序启动方法。或者使用 `docker-compose up -d` 后使用 `docker ps --no-trunc` 查看默认启动命令
4. 修改启动对应docker配置

这个子标题下我的参考/笔记：

> 一篇不错的博文
> [https://ares-x.com/2020/04/20/IDEA远程调试Docker中程序的方法/](https://ares-x.com/2020/04/20/IDEA%E8%BF%9C%E7%A8%8B%E8%B0%83%E8%AF%95Docker%E4%B8%AD%E7%A8%8B%E5%BA%8F%E7%9A%84%E6%96%B9%E6%B3%95/)

### 补充关于：Docker镜像调试

**直接configuration创建docker**

<aside>
💡 **JAVA_TOOL_OPTIONS**:For Java versions prior to 8 the variable was called **JAVA_OPTS**


</aside>

也可以直接IDEA连docker镜像调试（需要本地有代码+dockerfile）

- 开放远程调试端口
- 配置：docker文件设置允许JWDP（*Java Debug Wire Protocol*
  ）的选项,eg: `ENV JAVA_TOOL_OPTIONS -agentlib:jdwp=transport=dt_socket,address=8000,server=y,suspend=n`

以下是我的参考/笔记

> 一份官方文档：[https://www.jetbrains.com/help/idea/docker.html#interacting-with-containers](https://www.jetbrains.com/help/idea/docker.html#interacting-with-containers)
> 一篇不错的博文：
> [https://medium.com/swlh/remote-debugging-a-java-application-running-in-docker-container-with-intellij-idea-efe54cd77f02](https://medium.com/swlh/remote-debugging-a-java-application-running-in-docker-container-with-intellij-idea-efe54cd77f02)



### 本地调试

需要在本地安装tomcat，然后configuration添加tomcat，选择tomcat server

要注意的一些配置：

- java version：1.8
- IDEA需要提前配置好Tomcat和Maven环境
- Configuration选择自己本地的tomcat路径
- tld文件如果没有被识别出来，需要配置tomcat下的 `[catalin.properties](http://catalin.properties)` (文章点击[这里](https://blog.nowcoder.net/n/0f9f61f7a722490d9ac157adca1803d2)）如果没有生效(看[这篇](https://blog.chiyu.monster/?p=83)文章），需要解压缩文件并配置web.xml

步骤/踩的坑：
```
1. File -> Project Structure 设置 Project SDK
2. Modules → Import Module 把目录以Maven Module来添加
3. Modules → 选择刚创建的Module，新建 `Framework` 下的web
4. configuration tomcat → Deployment → 添加Artifacts
```
虽然踩了坑 但是最后终于解决了🥲 debug好耶

参考：

> [https://cloud.tencent.com/developer/article/1598043](https://cloud.tencent.com/developer/article/1598043)
> 这个相对全而且是针对Struts2的
> [https://kingx.me/Struts2-S2-052.html](https://kingx.me/Struts2-S2-052.html) 
> 如果环境有问题看这篇文章参考细节：
> [https://www.jianshu.com/p/a787a3689d68](https://www.jianshu.com/p/a787a3689d68)

## 小白学基础

### 基础：关于目录

- javaweb下WEB-INF目录：是javaweb的安全目录（只有服务端能够访问）
  - WEB-INF/classes：源代码位置
  - WEB-INF/lib: 存放需要的jar文件，例如数据库驱动
  - META-INF：在用jar打包时自动生成

### 基础：tld

学习大纲

1. 什么是tld文件
2. tld文件结构，以及<tag-class>，<short-name>
3. tld文件在jsp文件中的对应，uri，自定义标签（short-name)
4. 针对<tag-class>，对应的标签处理类： `TagSupport` , `BodyTagSupport` 
5. 继承 `TagSupport` 或 `BodyTagSupport` 后要重写的方法
   1. `TagSupport` : *doStartTag*,处理**头标签**，返回int （可以在这里构造将要输出到页面的代码）
      1. 为 `EVAL_BODY_INCLUDE` （1） 时：正常加载标签的body
      2. 为 `SKIP_BODY` (0) 时： 不会加载标签，返回后执行 `doEndTag()` 方法
      3. 为 `EVAL_BODY_BUFFERED` （2）时：尽在处理类继承了 `BodyTagSupport` 时可以使用，返回后java构造 `BodyContent` 对象，把标签的body载入这个对象
   2. `TagSupport` : *doEndTag*,处理**尾标签**，返回int（也可以在这里构造将要输出到页面的代码）
      1. 为 `EVAL_PAGE`  (6) ,返回表示加载此标签之后的页面代码
      2. 为 `SPKIP_PAGE` (5),返回表示不再继续加载此标签之后的页面代码，直接将已处理完发送客户端
   3. `TagSupport` : *doAfterTag*,返回int （ `doStartTag` 返回 `EVAL_BODY_INCLUDE` && 加载完标签的body 后加载）
      1. 为 `EVAL_BODY_AGAIN` (5) 再一次加载body之后会执行
      2. 为 `SKIP_BODY` 同 *doStartTag*
   4. `BodyTagSupport` : doInitBody,没有代码,没有返回值
6. **是否能修改body是 `BodyTagSupport` 和 `TagSupport` 最大的区别**
7. 使用自定义标签

关于tld下处理tag-class类下方法的调用顺序的图例:

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_00.png)

参考学习的文章：

> 《****使用 tld 文件自定义 jsp 标签库_lkforce****》
> [https://blog.csdn.net/lkforce/article/details/85003068](https://blog.csdn.net/lkforce/article/details/85003068)

### 基础：使用maven进行依赖管理

- 先配置IDEA使用maven自动下载依赖：
  - `File -> Setting ->Maven ->Importing`：选中 `Automatically download`中的两个多选框Sources和Documentation
- 使用快捷键（ctrl+alt+shift+u）可以一览整个项目的依赖

### 基础：调试Tips

查找方法：

使用 `ctrl+F12` 就可以在当前类中查找方法啦~~

### 基础:关于Struts2的altSyntax特性

<aside>
💡 `altSyntax` 特性是默认开启的


</aside>

什么是 `altSyntax` 特性？

允许表单中提交包含OGNL表达式的字符串（通常通过文本字段传达，例如 `<s:textfile>` ），且可对包含OGNL的表达式进行递归计算

`altSyntax` 在哪里配置？

该属性设置在struts2文件的 `defaultproperties` 中

## Struts2 分析实战

<aside>
💡 需要使用IDEA在要调试的jar包右键选择”Add as Library“


</aside>

jsp文件

```jsx
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>S2-001</title>
</head>
<body>
<h2>S2-001 Demo</h2>
<p>link: <a href="https://struts.apache.org/docs/s2-001.html">https://struts.apache.org/docs/s2-001.html</a></p>

<s:form action="login">
	<s:textfield name="username" label="username" />
	<s:textfield name="password" label="password" />
	<s:submit></s:submit>
</s:form>
</body>
</html>
```

使用了自定义标签textfield，可以看到对应的标签是 `textfield` ，查看对应的tld文件下垓标签

对应的tld文件位于 `WEB-INF/lib/struts2-core-2.0.8.jar/META-INF/struts-tags/tld`  下：

```jsx
<name>textfield</name>
<tag-class>org.apache.struts2.views.jsp.ui.TextFieldTag</tag-class>
<body-content>JSP</body-content>
<description><![CDATA[Render an HTML input field of type text]]></description>
```

对应 `label` 参数的地方：

```jsx
<attribute>
      <name>label</name>
      <required>false</required>
      <rtexprvalue>true</rtexprvalue>
      <description><![CDATA[Label expression used for rendering a element specific label]]></description>
</attribute>
```

看tag-class标签，知道对应的标签处理类为 `org.apache.struts2.views.jsp.ui.TextFieldTag` 。

这里S2-001 产生问题的主要原因在于body后的处理类中，即 `doEndTag` .第一次学习s2，为了知识点全面，所以阅读了多篇文章，以细为主。看漏洞产生的原因可以直接调h3:”body后处理类“

### body前处理类

针对之前tld章节的学习和调用顺序的学习（[点此](https://www.notion.so/Struts2-s2-001-1629a6906fba4d7f96659221cff4481a)），会在body前执行 `doStartTag` 方法，但 `TextFieldTag` 没有此方法，查看调用链

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_01.png)

最后调用的点是：

`org.apache.struts2.views.jsp.ComponentTagSupport#doStartTag`

❗备注：这里也可以使用 `ctrl+F12` 来进行搜索 `doStartTag`  和`doEndTag`

查看对应的代码：

```jsx
public int doStartTag() throws JspException {
        this.component = this.getBean(this.getStack(), (HttpServletRequest)this.pageContext.getRequest(), (HttpServletResponse)this.pageContext.getResponse()); //这里的component对象实际上是TextField对象
        Container container = Dispatcher.getInstance().getContainer();
        container.inject(this.component);
        this.populateParams(); #用于初始化属性
        boolean evalBody = this.component.start(this.pageContext.getOut());
        if (evalBody) {
            return this.component.usesBody() ? 2 : 1;
        } else {
            return 0;
        }
    }
```

其中由于TextField对象没有实现该方法，而调用默认方法（ `org.apache.struts2.components.Component` )为下图红框圈住的地方

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_02.png)

其中，中间的 `populateParams` 用于初始化属性(这里定义了doEndStart的 `value` ）

最后默认方法 `this.component.useBody()` 返回的是 `false` ，所以 `doStartTag` 返回的是1，对应的常量为 `EVAL_BODY_INCLUDE` 

### body后处理类

<aside>
💡 breakpoints来进行断点管理，目的是为了给一些中断加条件前提。快捷键 ctrl+shift+F8


</aside>

如图 `TextFieldTag` 没有实现 `doEndTag` 的方法，所以还是调用的默认方法。

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_03.png)

对应的默认方法代码如下：

```jsx
public int doEndTag() throws JspException {
        this.component.end(this.pageContext.getOut(), this.getBody());
        this.component = null;
        return 6;
    }
```

跟进 `this.component.end`  

备注：IDEA这里调试模式下用 `F7` 跟进， 不然非调试模式下按 `ctrl` 没法跟进到对应类下的 `end` 方法

其中，解析 `%{name}` 表达式的函数是 `protected Object findValue(String expr, Class toType)`

```jsx
if (this.altSyntax() && toType == String.class) { // 满足条件1 ，进入if语句
            return TextParseUtil.translateVariables('%', expr, this.stack);
        } else {
            if (this.altSyntax() && expr.startsWith("%{") && expr.endsWith("}")) {
                expr = expr.substring(2, expr.length() - 1);
            }

            return this.getStack().findValue(expr, toType);
        }
    }
altSyntax方法
```

其中 `this.altSyntax` 反映了struts2下名为`altSyntax`的特性，该特性允许在表单中提交OGNL表达式的字符串（点击[这里](https://www.notion.so/Struts2-s2-001-1629a6906fba4d7f96659221cff4481a)查看有关基础）

跟进 `findValue` 下的 `TextParseUtil.translateVariables`

（s2-001 问题核心在 `translateVariables` 中）

```jsx
while(true) {
            int start = expression.indexOf(open + "{");
            int length = expression.length();
            int x = start + 2;
            int count = 1;

            while(start != -1 && x < length && count != 0) {
                char c = expression.charAt(x++);
                if (c == '{') {
                    ++count;
                } else if (c == '}') {
                    --count;
                }
            }

            int end = x - 1; //end 为}前的位置
            if (start == -1 || end == -1 || count != 0) {
                return XWorkConverter.getInstance().convertValue(stack.getContext(), result, asType);
            }

            String var = expression.substring(start + 2, end); // var这里为{ 和 } 之间的内容
            Object o = stack.findValue(var, asType);  // 这里要跟进
            if (evaluator != null) {
                o = evaluator.evaluate(o);
            }

            String left = expression.substring(0, start);
            String right = expression.substring(end + 1);
            if (o != null) {
                if (TextUtils.stringSet(left)) {
                    result = left + o;
                } else {
                    result = o;
                }

                if (TextUtils.stringSet(right)) {
                    result = result + right;
                }

                expression = left + o + right;
            } else {
                result = left + right;
                expression = left + right;
            }
        }
    }
```

如上代码所示（关键部分已加备注），我们再接着跟进 `doEndTag` → `end` → `translateVariables`  → `findValue`

findValue的代码

```jsx
com.opensymphony.xwork2.util.OgnlValueStack#findValue
public Object findValue(String expr, Class asType) {
        Object var4;
        try {
            Object value;
            if (expr != null) {
                if (this.overrides != null && this.overrides.containsKey(expr)) {
                    expr = (String)this.overrides.get(expr);
                }

                value = OgnlUtil.getValue(expr, this.context, this.root, asType); //获取value
                if (value != null) {
                    var4 = value;
                    return var4;
                }

                var4 = this.findInContext(expr);
                return var4;
            }

            value = null;
            return value;
        } catch (OgnlException var9) {
            var4 = this.findInContext(expr);
        } catch (Exception var10) {
            this.logLookupFailure(expr, var10);
            var4 = this.findInContext(expr);
            return var4;
        } finally {
            OgnlContextState.clear(this.context);
        }

        return var4;
    }
```

其中传入 `findValue` 的：

- 参数1 为`var` ，变量值为 `%{exp}` 内的表达式
- 参数2为 `asType` , 值为 `String.class`

关键在于代码中 `Ogn1Util.getValue(expr, this.context, this.root, asType)`

跟进  `doEndTag` → `end` → `translateVariables`  → `findValue` → `getValue` 

```jsx
com.opensymphony.xwork2.util.OgnlUtil#getValue
public static Object getValue(String name, Map context, Object root, Class resultType) throws OgnlException {
        return Ognl.getValue(compile(name), context, root, resultType); // expr编译为一个AST Tree
    }

ognl.Ognl#getValue
public static Object getValue(Object tree, Map context, Object root, Class resultType) throws OgnlException {
        OgnlContext ognlContext = (OgnlContext)addDefaultContext(root, context);
        Object result = ((Node)tree).getValue(ognlContext, root);//调用了AST Tree的方法
        if (resultType != null) {
            result = getTypeConverter(context).convertValue(context, root, (Member)null, (String)null, result, resultType);
        }

        return result;
    }
```

这里会把expr编译为一个AST Tree，且在 `Object result = ((Node)tree).getValue(ognlContext, root);` 这行中调用了AST Tree的 `getValue` 方法，并传入了ognl表达式

### 参考&补充

参考及补充：

> 分析的知识学习的这位师傅的文章《安全客的Struts2 s2-001的分析》
> [https://www.anquanke.com/post/id/254808#h2-2](https://www.anquanke.com/post/id/254808#h2-2)
> Apache Struts 2 Wiki(solution):
> [https://cwiki.apache.org/confluence/display/WW/S2-001](https://cwiki.apache.org/confluence/display/WW/S2-001)
> 第二遍阅读学习时计划参考的文章：
> [https://blog.csdn.net/mole_exp/article/details/122550317](https://blog.csdn.net/mole_exp/article/details/122550317)

## 调试实战下的一些其他笔记

### 使用行断点

在 `evaluateParams` 下总是不小心错过调试点，于是我在 `expr` 这里使用 breakpoints 增加了行断点，并只捕获 `username` 下的截断。

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_04.png)

### 关于translateVariables下踩的坑

还有这里，必须要 `force step into` （alt+shift+F7），只是 `step into` 是进不去的

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_05.png)

### AST Tree处（getValue)处的分析

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_06.png)

在 `ognl.Ognl.getValue` 下看到tree被初始化为

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220409a_07.png)

这里result会被赋值为计算后的值

参考

> 调试教程推荐：
> [https://www.aneasystone.com/archives/2017/09/java-debugging.html](https://www.aneasystone.com/archives/2017/09/java-debugging.html)

## 其它Reference

- [https://seaii-blog.com/index.php/2019/12/29/90.html](https://seaii-blog.com/index.php/2019/12/29/90.html) (Struts2漏洞调试笔记)
- 安全客关于OGNL的学习： [https://www.anquanke.com/post/id/254808](https://www.anquanke.com/post/id/254808)
- 先知下关于OGNL的学习：[https://xz.aliyun.com/t/10482](https://xz.aliyun.com/t/10482)

[https://pentester.land/list-of-bug-bounty-writeups.html](https://pentester.land/list-of-bug-bounty-writeups.html)