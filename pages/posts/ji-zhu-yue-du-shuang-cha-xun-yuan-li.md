---
title: '[技术阅读]双查询原理'
date: 2021-07-28 13:39:07
tags: [技术阅读,知识点巩固]
published: true
hideInList: false
feature: 
isTop: false
---
# Double_ SQL_Injection/#0x01-双查询

原文链接：[Double SQL Injection(双查询注入) | Mochazz's blog](https://mochazz.github.io/2017/09/23/Double_%20SQL_Injection/#0x01-%E5%8F%8C%E6%9F%A5%E8%AF%A2)

## 笔记

： 0x3a是`:`

注入sample：

```sql
select count(*),concact((<injection>),floor(rand(0)*2)a from <target-table> group by a --+
```

爆表

```sql
select count(*),concact(
(select table_name from information_schema.tables where table_schema='security'),
floor(rand(0)*2)
)a
from information_schema.column 
group by a
```

### 语法讲解

**concact()a**

`concact` 本身是用于将里面的参数全部连接起来

```sql
select concact()a 
等价于
select concact() as a
```

### 原理：

`floor(rand(0)*2)` 可以用floor和rand(0)的配合取消rand的随机性，导致每次组合运行时都会特点输出01101。

`group by`遇到`count` 会创建一个虚拟表，而group by的查询到的对象不在虚拟表中，则会插入一条数据，有则会调用count进行计数+1

`group by` 默认遇到`rand` 在插入group by 的虚拟表中，会再进行一次rand计算。

所以导致：

`011011` 

第一次 0：

虚拟表中没有，由于`count` 特性准备插入，

再由于`group by` ,又运行了一次rand，导致插入的数字为 1

第三次 0：

同理，在虚拟表中没有0，由于由于`count` 特性准备插入，

再由于`group by` ,又运行了一次rand，导致插入

但是，数字1 作为键已经存在，

此时会报错