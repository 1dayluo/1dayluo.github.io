---
title: '[刷题]水题-memcache安全相关'
date: 2020-12-17 15:58:59
tags: [刷题]
published: true
hideInList: false
feature: 
isTop: false
---


**写在开头：**

忙里偷闲刷的题，所以中间有重启lab导致ip变更的情况。

## Questions

1. Find the version of memcached server using nmap.
2. Find the version information using netcat or telnet.
3. Find the maximum number of simultaneous incoming connections allowed by the memcached server use available nmap scripts.
4. Find the number of current items on the memcached server using memcstat.
5. Find the value stored in the key 'flag' from the key value pairs dumped by available Metasploit module.
6. Find the name of all keys present on the memcached server using memcdump.
7. Find the value stored in key “first_name” using memcached-tool.
<!-- more -->
Instructions:

- This lab is dedicated to you! No other users are on this network :) 
- Once you start the lab, you will have access to a root terminal of a Kali instance
- Your Kali has an interface with IP address 192.X.Y.Z. Run "ip addr" to know the values of X and Y.
- The Target machine should be located at the IP address 192.X.Y.3. 
- Do not attack the gateway located at IP address 192.X.Y.1 

## Question1&2

根据questions，获得ip

````
root@attackdefense:~# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: ip_vti0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN group default qlen 1000
    link/ipip 0.0.0.0 brd 0.0.0.0
4783: eth0@if4784: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:0a:01:01:04 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 10.1.1.4/24 brd 10.1.1.255 scope global eth0
       valid_lft forever preferred_lft forever
4786: eth1@if4787: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:c0:98:32:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.152.50.2/24 brd 192.152.50.255 scope global eth1
       valid_lft forever preferred_lft forever
````

可知目标ip是192.152.50.3,**nmap**用nmap -sV -p- 192.152.50.3解得version是1.5.1211211/tcp open memcached Memcached 1.5.12 (uptime 613 seconds)看了下nmap的help，也没写-p后的“-”是什么，搜了一下发现也是规范没写到说明里就是了（反正没找到)。如下：

![Image](https://i.loli.net/2020/12/17/zScHNYWEJtuIh9i.png)

**netcat**echo -e "version\r\nquit\r\n" | nc 192.211.230.3 11211VERSION 1.5.12可知端口11211端口开放，扫描该端口echo -e 是用于处理特殊字符

## **Question3**

问题3解决我看了一阵help，然后搜索了一下。这个问题需要了解nmap都有哪些script脚本，nmap的script目录位于/usr/share/nmap/script下（我通过输入一个错误的脚本名称，然后发现路径的=。=当然也可以直接google搜，我是在尝试只靠工具的提示能最大化获取信息到什么程度）

![Image](https://i.loli.net/2020/12/17/AbBCPU1pkJNfXZH.png)

然后去script这个文件夹下搜了一下，果然有对应的脚本。nse好像是lua脚本后缀？

![Image](https://i.loli.net/2020/12/17/cHBvT85dt6o2wuX.png)

![Image](https://i.loli.net/2020/12/17/Zp4EuChfeNmRvG1.png)

![Image](https://i.loli.net/2020/12/17/mbnpEliq5WF4dXK.png)

问题3解决。不知道第三个问题考察的什么emmm工具使用？

## **Question4**

也是一个-h然后找到对应命令的事

![Image](https://i.loli.net/2020/12/17/J598LnXUirhvTM3.png)

但是memcstat是什么呀？好像这个时候又需要补习了，貌似是linux安装完memcache后就带的一个命令。如果没有身份验证的情况下是会泄露这些信息的，但是如果在/etc/memcached.conf配置文件中做了权限认证，正常输出是空的。如图：

![Image](https://i.loli.net/2020/12/17/es28TNzkIbOVmwd.png)

## **Question5**

本来想先show all看一下全部的module，但是我放弃了。直接search一下有没有对应memcache的

![Image](https://i.loli.net/2020/12/17/iwZ7NuYX1I95caM.png)

用工具2 

![Image](https://i.loli.net/2020/12/17/fCpUi1PmjGzOeL2.png)

得出flag： flag    "VALUE flag 0 32\r\n25c8dc1c75c9965dff9afd3c8ced2775\r\nEND\r\n"

![Image](https://i.loli.net/2020/12/17/JEPjifgwvAKORs2.png)

## **Question6-7**

![Image](https://i.loli.net/2020/12/17/ozfq2NtGZDlKgx9.png)

![Image](https://i.loli.net/2020/12/17/cihvoPzqrbKwVn3.png)