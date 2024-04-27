import{_ as c}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRVqeRiY.js";import{a as k,p as o,o as p,c as u,w as e,f as F,r as l,g as s,h as i}from"./app-CzjF7NIc.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-17i98rOK.js";import"./YunCard.vue_vue_type_script_setup_true_lang-Da3dkqK-.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-BsneHNVS.js";import"./index-C7yU5XnD.js";const g=s("p",null,[i("公开靶场:"),s("a",{href:"http://flaws.cloud/",target:"_blank",rel:"noreferrer"},"http://flaws.cloud/")],-1),m=s("h2",{id:"s3常见的安全问题",tabindex:"-1"},[i("S3常见的安全问题 "),s("a",{class:"header-anchor",href:"#s3常见的安全问题","aria-label":'Permalink to "S3常见的安全问题"'},"​")],-1),y=s("h3",{id:"安全问题概括",tabindex:"-1"},[i("安全问题概括 "),s("a",{class:"header-anchor",href:"#安全问题概括","aria-label":'Permalink to "安全问题概括"'},"​")],-1),C=s("p",null,"概括如下：",-1),b=s("ol",null,[s("li",null,[i("s3桶名为全局变量，默认是aws上任意两个用户不能有重名s3桶变量名。如一域名负载在s3，则可以通过 "),s("code",null,"<s3-name>.<hostname>"),i(" 访问")]),s("li",null,[i("S3配置IAM下， "),s("code",null,"Everyone"),i(" 意味着所有互联网上所有人。而不是，自己aws账户下的所有人，此外还有 "),s("code",null,"Any Authenticated AWS User"),i(" ，意味着所有有aws账户的人。后者web页面不支持，但是仍然可以通过SDK和第三方工具配置。")])],-1),v=s("h3",{id:"命令cheatsheet",tabindex:"-1"},[i("命令cheatsheet "),s("a",{class:"header-anchor",href:"#命令cheatsheet","aria-label":'Permalink to "命令cheatsheet"'},"​")],-1),_=s("ol",null,[s("li",null,"aws同步下载文件到本地")],-1),f=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," s3"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," sync"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," s3://level3-9afd3927f195e10225021a578e6f78df.flaws.cloud/"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --no-sign-request"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --region"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," us-west-2")])])]),s("button",{class:"collapse"})],-1),B=s("ol",null,[s("li",null,"配置新的access_key 和 secret_access_key (以靶场flaws的level3为例子）")],-1),w=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," configure"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," flawslevel3")])])]),s("button",{class:"collapse"})],-1),E=s("p",null,"查看对应的profile下的资产内容",-1),S=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," s3"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ls"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," flawslevel3")])])]),s("button",{class:"collapse"})],-1),$=s("h2",{id:"ec2常见安全问题",tabindex:"-1"},[i("EC2常见安全问题 "),s("a",{class:"header-anchor",href:"#ec2常见安全问题","aria-label":'Permalink to "EC2常见安全问题"'},"​")],-1),A=s("p",null,"常见概念：",-1),P=s("ul",null,[s("li",null,[i("STS(Security Token Service) ：控制不同aws的安全控制 "),s("ul",null,[s("li",null,[i("GetCallerIdentity: 显示账户可被控制的api "),s("strong",null,"这个操作不需要任何权限"),i("，即使管理员将拒绝访问： "),s("code",null,"aws sts get-caller-identity --profile flawslevel3")])])]),s("li",null,"snapshot 快照：快照是 Amazon 特有的东西，可让您在帐户之间传输卷上的数据。它们是从卷（volume）创建的“只读”备份"),s("li",null,[i("aws_session_token： 除了"),s("code",null,"access_key"),i(" 和 "),s("code",null,"secret_access_key"),i(" 会泄漏外，也有token泄漏的场景。需要一并加入到~/.aws/credentials下，添加 "),s("code",null,"aws_session_token = ..")])],-1),I=s("h3",{id:"安全问题概述",tabindex:"-1"},[i("安全问题概述： "),s("a",{class:"header-anchor",href:"#安全问题概述","aria-label":'Permalink to "安全问题概述："'},"​")],-1),T=s("ol",null,[s("li",null,[i("泄漏 "),s("code",null,"access_key"),i(" 和 "),s("code",null,"secret_access_key"),i(", 利用方式，通过aws cli进一步获取更多信息和提权。")]),s("li",null,[i("快照记录了volume的信息，并且可以绕过ec2密码，来利用快照访问ec2示例。这就导致了黑客可以利用快照来获取volume信息，并结合aws创建volumn的权限（"),s("code",null,"createVolumePermission"),i("） 将受害者volume挂载到攻击者的EC2示例上（需要确保region一致）。从而获取到ec2上的内容。（需要结合第1点来利用）")]),s("li",null,[i("ssrf漏洞，导致可以利用 "),s("code",null,"169.254.169.254"),i(" 获取meta-data。（AWS在IMDSv2下，设立了特定的header，但IMDSv2并非默认强制）关于IMDSv1的问题看这篇"),s("a",{href:"https://kishoreramk.medium.com/securing-aws-understanding-ec2-imds-vulnerabilities-and-learning-from-the-capital-one-breach-6f753e06cd66",target:"_blank",rel:"noreferrer"},"文章"),s("ol",null,[s("li",null,"169.254.169.254/latest/meta-data/iam/security-credentials/flaws"),s("li",null,"169.254.169.254/latest/meta-data/iam/info"),s("li",null,"169.254.169.254/latest/meta-data/iam/")])]),s("li",null,[s("code",null,"SecurityAudit"),i(" 权限")])],-1),x=s("h3",{id:"cheatsheet",tabindex:"-1"},[i("cheatsheet "),s("a",{class:"header-anchor",href:"#cheatsheet","aria-label":'Permalink to "cheatsheet"'},"​")],-1),M=s("ol",null,[s("li",null,"显示全部STS（Security Token Service)")],-1),j=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," sts"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," get-caller-identity"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," flawslevel3")])])]),s("button",{class:"collapse"})],-1),z=s("ol",null,[s("li",null,"显示ec2实例密钥对（需要提前profile配好region）")],-1),D=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"  --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," flawslevel3"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ec2"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"  describe-key-pairs")])])]),s("button",{class:"collapse"})],-1),V=s("ol",null,[s("li",null,"检查属于用户id为指定id(这里为975426262029）下的快照")],-1),q=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ec2"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," describe-snapshots"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --owner-id"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 975426262029"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," flawslevel3")])])]),s("button",{class:"collapse"})],-1),W=s("ol",null,[s("li",null,[i("查看指定快照id的 "),s("code",null,"createVolumePermission"),i(" 权限")])],-1),L=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ec2"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," describe-snapshot-attribute"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --snapshot-id"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," snap-0b49342abd1bdcb89"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --attribute"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," createVolumePermission"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," flawslevel3")])])]),s("button",{class:"collapse"})],-1),N=s("ol",null,[s("li",null,"volume绑定ec2 instance & 进一步的利用")],-1),O=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ec2"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," attach-volume"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," —-volume-id"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," vol-randnum"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --instance-id"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," i-randnum"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," —-device"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," /dev/sdf"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," —-region"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," us-west-2")])])]),s("button",{class:"collapse"})],-1),U=s("p",null,"进一步利用所需命令补充（待后续优化笔记）：",-1),K=s("p",null,[i("Download the key pair and SSH into it. change the permission of downloaded pem file. "),s("code",null,"ssh -i YOUR_KEY.pem ubuntu@ec2-54-191-240-80.us-west-2.compute.amazonaws.com")],-1),R=s("p",null,[i("First list information about all available block devices using "),s("code",null,"lsblk."),i(" "),s("code",null,"xvda1"),i(" is our available volume.")],-1),Y=s("p",null,[i("view drive information: "),s("code",null,"sudo file -s /dev/xvdf1")],-1),Z=s("p",null,[i("Mount drive: "),s("code",null,"sudo mount /dev/xvdf1 /mnt")],-1),G=s("h2",{id:"iam常见安全问题",tabindex:"-1"},[i("IAM常见安全问题 "),s("a",{class:"header-anchor",href:"#iam常见安全问题","aria-label":'Permalink to "IAM常见安全问题"'},"​")],-1),H=s("ol",null,[s("li",null,[s("code",null,"SecurityAudit"),i(" 的policy能够帮助黑客去读区你或别的iam信息，然后寻找薄弱点")])],-1),J=s("h3",{id:"cheatsheet-1",tabindex:"-1"},[i("cheatsheet "),s("a",{class:"header-anchor",href:"#cheatsheet-1","aria-label":'Permalink to "cheatsheet"'},"​")],-1),Q=s("p",null,"policy精确查询：",-1),X=s("p",null,"列出当前用户iam信息：创建时间，路径，unique id，arn",-1),ss=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," iam"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," get-user")])])]),s("button",{class:"collapse"})],-1),is=s("p",null,[i("List attached-user-policies attached to user ( "),s("code",null,"{username}"),i(" 为get-user获取到的用户名）")],-1),es=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," iam"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," list-attached-user-policies"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --username"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {username}")])])]),s("button",{class:"collapse"})],-1),as=s("p",null,"list-users",-1),ls=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," iam"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," list-users"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6")])])]),s("button",{class:"collapse"})],-1),ts=s("p",null,"list policies（这里会有arn的信息）",-1),hs=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," iam"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," list-policies"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6")])])]),s("button",{class:"collapse"})],-1),ns=s("p",null,"根据arn信息和version id，来查看具体policy信息 （这里arn-id为list-attached-user-policies命令下的）",-1),os=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," iam"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," get-policy-version"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --policy-arn"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {arn-id}"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --version-id"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," v4")])])]),s("button",{class:"collapse"})],-1),rs=s("p",null,"lambda的精确查询：",-1),ds=s("p",null,"查找有哪些lambda 这一步可以获取到lambda函数名",-1),cs=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --region"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," us-west-2"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," list-funtions")])])]),s("button",{class:"collapse"})],-1),ks=s("p",null,"查看对应函数名的policy信息",-1),ps=s("div",{class:"language-bash vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"aws"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --region"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," us-west-2"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --profile"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," level6"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," lambda"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," get-policy"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --function-name"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," {func-name}")])])]),s("button",{class:"collapse"})],-1),us=s("p",null,[i("这一步可以获取到rest-api-id ，然后访问 "),s("a",{href:"https://api-id.execute-api.us-east-2.amazonaws.com/",target:"_blank",rel:"noreferrer"},[s("code",null,"https://api-id.execute-api.us-east-2.amazonaws.com")])],-1),Fs=s("h2",{id:"学习文章",tabindex:"-1"},[i("学习文章： "),s("a",{class:"header-anchor",href:"#学习文章","aria-label":'Permalink to "学习文章："'},"​")],-1),gs=s("ul",null,[s("li",null,[s("a",{href:"https://kishoreramk.medium.com/hacking-aws-flaws-cloud-walkthrough-2f13083b0b4d",target:"_blank",rel:"noreferrer"},"https://kishoreramk.medium.com/hacking-aws-flaws-cloud-walkthrough-2f13083b0b4d")]),s("li",null,[s("a",{href:"https://kishoreramk.medium.com/securing-aws-understanding-ec2-imds-vulnerabilities-and-learning-from-the-capital-one-breach-6f753e06cd66",target:"_blank",rel:"noreferrer"},"https://kishoreramk.medium.com/securing-aws-understanding-ec2-imds-vulnerabilities-and-learning-from-the-capital-one-breach-6f753e06cd66")])],-1),Es={__name:"aws-chang-jian-an-quan-wen-ti-zong-jie-yi",setup(ms,{expose:r}){const t=JSON.parse('{"title":"AWS 常见安全问题总结（一）","description":"","frontmatter":{"title":"AWS 常见安全问题总结（一）","date":"2024-03-24T20:18:36.000Z","tags":["云安全","学习笔记"],"published":true,"hideInList":false,"feature":null,"isTop":false},"headers":[{"level":2,"title":"S3常见的安全问题","slug":"s3常见的安全问题","link":"#s3常见的安全问题","children":[{"level":3,"title":"安全问题概括","slug":"安全问题概括","link":"#安全问题概括","children":[]},{"level":3,"title":"命令cheatsheet","slug":"命令cheatsheet","link":"#命令cheatsheet","children":[]}]},{"level":2,"title":"EC2常见安全问题","slug":"ec2常见安全问题","link":"#ec2常见安全问题","children":[{"level":3,"title":"安全问题概述：","slug":"安全问题概述","link":"#安全问题概述","children":[]},{"level":3,"title":"cheatsheet","slug":"cheatsheet","link":"#cheatsheet","children":[]}]},{"level":2,"title":"IAM常见安全问题","slug":"iam常见安全问题","link":"#iam常见安全问题","children":[{"level":3,"title":"cheatsheet","slug":"cheatsheet-1","link":"#cheatsheet-1","children":[]}]},{"level":2,"title":"学习文章：","slug":"学习文章","link":"#学习文章","children":[]}],"relativePath":"pages/posts/history/aws-chang-jian-an-quan-wen-ti-zong-jie-yi.md","path":"/home/runner/work/1dayluo.github.io/1dayluo.github.io/pages/posts/history/aws-chang-jian-an-quan-wen-ti-zong-jie-yi.md","lastUpdated":1714218709000}'),n=k(),h=t.frontmatter||{};return n.meta.frontmatter=Object.assign(n.meta.frontmatter||{},t.frontmatter||{}),o("pageData",t),o("valaxy:frontmatter",h),globalThis.$frontmatter=h,r({frontmatter:{title:"AWS 常见安全问题总结（一）",date:"2024-03-24T20:18:36.000Z",tags:["云安全","学习笔记"],published:!0,hideInList:!1,feature:null,isTop:!1}}),(a,Cs)=>{const d=c;return p(),u(d,{frontmatter:F(h)},{"main-content-md":e(()=>[g,m,y,C,b,v,_,f,B,w,E,S,$,A,P,I,T,x,M,j,z,D,V,q,W,L,N,O,U,K,R,Y,Z,G,H,J,Q,X,ss,is,es,as,ls,ts,hs,ns,os,rs,ds,cs,ks,ps,us,Fs,gs]),"main-header":e(()=>[l(a.$slots,"main-header")]),"main-header-after":e(()=>[l(a.$slots,"main-header-after")]),"main-nav":e(()=>[l(a.$slots,"main-nav")]),"main-content":e(()=>[l(a.$slots,"main-content")]),"main-content-after":e(()=>[l(a.$slots,"main-content-after")]),"main-nav-before":e(()=>[l(a.$slots,"main-nav-before")]),"main-nav-after":e(()=>[l(a.$slots,"main-nav-after")]),comment:e(()=>[l(a.$slots,"comment")]),footer:e(()=>[l(a.$slots,"footer")]),aside:e(()=>[l(a.$slots,"aside")]),"aside-custom":e(()=>[l(a.$slots,"aside-custom")]),default:e(()=>[l(a.$slots,"default")]),_:3},8,["frontmatter"])}}};export{Es as default};
