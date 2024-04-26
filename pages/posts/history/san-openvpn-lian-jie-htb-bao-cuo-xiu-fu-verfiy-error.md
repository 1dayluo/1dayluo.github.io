---
title: '氵：openvpn连接htb报错修复：verfiy error'
date: 2023-01-20 17:05:37
tags: []
published: true
hideInList: false
feature: 
isTop: false
---

~~非常的氵~~
之前链接一直很成功，在一次pacman -Syu的滚动更新后，发现链接htb的时候一直在报错：
```
VERIFY ERROR: depth=0, error=CA signature digest algorithm too weak: C=UK, ST=City, L=London, O=HackTheBox, CN=htb, name=htb, emailAddress=info@hackthebox.eu, serial=1
```
经过一番探索，发现是需要修改openvpn的配置文件，加一行
```
tls-cipher DEFAULT:@SECLEVEL=0
```
但是如果你像我一样在这里解决了verify error的问题后，又出现了ERROR: Cannot open TUN/TAP dev /dev/net/tun的话，并且同样是arch linux。我在arch的官方论坛里找到了解决方法：重启

没错。。。。就是重启。非常的坑。没有细细探索原因是什么，如果有哪位大佬知道什么导致的欢迎留言。
