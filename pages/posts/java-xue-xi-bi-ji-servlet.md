---
title: 'Java学习笔记: Servlet'
date: 2023-06-08 20:05:34
tags: [java,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---


重新捡起java诶~

## 基础概念

### J2EE & JAVA EE & jakarta EE

在此之前要知道 ：

> Ever heard of Java EE? How about Java 2EE, J2EE, or now Jakarta EE? Actually, **these are all different names for the same thing: a set of enterprise specifications that extend Java SE.**
> 

就是说上面的都是指的同一个存在，用于提供一系列的规范，（规范包括JDBC、JNDI、EJB、RMI、Servlet、JSP、XML、JMS、Java IDL、JTS、JTA、JavaMail和JAF  ）。而这个演变历史是2EE -> Java EE  -> Jakarta EE ，这里面后两者是因为Oracle把JavaEE移交给开源组织Eclipse，并且没有运行Eclipse继续沿用Java这一词。我在学习这里的时候，默认用的是最新的规范，即jakarta EE。

### Servlet作用

- 读取客户端/浏览器数据发送的显式数据,包括HTML表单,或来自applet或自定义HTTP客户端程序的表单
- 读取客户端/浏览器数据发送的隐式数据,例如cookies, 媒体类型和浏览器能理解的压缩格式
- 处理数据并生成结果。这个过程可能需要访问数据库，执行 RMI 或 CORBA 调用，调用 Web 服务，或者直接计算得出对应的响应。
- 发生显示数据到客户端
- 发送隐式数据到客户端

### Servlet基本实现

JDK中实现了常见的Servlet功能. 即 `GenericServlet` , 对于HTTP请求, 又进一步请求了 `HttpServlet` 抽象类. 

创建Servlet需要:

1. java代码, 继承Servlet下的各种抽象类,例如 `HttpServlet`
    - `HttpServlet` 例子:
        
        ```java
        import java.io.*;
        import javax.servlet.http.*;
        import javax.servlet.annotation.*;
        
        @WebServlet(name = "helloServlet", value = "/hello")
        public class HelloServlet extends HttpServlet {
            private String message;
        
            public void init() {
                message = "Hello World!";
            }
        
            public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
                response.setContentType("text/html");
        
                // Hello
                PrintWriter out = response.getWriter();
                out.println("<html><body>");
                out.println("<h1>" + message + "</h1>");
                out.println("</body></html>");
            }
        
            public void destroy() {
            }
        }
        ```
        
2. 修改 `web.xml` 配置文件 / 或者用 `WebServlet` 注解方式配置servlet
    - 注解方式(Servlet 3.0之后):
        
        ```java
        @WebServlet(name = "helloServlet", value = "/hello")
        public class HelloServlet extends HttpServlet {
        ...
        }
        ```
        
    - web.xml文件
        
        在 /WEB-INF 的目录下, 这个目录下文件是不显示在部署后的网站里的(是否对用户隐藏)
        

### 不同Build System之间的区别

当创建一个New Project的时候可以看到，除了IDEA内置的intelliJ外还有Maven和Gradle

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_0.png)

区别是intelliJ不支持创建工件、部署到存储库、从wsdl生成代码…而maven和Gradle支持build自动化构建

maven `pom.xml`定义生命周期目标

gradle `build.gradle`定义任务。

## Hello Servlet

### HTTP路径映射到Servlet

> 正常情况下定义好 HelloServlet 类之后，容器并不知道这个类的存在，也不知道应该将什么 HTTP 路径映射到这个 Servlet，传统上需要用户自己修改 `web.xml` 配置文件(这也是 Servlet 标准的一部分)，添加 `<servlet>` 和 `<servlet-mapping>` 标签来指定这些信息。在 Servlet 3.0 之后，就可以使用注解的方式配置 Servlet 了，如上面的 `WebServlet` 注解。
> 

下面的实战都是用的Servlet3.0 以后的版本

### Filter

Servlet另一个很重要的概念是 `Filter` ，继承类  `jakarta.servlet.Filter`（或javax  ） 作用如下

1. 过滤脏敏感字符（绿一些敏感的字符串）；
2. 避免中文乱码（统一设置请求和响应的编码）；
3. 权限验证（规定只有带指定Session或Cookie的请求，才能访问资源）；
4. 用于实现自动登录；

过滤顺序如下

