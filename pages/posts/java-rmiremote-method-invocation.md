---
title: 'java RMI（Remote Method Invocation）'
date: 2022-04-15 23:38:44
tags: []
published: true
hideInList: false
feature: 
isTop: false
---


笔记来源：

- [https://is4b3lla3.github.io/2020/06/27/Java RMI学习/#远程方法调用](https://is4b3lla3.github.io/2020/06/27/Java%20RMI%E5%AD%A6%E4%B9%A0/#%E8%BF%9C%E7%A8%8B%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8)

文章中jndi的部分就不做笔记了，打算改天单独学习一下。

## 基础

### 基础概念

1. Java RMI（java Remote Method invocation)： 实现远程过程调用的应用程序编程接口，可远程调用服务器上的对象
2. RMI：允许在一个java虚拟机的对象，调用 运行在另一个java虚拟机上的对象。两个虚拟机可以是：
    1. 相同计算机不同进程
    2. 网络上不同计算机
    
3. RMI传输对象是通过序列化方式进行编码传输的（可能存在反序列化漏洞)
4. RMI的基础是接口，RMI定义接口和具体实现是分开的

### RMI包含部分（？

RMI能远程调用方法，包含：

1. 远程服务的接口定义
2. 远程服务接口的具体实现
3. 存根（Stub）和骨架（Skeleton）文件
4. 一个允许远程服务的服务器
5. 一个RMI命名服务，它允许客户端去发现这个远程服务
6. 类文件的提供者（一个HTTP或FTP服务器）
7. 一个需要这个远程服务的客户端程序

### RMI注册表

JDK提供了一个RMI注册表（RMIRegistry，是一个远程对象），默认监听 `1099` 端口。

其中，

服务端：向RMI注册表中注册远程对象

客户端：向RMI注册表查询某个远程对象的名称，来获取远程对象的 `Stub`

**启动方式：**

- 使用代码启动RMIRegistry
- 使用 `rmiregisry` 命令

**如何注册远程对象？**

需要RMI URIL 和 远程对象的引用

### `Stub` 和 `Skeleton` 的定义

确保已知RMI注册表的概念，实现 `Stub` 和 `Skeleton` 的前提是远程对象必须实现 `java.rmi.server.UniCastRemoteObject` 类

**基础概念**

`stub` 的概念： 远程对象把自身的拷贝以Socket的形式传给客户端，这个拷贝成为 `stub` （存根），可以用于服务端通信

`Skeleton` 的概念：服务端本身已存在的远程对象。可以用于接受客户端请求，并调用远程方法相应客户端的请求。

 **`stub` 的获取**

客户端向RMI注册表查询某个远程对象名称，从而获取远程对象的 `stub` 

**相关的通讯：**

如图，个人理解为：stub在客户端，skeleton在服务端，然后与另一端通讯时必须要通过stub/skeleton，相当于代理的作用。

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled20220415.png)

### RMI通讯协议

通信协议为RMP(java Remote Message Protocol），协议要求客户端，服务端都用java编写，在RMI中通过**序列化方式**进行编码传输

总结一下 

远程服务器：

- 代码实现：
    - 实现具体java方法
    - 提供接口
- RMI注册表：
    - 向RMI注册表中注册远程对象

客户端：

- 代码实现：
    - 根据接口定义，提供相应参数
- RMI注册表：
    - 向RMI注册表查询对象名称，获取对象 `Stub`

## 构造一个java RMI 之 服务端

这里的示例为RMI直接绑定远程对象，除此之外还可以用RMI通过 `References` 绑定一个外部的远程对象（当前名称目录系统之外的对象）

客户端lookup() 查找远程对象时，客户端会获取 `object` `factory` 。jndi+rmi就是外部实体调远程对象

### 定义接口&接口实现 : 服务端

Step 1：**定义远程接口**

服务端，自定义一个远程接口 `clock.java`

```java
import java.rmi.Remote
import java.rmi.RemoteException

public interface Clock extends Remote{
	String Hello() throws RemoteException;
}
```

在这里，我们：

- 定义远程服务接口（interface)
- 远程接口把必须继承 `Remote`
- 远程方法必须抛出  `RemoteException`

Step 2：**远程接口的实现**

远程对象必须直接或间接实现服务端接口，示例代码如下：

```java
import java.rmi.RemoteException

public class ClockImpl implements Clock {
	@overide
	public String Hello() throws RemmoteException {
		return "Hello RMI";
	}
	//无参构造方法
	public ClockImpl() throws RemoteException {}
}
```

### RMI注册表的构造 ： 服务端

**Step1： 使用** `RMIRegistry` 向远程服务获取stub

 

使用 `LocateRegistry.getRegistry()` 给指定的主机和端口本地创建一个 `Stub` 对象作为 `Registry`远程对象的代理。

```java
Clock impl = new ClockTmpl();
LocateRegistry.createRegistry(1099); //服务端监听端口
Registry registry = LocateRegistry.getRegistry(); //服务端远程通信端口
registry.bind("Clock",stub);

```

**Step 2：继承/构造方法中调用 `UnicastRemoteObject` 类**

`UnicastRemoteObject` 类主要用于系统动态生成stub和skeleton代理，如果没有继承 `UnicastRemoteObject` ，可在构造方法中继承：

 

```java
public ClockImpl() throws RemoteException{
    UnicastRemoteObject.exportObject(this, 1099);
    }
```

使用new触发构造方法，其中红框圈住的为Step1部分的代码

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled 120220415.png)

**Step3：** 启动远程服务所在jvm线程

## 构造一个java RMI 之 客户端

客户端代码如下；

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled 220220415.png)

对于客户端而言，服务端返回值也可能是一些子类的对象实例，而客户端并没有这些子类的class文件

## JNDI & RMI

JNDI( Java Naming and Directory Interface) 应用程序接口，用于为开发查找各和访问各种资源提供了统一的通用接口。可以用来定位网络中的物理设备。**JNDI底层支持RMI（**可以将RMI URL作为参数传入）