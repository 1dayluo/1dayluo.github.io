---
title: '[技术阅读]用github来实现漏洞赏金猎人'
date: 2021-07-28 13:37:32
tags: [技术阅读,工具篇]
published: true
hideInList: false
feature: 
isTop: false
---
# GitHub for Bug Bounty Hunters-edoverflow

原文链接：[GitHub for Bug Bounty Hunters](https://edoverflow.com/2017/github-for-bugbountyhunters/)

备注：翻译中出现的”我“均指文章作者

## Mass Cloning

[mazen160/GithubCloner](https://github.com/mazen160/GithubCloner)

```bash
python githubcloner.py --org organization -o /tmp/output
```

## Static Analysis

建议使用你渗透目标的软件并用涉及到的主要特性与功能。这里作者称为"Jobert setp"。因为Jobert会在每次找漏洞前花30分钟来理解和用project。

## Manual analysis

“learn to make it, then break it”

如果你对一门编程语言有了解，那么你会知道在安全范围内哪些能做哪些不能做。

当你理解了你的目标和它的结构，就可以grep了。搜索相关的关键字进行检测

以下是我第一次评估关注的关键字：

- API and key. (Get some more endpoints and find API keys.)
- token
- secret
- TODO
- password
- vulnerable 😜
- http:// & https://

以及以下术语（出现的时候很可能是开发人员搞砸一些东西的场景）

- CSRF
- random
- hash
- MD5,SHA-1,SHA-2,etc
- HMAC

当你去找确定的漏洞时，一定要明确是指定的哪个语言（**查询关键字**）。例如，当我找java下的timing leak时，I know that Arrays.equals() and HMAC combined causes that issue.

另一个重要的步骤是看**历史提交记录（old commits.）**

开发人员认位他们移除了身份验证，但是实际上都还在提交记录中。

## Tools

注意：不能将扫描器的发现复制粘贴到你的报告中，你会得到很多误报。因此你必须在可能产生问题的地方上人工确认是否存在漏洞。

代码审计可配合以下网址使用:[https://rules.sonarsource.com/](https://rules.sonarsource.com/)

### python

1.代码审计工具

python类项目代码审计用[Bandit](https://github.com/openstack-archive/bandit)

```bash
bandit -r path/to/your/code -ll
```

2.查询python modules的bug

检查requirements.txt中是否有过期的包

### 检查依赖关系

[Snyk.io](http://snyk.io/) is a wonderful tool for checking dependencies.

### 检查敏感信息

[Gitrob](https://github.com/michenriksen/gitrob)

```bash
gitrob analyze acme,johndoe,janedoe
```

### 检查

For finding high entropy strings (API keys, tokens, passswords, etc.)you can use [truffleHog](https://github.com/trufflesecurity/truffleHog).

```bash
truffleHog https://github.com/dxa4481/truffleHog.git
```

### All-in-one

整合

[https://github.com/anshumanbh/git-all-secrets](https://github.com/anshumanbh/git-all-secrets)