> 过滤器链的完整流程顺序是这样的：**客户端发送http请求到Web服务器上，Web服务器对该请求URL找到对应负责的过滤器形成过滤器链，接着从第一个过滤器开始进行过滤操作，也就是调用Filter.doFilter方法，这个方法的逻辑是开发者编写的，当当前请求满足当前过滤器的要求或者是过滤操作完毕之后，应在调用chain.doFilter方法进行放行，该方法又会调用链中的下一个过滤器的doFilter方法继续过滤，如果当前过滤器是过滤器链的最后一个过滤器，那么chain.doFilter方法将会执行资源访问操作，访问完毕之后，将会依照最开始过滤器的调用顺序倒序的返回，接着执行chain.doFilter方法后面的代码。最终将响应结果交给Web服务器，Web服务器再将响应返回给客户端。**
> 

关于更多的Filter代码示例，包括多个Filter的执行顺序可以看掘金的文章：[https://juejin.cn/post/7000950677409103880#heading-5](https://juejin.cn/post/7000950677409103880#heading-5)

### 实战1:  创建一个servlet项目

- IDEA创建一个servlet项目的步骤 - New Project
    1. New project 
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_1.png)
    
    1. 项目名称旁右键，选择Add Framework support
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_2.png)
    
    1. 选择web application
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_3.png)
    
- IDEA配置tomcat
    1. 选择Edit Configuration
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_4.png)
    
    1. 选择tomcat
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_5.png)
    
- tomcat部署网站
    
    需要设置这个deployment
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_6.png)
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_7.png)
    
- tomcat修改application主目录名
    
    改这里Application context。
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_8.png)
    

其他

- IDEA tomcat日志出现乱码
    
    参考 [https://juejin.cn/post/7212864793651396669](https://juejin.cn/post/7212864793651396669)
    
    以上方法我都试过了仍没有得到最完美的解决，最后还有一种办法是在IDEA编辑器内，点击Help->Edit Custom VM Options... ，在最下方添加-Dfile.encoding=UTF-8，然后重启IDEA，运行Tomcat查看输出 
    

### 实战2： 创建路由

- ./src 下创建一个new package，然后New一个Servlet
    
    如果没有的话，则需要[创建servlet模板](https://www.jetbrains.com/help/idea/creating-and-configuring-web-application-elements.html#createElement)（tomcat 10里api接口名变动，需要把 `javax`改为 `jakarta` 
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_9.png)
    
- 导入servlet的jar文件
    
    直接创建会报错，如图
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_10.png)
    
    1. 类名需要导入jar文件（如下图）,右键package -> Open module setting，这样导入后在类名上按 `Ctrl-q`就会有对应提示(有document的话) ，，然后在modules的依赖里勾选， 这里（选provide，因为不需要部署在服务器上
    
    > As somebody mentioned it above - these libraries are part of an application server so they should not be deployed to the server as other libraries like Spring and so on.
    > 
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_11.png)
    
- `.java` 代码编写：urlpatterns概念
    1. 模板如下， 新增urlPatterns的参数传入， 然后需要配置tomcat （如果之前将Application context配置了的话，取消为空）
    
    ```java
    package servlets;
    
    import jakarta.servlet.*;
    import jakarta.servlet.http.*;
    import jakarta.servlet.annotation.*;
    import java.io.IOException;
    //doc:https://jakarta.ee/specifications/servlet/4.0/apidocs/
    @WebServlet(name = "HelloWorld", urlPatterns = "/hello")
    public class HelloWorld extends HttpServlet {
        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            System.out.println("the GET request ");
        }
    
        @Override
        protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            System.out.println("the POST request");
        }
    }
    ```
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_12.png)
    
    1. 访问 `/hello`  地址
    
    可以看到后台输出
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_13.png)
    
