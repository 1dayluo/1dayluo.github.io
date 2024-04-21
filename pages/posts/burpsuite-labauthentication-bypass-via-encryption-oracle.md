---
title: '【Burpsuite】 lab#Authentication bypass via encryption oracle'
date: 2021-09-13 11:53:56
tags: [靶场,PortSwigger,burp]
published: true
hideInList: false
feature: 
isTop: false
---
提取其中的一篇笔记进行记录。

# lab#Authentication bypass via encryption oracle

This lab contains a logic flaw that exposes an encryption oracle to users. To solve the lab, exploit this flaw to gain access to the admin panel and delete Carlos.

You can log in to your own account using the following credentials: `wiener:peter`

跟以前的lab一样，admin panel还是在/admin下
<!-- more -->



这是正常留言后的response:

> HTTP/1.1 302 Found
Location: /post/comment/confirmation?postId=5
Connection: close
Content-Length: 0

这是邮箱未能按照标准格式填写的response：

> HTTP/1.1 302 Found
Location: /post?postId=5
Set-Cookie:notification=WOHlxrFhpplZ1%2fQ5TWpuQyHzzOiVO1DQGs8KHVqCrLpaSoyIZRKmFilgJy2tA39b; HttpOnly
Connection: close
Content-Length: 0

会看到有notification字段被加密

再根据首页内容，发现提示字段为“Invalid email address: [abc.burp.com](http://abc.burp.com/)”

Invalid email address: 是23个字符

输入邮箱为1，发现是：

```jsx
WOHlxrFhpplZ1%2fQ5TWpuQ%2fBqnHLRiWCSos7j6Nv%2fWYY%3d
```

有%2类似的符号

然后对有提示”invalid ......"字段的网页（/post?postId=5）进行抓包，发现可以解密notification。

接着找和notification有同样加密，且是重要方法的功能。进行登录，发现登录后，request的header是这样的：

> Cookie: stay-logged-in=xDZcp9Br4a3%2fPrkhd1EvK4RakVxTy4Wxc%2fYWI3LHHYU%3d; session=yAg2MXqtmpKLAjooSbhD14CqzTKhUeVI

可以观察到stay-logged-in和notification的加密方式很像

如果用同一种加密方式的话，就可以：

- /post?postId={} 对于notification的response的回显当作decrypt
- /my-account 的stay-logged-in当作encrypt
- /post/comment 下的notificatoin也可以当作encrypt

将ENCRYPT下的stay-logged-in，放到DECRYPT的notification下。解得：

```jsx
xkYNlEW%2b2VVQoO83%2b91YWTkxxWy2cegjd1%2f4BNWnd%2fs%3d;
```

为：

```jsx
wiener:1630929464302
```

---

                                   失败的尝试

构造：

administrato:1630929464302  到ENCRYPT下，

然后将构造的放入stay-logged-in中，去掉session。

还是不行，应该是我对application这块的encryption oracle的漏洞理解不够深刻。

继续滚回去看官方视频题解，发现自己的误区了，DECRYPT利用param的notification加密的文字是：

“Invalid email address: administrator:1630929464302”

除了账户基本信息被加密外，也加密了前面的“invalid email address:” 

---

                               解决

Invalid email address: 包括23个字符，发送全句加密到decode，

进行URL decode → base64 decode →在base64 decode下delete bytes输入23.

然后再反向加密回去。

base64 encode → URL encode

为了检验自己自定义加密后的文字是否正确，再在repeater下标记为DECRYPT的标签尝试decrypt。结果发现500，提示：

“javax.crypto.IllegalBlockSizeException: Input length must be multiple of 16 when decrypting with padded cipher</p>”

必须是16的倍数。这块又学习了一下，原来是采用的分组算法，必须得保证前面的组都是16的倍数，最后一组会自动在结尾padding。所以16×2-23，需要在administrato前填9个字符给前面的组进行加密。administrato以后作为最后一组。

此时，encrypt一下加了9个字符的administrator:1630929464302。

然后再把notification放入decode中和刚刚一样操作。然后放入DECRYPT检测，如图，检测成功www



最终加密是：

%46%34%4a%37%48%67%4e%54%43%37%43%66%4e%37%43%2f%79%58%53%6e%53%56%31%7a%59%4f%36%4c%36%74%45%44%4c%4e%6a%36%6f%51%62%52%2f%41%41%3d