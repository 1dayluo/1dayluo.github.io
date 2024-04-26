---
title: 'Linux篇:配置你的aria2 - (网盘下载 代替迅雷)'
date: 2022-06-06 11:01:08
tags: [aria2]
published: true
hideInList: false
feature: 
isTop: false
---
无聊水篇oao 
昨天用windows配了下aria2下载某度云盘是真的香...打算给自己的arch linux也配一套下载, windows网上有傻瓜包就不复述了.这里讲我在linux下配置的过程,先说一下浏览器下载链接打算用到的扩展/软件

- github: aria2
- chrome extension:Aria2 for chrome : 记住开启下载拦截
- 油猴脚本:随便找一款支持网盘直链下载的脚本




## aria2下载及配置
### 下载

下载aria2
```shell
sudo pacman -S aria2
```

### 配置文件设置

默认配置文件在 `$XDG_CONFIG_HOME/aria2/aria2.conf` 但我这里用的用户自定义的配置文件位置,
用自定义的命令是 `--conf-path` 
配置文件可参考:[https://github.com/P3TERX/aria2.conf](https://github.com/P3TERX/aria2.conf)


### 编写systemd
编写systemd 以服务形态启动,方便开机自启什么的
编写 `aria2.service` 在systemd对应的文件夹下
```shell
[Unit]
Description=Aria2 Daemon

[Service]
ExecStart=/usr/bin/aria2c --conf-path=/home/myusername/program/aria2/aria2_conf/aria2.conf

[Install]
WantedBy=default.target
```

然后设置开机启动和开启服务
```shell
systemctl --user enable aria2.service
systemctl --user start aria2.service
```

## web前端
这里使用了aria2NG,是chrome扩展Aria2 for chrome自带的.
这里注意,如果你的配置文件使用了推荐模板,模板自带 `rpc-secret` ,这里需要改成你自己的密钥,且在配置链接时加上密钥.

## Linux端其他下载工具推荐

推荐一下Motrix ,也是一款不错的下载软件,UI好看嘻嘻


~~后记: 测评了一下现存的网盘直链获取,感觉最好用的应该是简易了(不过需要关注公众号),这种黑科技还是不要随便扩散的好,偷偷贴在文末~~