- 编写响应内容 ( `text/plain`）
    
    代码如下 (这里必须通过getWriter返回的 `PrintWriter` 对象来向response里写入内容 
    
    ```java
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            System.out.println("the GET request ");
            response.setContentType("text/plain");
            response.getWriter().println("Here is a line");
            response.getWriter().println("Here is another line");
        }
    ```
    

注意 ： Servlet并不是线程安全的

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_14.png)

其他

jakarta对应的document  [https://jakarta.ee/specifications/servlet/4.0/apidocs/](https://jakarta.ee/specifications/servlet/4.0/apidocs/)

### 实战3 : 选jakarata  EE的方式部署servlet

- New Project，新建一个项目，并选择jakarta EE
    
    注意Template选Web application 更多部署请看官方[文档](https://www.jetbrains.com/help/idea/creating-and-running-your-first-restful-web-service.html#source_code)
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_15.png)
    
- 修改当前的java版本
    
    `Ctrl-Alt-Shift-S`  下在project里查看当前java版本，，然后把 pom.xml改为对应的
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_16.png)
    
- 添加jakarta支持到Modules内
    
    `Ctrl  + Alt + Shift + S` 选择Modules
    
    然后选择Dependencies的tab，将tomcat 相关作为provided加入
    
- 配置
    
    在下方出现的Fix里点击对应的打包文件 （如果没有打包，对 `pom.xml`右键选择 Module xxx 就可以了 ，人工的方式，一般应该不用）
    
    ![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_6/20230608_17.png)
    

### 一些servlet的项目结构

会遇到这样的项目结构:

- dao:
    - `DAO(Data Access Object)`  就是把访问数据库的代码封装起来, 作为一个模型类. DAO在数据库与业务逻辑(service) 之间
- entity
    - 实体层, 继承实体类.放实体及其对应的 `set()` , `get()` 方法. 对数据库进行操作,要先写entity层
- service
    - 业务逻辑层. 处理逻辑上的业务,不去考虑具体的实现. 这里使用接口, 因为接口是多继承, 类是单继承.
- servlet
    - 编写服务端程序,
- util
    - 多功能,基于工具的包.例如 字符串处理, 日期处理等. 是与业务无关的可以独立出来的内容

## JSP

刚刚的实战例子里看到，会自动创建目录结构和一些必备文件，其中就包括 `index.jsp` 

有开发经验的大概了解过模板引擎（不管是nodejs的express还是python的flask，etc…. 开发都会用到 ），看下官方文档怎么说的吧：

> **JavaServer Pages (JSP) allows *dynamic* content injection into *static* contents using Java and Java Servlets**.
> 

jsp 通过java以及java Servlet，从而允许将动态内容注入到静态内容中。官方文档见[这里](https://www.baeldung.com/jsp) . JSP会被Servlet编译为对应的Servlet可执行的java代码.

最基础的和express下模板引擎ejs的语法差不多，除此之外需要注意的jsp语法有:

- `<%@ directive attribute="value" %>`
- `<jsp:action_name attribute="value" />`

## JDBC  | JMX

### JDBC (Java Database Connectivity)

> JDBC (Java Database Connectivity) 就是 Java 访问数据库的一个标准。历史上在 JDK 1.1 中 JDBC 就已经是其中的一部分，也就是说 JDBC 本身也是 Java SE 的标准，但也包含在 Java EE 中。其包名可通过 `java.sql` 或者 `javax.sql` 进行访问。
> 

jdbc 使用API示例 :

```java
import java.sql.*;

 public class TestJdbc {
   public static void main(String[] args) throws Exception {
     // Class.forName("com.mysql.jdbc.Driver");

     // 1. Establishing the connection with the database
     Connection conn = DriverManager.getConnection(
       "jdbc:mysql://localhost:3306/mydb?useSSL=false", "root", "rxhtemp");

     // 2. Creating a statement object to execute a query
     Statement stmt = conn.createStatement();

     // 3. Executing the query and getting the ResultSet
     ResultSet rs = stmt.executeQuery("SELECT * FROM user");

     // 4. Processing the ResultSet
     while (rs.next()) 
       int id = rs.getInt("id");
       String name = rs.getString("name");
       System.out.println("ID: " + id + ", Name: " + name);
     }

     // 5. Closing the database resources
     rs.close();
     stmt.close();
     conn.close();
   }
 }
```

### JMX

全称为 Java Management Extensions，即 Java 管理拓展，主要用于管理和监控 Java 程序。常见的监控资源有 CPU 占用率、线程数、JVM 内存等

我们常用的 JConsole、VisualVM，以及现在流行的 Spring Boot 框架中的 Spring Boot Actuator 内部都使用了 JMX 拓展

JMX的关键组件:

- MBean: Managed Bean, 用于消息的传递.在 `java.lang.management` 中定义了许多 JDK 提供的 MBean
- MBeanServer: 用于 MBean 的管理，同名接口定义在 `javax.management` 中
- Connector : 面向客户端的组件, 负责具体协议的连接和转换.RMI Connector就是JMX标准实现的协议
- Adaptor : 称为适配器，和连接器类似，主要将客户端对服务器中 MBean 的操作适配为其他协议，比如 SNMP 或者 HTTP 等。

## Reference

- [https://evilpan.com/2023/04/01/java-ee/](https://evilpan.com/2023/04/01/java-ee/)
- [https://www.youtube.com/watch?v=UiBtz7rZ6Ec&list=TLPQMzEwNTIwMjM7GmfPJ2mZbg](https://www.youtube.com/watch?v=UiBtz7rZ6Ec&list=TLPQMzEwNTIwMjM7GmfPJ2mZbg&index=2)
- [https://www.jetbrains.com/help/idea/creating-and-running-your-first-java-ee-application.html#source_code](https://www.jetbrains.com/help/idea/creating-and-running-your-first-restful-web-service.html#new_project)
- [https://juejin.cn/post/7000950677409103880](https://juejin.cn/post/7000950677409103880)