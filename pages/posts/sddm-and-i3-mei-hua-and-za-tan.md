---
title: 'sddm & i3 美化 & 杂谈'
date: 2022-11-19 23:56:49
tags: [Linux]
published: true
hideInList: false
feature: 
isTop: false
---


## 关于sddm

### sddm主题

1. 去arch aur官网，搜索sddm-theme即可，然后列出来的可以去github（
  Git Clone URL什么的）看一下样式。
  
2. 看新下的主题名称：`ls /usr/share/sddm/themes/`
  
3. 到`/etc/sddm.conf.d`下新建一个.conf文件（这里的文件出现的配置选项会默认覆盖sddm的default.conf下的配置项）,这里将Current后的值设为对应的主题名称
  

```shell
[General]
HalyCommand=/usr/bin/systemctl poweroff
RebootCommand=/usr/bin/systemctl reboot
[Theme]
Current=astronaut
```

需要重启一下才能生效

## 关于i3

一个不错的翻译项目： https://zjuyk.site/i3wm-userguide-zh/%E4%BB%8B%E7%BB%8D.html

### 壁纸

feh --bg-scale {path-to-picture}

推荐壁纸源（非二次元主题）： /earthporn 一个subreddit

### bar：polybar

i3bar太丑了，这里我用的polybar

插件：

- i3-volume （https://github.com/hastinbe/i3-volume/wiki/Installation#polybar）

i3配置polybar
exec_always --no-startup-id {对polybar的launch.sh路径}

### 音量

绑定音量按键

```shell
bindsym XF86AudioRaiseVolume exec --no-startup-id pactl set-sink-volume @DEFAULT_SINK@ +10% && $refresh_i3status
bindsym XF86AudioLowerVolume exec --no-startup-id pactl set-sink-volume @DEFAULT_SINK@ -10% && $refresh_i3status
bindsym XF86AudioMute exec --no-startup-id pactl set-sink-mute @DEFAULT_SINK@ toggle && $refresh_i3status
bindsym XF86AudioMicMute exec --no-startup-id pactl set-source-mute @DEFAULT_SOURCE@ toggle && $refresh_i3status
```

### 亮度

需要下载:

- light-git(aur)

i3配置文件（~/.config/i3/config）绑定按键

```shell
bindsym XF86MonBrightnessUp exec light -A 10 # increase screen brightness
bindsym XF86MonBrightnessDown exec light -U 10 # decrease screen brightness
```

## 毛玻璃特效:picom

### 基础

1. 下载：picom-jonaburg-git (https://github.com/jonaburg/picom)
2. 拷贝配置： `cp /etc/xdg/picom.conf.example ~/.config/picom/picom.conf ` （没有目录创建目录）
3. i3配置： `exec --no-startup-id picom -b`

### 定制化配置

1. 使用 `xprop` 命令查看WM_CLASS(STRING) 的内容，然后在opacity-rule下新增（如果有，则修改。像kitty这个terminal显示在这里配置没有太大的改观）
  
  ```
  "90:name      = '{your-class}' && focused",
  "30:name      = '{your-class}' && !focused",
  ```
  
  3. 设置毛玻璃的效果强度： blur-strength
  4. 设置bar是否需要毛玻璃特效：在blur-background-exclude下对应 “window_type" = 'dock'" （如果你下了picom-jonaburg-git，这里应该默认有，选择注释or取消注释）

## 关于锁屏

### 锁屏：i3lock配置锁屏：

需要下载：
-  i3lock-color(aur)
- xidlehook
- xautolock
- imagemagick
- scrot
  

1. 创建~/.bin/scripts
  
2. 将 ~/.bin/scripts 加入环境变量，这里我是fish，用fish_add_path -p
  
3. scripts脚本如下：
  
  ```shell
  #!/bin/bash
  rm /tmp/screenshot.png
  scrot /tmp/screenshot.png
  convert /tmp/screenshot.png -blur 0x20 /tmp/screenshotblur.png
  convert /tmp/screenshotblur.png /home/n3k0/picture/i3-lock/lock.png -gravity center -composite -matte /tmp/screenlock.png
  i3lock -i /tmp/screenlock.png
  ```
  
  命令吗，scrot负责截图，convert用于模糊处理和叠加一个lock.png图像。这里我自己用Picsart编辑了一张lock图片嘻嘻
  
4. 设置自动锁屏，脚本如下（这里命名它为locker）
  
  ```shell
  #!/bin/sh
  exec xautolock -detectsleep -time 10 -locker "/home/n3k0/.bin/scripts/lock.sh" -notify 30 -notifier "ntify-send -u critical -t 10000 -- 'LOCKING screen in 30 seconds'" &
  exec xidlehook --not-when-fullscreen --timer 1200 "systemctl suspend" -
  ```
  

其中
xautolock负责定时锁屏和锁屏前提示
xidlehook负责休眠会在计算机空闲20分钟后，检查有无全屏播放的（比如正在看电影动漫），没有就会执行systemctl suspend命令（其中 - 是因为xidlehook会期待一个用户输入，`-` 一定要有）

5. 加入到i3自动启动 
  在放入i3的config文件前，这里我又编辑了个脚本（i3-auto)，用于放全部的 exec_always 类型的脚本，包括fcitix，feh，polybar等
  大概长这样
  ````shell
  fcitx &
  feh --bg-scale /home/n3k0/picture/i3 &
  polystart.sh &
  locker.sh &
  ````

编辑配置文件 ~/.config/i3/config, 在i3的config文件配置加一行 exec_always --no-startup-id i3-auto 如果这里没有像我这样，那你就把i3-auto换为刚刚的locker.sh

6. 绑定锁屏按键
  bindsym $mod+Ctrl+l exec --no-startup-id lock.sh

预览（我的锁屏样式嘻嘻，中间为自己P的图片www！～）

![](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2022_11/screenlock.png)

## 外接屏幕

需要安装

- xorg-xrandr
- Arandr (可视化)

## Kitty

用了这个dotfile：https://github.com/Jguer/dotfiles

样式预览

![](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2022_11/2022-11-19-23-42-19-kitty.png)