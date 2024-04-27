import{_ as d}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRVqeRiY.js";import{a as o,p as n,o as g,c as F,w as t,f as c,k as y,r as e,g as i,h as s}from"./app-CzjF7NIc.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-17i98rOK.js";import"./YunCard.vue_vue_type_script_setup_true_lang-Da3dkqK-.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-BsneHNVS.js";import"./index-C7yU5XnD.js";const C=i("h1",{id:"petpet-rcbee",tabindex:"-1"},[s("petpet rcbee "),i("a",{class:"header-anchor",href:"#petpet-rcbee","aria-label":'Permalink to "petpet rcbee"'},"​")],-1),E=i("p",null,[i("s",null,"又是一道flask+python的题(后来发现无关)")],-1),u=i("figure",null,[i("img",{src:"https://cdn.jsdelivr.net/gh/1dayluo/PicGo4Blog/data/petpetrobee_1.png",alt:"Untitled",loading:"lazy",decoding:"async"})],-1),m=i("h2",{id:"分析",tabindex:"-1"},[s("分析 "),i("a",{class:"header-anchor",href:"#分析","aria-label":'Permalink to "分析"'},"​")],-1),f=i("h3",{id:"flask",tabindex:"-1"},[s("Flask "),i("a",{class:"header-anchor",href:"#flask","aria-label":'Permalink to "Flask"'},"​")],-1),B=i("p",null,[i("strong",null,"文件上传功能"),s("(/api/upload)")],-1),_=i("p",null,[s("上传前会先进行一次对文件名的判断:在函数"),i("code",null,"allowed_file"),s(" 中实现:")],-1),b=i("div",{class:"language-php vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"php"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"def"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," allowed_file"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"filename"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"):")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    return"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '.'"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," in"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," filename"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," and"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," \\")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"        filename"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"rsplit"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'.'"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")["),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"lower"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"in"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," ALLOWED_EXTENSIONS")])])]),i("button",{class:"collapse"})],-1),v=i("p",null,"就是检查文件后缀是否满足,同时文件后缀名在ALLOWED_EXTENSIONS里(png,jpg,jpeg)",-1),D=i("p",null,"如果文件名符合:",-1),A=i("p",null,[s("文件上传会上传为临时文件(会自动删除),且文件名有再次的安全审查,调用了"),i("code",null,"werkzeug.utils"),s(" 下的"),i("code",null,"secure_filename"),s(" 方法")],-1),P=i("div",{class:"language-php vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"php"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"tmp"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"  ="),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," tempfile"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"gettempdir"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"()")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"path"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," ="),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," os"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"path"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"join"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"tmp"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"secure_filename"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"file"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"filename"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))")])])]),i("button",{class:"collapse"})],-1),$=i("p",null,[i("strong",null,"而该应用主要使用的是PIL模块,从而实现”摸摸头”的效果")],-1),T=i("h3",{id:"dockerfile",tabindex:"-1"},[s("Dockerfile "),i("a",{class:"header-anchor",href:"#dockerfile","aria-label":'Permalink to "Dockerfile"'},"​")],-1),L=i("p",null,"发现docker下载了ghostscript-9.23",-1),w=i("h2",{id:"漏洞",tabindex:"-1"},[s("漏洞 "),i("a",{class:"header-anchor",href:"#漏洞","aria-label":'Permalink to "漏洞"'},"​")],-1),I=i("p",null,"一搜索ghostscript-9.23 exploid的就搜到了,现在要学习的就是利用姿势",-1),S=i("p",null,"Python PIL/Pillow Remote Shell Command Execution via Ghostscript CVE-2018-16509",-1),N=i("p",null,[s("链接见:"),i("a",{href:"https://github.com/farisv/PIL-RCE-Ghostscript-CVE-2018-16509",target:"_blank",rel:"noreferrer"},"https://github.com/farisv/PIL-RCE-Ghostscript-CVE-2018-16509")],-1),O=i("p",null,"可以看到PIL使用了Ghostscript作为引擎",-1),V=i("p",null,"构造合适的payload",-1),j=i("div",{class:"language-php vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"php"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"%!"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"PS"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Adobe"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"3.0"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," EPSF"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"3.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"%%"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"BoundingBox"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"0"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"0"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 100"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 100")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"userdict"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," /"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"setpagedevice"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," undef")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"save")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"legal")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"{ "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"null"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," restore"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," } "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"stopped"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," { "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"pop"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," } "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"{ "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"legal"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," } "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"stopped"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," { "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"pop"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," } "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"restore")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"mark"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," /"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"OutputFile"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ("),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"%"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"pipe"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"%"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," cat"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," /"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"app"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"flag"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," >>"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," /"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"app"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"application"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/static/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"assets"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"flag"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"currentdevice"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," putdeviceprops")])])]),i("button",{class:"collapse"})],-1),G=i("p",null,"查看对应路径就可以下载到flag文件了",-1),M={__name:"htb-petpet-rcbee",setup(H,{expose:r}){const l=JSON.parse('{"title":"[HTB] petpet rcbee ","description":"","frontmatter":{"title":"[HTB] petpet rcbee ","date":"2021-12-28T17:57:12.000Z","tags":["HTB","web"],"published":true,"hideInList":false,"feature":null,"isTop":false},"headers":[{"level":2,"title":"分析","slug":"分析","link":"#分析","children":[{"level":3,"title":"Flask","slug":"flask","link":"#flask","children":[]},{"level":3,"title":"Dockerfile","slug":"dockerfile","link":"#dockerfile","children":[]}]},{"level":2,"title":"漏洞","slug":"漏洞","link":"#漏洞","children":[]}],"relativePath":"pages/posts/history/htb-petpet-rcbee.md","path":"/home/runner/work/1dayluo.github.io/1dayluo.github.io/pages/posts/history/htb-petpet-rcbee.md","lastUpdated":1714218709000}'),k=o(),h=l.frontmatter||{};return k.meta.frontmatter=Object.assign(k.meta.frontmatter||{},l.frontmatter||{}),n("pageData",l),n("valaxy:frontmatter",h),globalThis.$frontmatter=h,r({frontmatter:{title:"[HTB] petpet rcbee ",date:"2021-12-28T17:57:12.000Z",tags:["HTB","web"],published:!0,hideInList:!1,feature:null,isTop:!1}}),(a,x)=>{const p=d;return g(),F(p,{frontmatter:c(h)},{"main-content-md":t(()=>[C,E,u,y(" more "),m,f,B,_,b,v,D,A,P,$,T,L,w,I,S,N,O,V,j,G]),"main-header":t(()=>[e(a.$slots,"main-header")]),"main-header-after":t(()=>[e(a.$slots,"main-header-after")]),"main-nav":t(()=>[e(a.$slots,"main-nav")]),"main-content":t(()=>[e(a.$slots,"main-content")]),"main-content-after":t(()=>[e(a.$slots,"main-content-after")]),"main-nav-before":t(()=>[e(a.$slots,"main-nav-before")]),"main-nav-after":t(()=>[e(a.$slots,"main-nav-after")]),comment:t(()=>[e(a.$slots,"comment")]),footer:t(()=>[e(a.$slots,"footer")]),aside:t(()=>[e(a.$slots,"aside")]),"aside-custom":t(()=>[e(a.$slots,"aside-custom")]),default:t(()=>[e(a.$slots,"default")]),_:3},8,["frontmatter"])}}};export{M as default};
