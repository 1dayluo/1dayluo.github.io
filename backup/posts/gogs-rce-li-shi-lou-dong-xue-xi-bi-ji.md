---
title: ' Gogs RCE 历史漏洞学习笔记'
date: 2023-05-25 19:23:23
tags: [漏洞分析,笔记,靶场,刷题,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---


<aside>
💡 This exercise covers how to get code execution against the Git self hosted tool: Gogs.

</aside>


备注: gogs的老漏洞学习,非最新的.靶场学习的, 里面提供了复现环境,就不用自己搭建了.


## 概括

gogs是一种提供能自己服务器上搭建git服务的开源项目,即自助git

gogs的攻击分为两步:

1. 绕过验证变为administrator
2. 使用hook获取命令执行rce

## 漏洞分析学习

分析主要是看Reference里的文章, 大佬文章写的足够详细了, 我就简单记录一下跟着文章捋的思路和自己的一些梳理. 建议还是看原文, 有更详细的代码分析(学习时写自己的思路笔记才有助于理解不是吗)

### 修复的关键代码:

```go
// Read returns raw session store by session ID.
func (m *Manager) Read(sid string) (RawStore, error) {
    // No slashes or dots "./" should ever occur in the sid and to prevent session file forgery bug.
    // See https://github.com/gogs/gogs/issues/5469
    if strings.ContainsAny(sid, "./") {
        return nil, errors.New("invalid 'sid': " + sid)
    }

    return m.provider.Read(sid)
}
```

利用条件:

1. Gogs的配置文件指定session存储方式为文件
2. 后台逻辑(session.go)没有考虑到过滤 `../` 等字符
3. `i_like_gogits` 可以加载任意文件的内容(同2)

其中:

- cookie中 `i_like_gogits` 为对应session文件的文件名, 这里可以改为管理员的session

而其中session的信息需要人为构造并且找到一个上传点

### 人为构造session:

session生成是由 `EncodeGob` 解码则是通过 `DecodeGob` ,解码对应session然后修改里面的uid为管理员uid和uname, 再由EncodeGob编码.

- encoding session的代码

```go
func EncodeGob(obj map[interface{}]interface{}) ([]byte, error) {
    for _, v := range obj {
        gob.Register(v)
    }
    buf := bytes.NewBuffer(nil)
    err := gob.NewEncoder(buf).Encode(obj)
    return buf.Bytes(), err
}
```

User 结构体([https://github.com/gogs/gogs/blob/be6bb5314ee7d8ed53362d8e6893b061e5210f48/models/user.go#L50-L52](https://github.com/gogs/gogs/blob/be6bb5314ee7d8ed53362d8e6893b061e5210f48/models/user.go#L50-L52))

```go
type User struct {
    ID        int64
    LowerName string `xorm:"UNIQUE NOT NULL"`
    Name      string `xorm:"UNIQUE NOT NULL"`
    FullName  string
```

获取session的代码([routes/user/auth.go](https://github.com/gogs/gogs/blob/be6bb5314ee7d8ed53362d8e6893b061e5210f48/routes/user/auth.go#L127-L128)) 涉及到用户身份的有两个值

```go
c.Session.Set("uid", u.ID)
c.Session.Set("uname", u.Name)
```

### 上传点

Gogs提供了三种方式在服务器上传:

- 使用issue tracker提供的上传功能 :
- 用git push : 但是受限上传文件类型/内容过滤
- 使用upload file在给定repository
- 
这里用upload file为例子,当你创建repo的拷贝后, Gogs会将文件放在 `/data/gogs/data/tmp/local-repo/[REPO_ID]/[FILENAME]` 里, 这里repo_id可以在fork的时候查看链接(链接里子目录名), 对应[代码](https://github.com/gogs/gogs/blob/be6bb5314ee7d8ed53362d8e6893b061e5210f48/models/repo.go#L594-L596). 这里session默认存储路径为 `/**data/gogs/data/sessions/` *

构造即在`i_like_gogits` 中将文件指向相对路径即可

![](https://i.imgur.com/H7FyjSv.png)


### 登录后利用

用的git的hook功能. 实现RCE

git hook以前刷题用到过,见 [https://1dayluo.github.io/post/htbencoding/#git-commitsh](https://1dayluo.github.io/post/htbencoding/#git-commitsh)
这里注意看仓库设置里Gogs支持的hook,  我在复现的时候就发现了靶场不支持post-commit的hook

## 反思

这个漏洞是经典的session管理和文件目录遍历结合的洞, 学习组合拳什么的…包括代码审计遇到类似的也可以(gogs的session管理和php的session管理是一样的机制)

## Reference

- [https://www.anquanke.com/post/id/163575](https://www.anquanke.com/post/id/163575)
- Pentesterlab: Green