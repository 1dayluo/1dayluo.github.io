---
title: '使用celery让任务在后台运行（失败，celery不支持windows)'
date: 2020-08-14 11:51:00
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
# 什么是celery
     Celery 是一个异步任务队列。你可以使用它在你的应用上下文之外执行任务。总的想法就是你的应用程序可能需要执行任何消耗资源的任务都可以交给任务队列，让你的应用程序自由和快速地响应客户端请求。

# 我的尝试
最近写异步爬虫想在Flask中应用，找了很多方法，包括流式渲染。后来又接触了celery。celery在很多方面都会用到，flask也不例外。
在这里我用celery的意图是用celery在后台运行任务

## celery配置

首先在`__init__`中初始化celery，选择broker
````python
app = Flask(__name__)
app.config.from_object(celeryconfig)
celery = Celery(app.name)
celery.config_from_object(celeryconfig)
````
我在celeryconfig.py中设置了broker相关的配置，并在init中加载（redis的安装和部署在这里就不写了）
````python
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
````

## 任务定义及执行方法
然后定义一个celery任务
````python
@celery.task()
def get_topics(group_links):
    with app.app_context():
        topics = worker(group_links)
    return topics
````
调取任务，其中`delay`方法相当于`apply_async`的一种简写方式。如果要用到更多的参数，则需调用`apply_async`
````python
@app.route('/api/group/<groupid>',methods=['POST','GET'])
def test_api(groupid):
    base_url = 'https://www.douban.com/group/{}/'
    links = [ base_url.format(i) for i in eval(groupid) ]


    result = get_topics.delay(links)
    return jsonify(result.get())

 ````

## 启动redis并用cmd执行celery

1.启动redis（此处省略）
2.启动celery

````python
celery worker -A app.celery --loglevel=info

````



# 失败原因

运行报错，查了半天发现了一篇文章(https://blog.csdn.net/javali1995/article/details/78475108)
> 
> celery4 不支持windows！celery4 不支持windows！celery4 不支持windows！
celery 3.1.18不支持python36！celery 3.1.18不支持python36！celery 3.1.18不支持python36！


好心烦，celery尝试失败。本来以为看到了希望，对于Flask自己的知识基础还是太薄弱了
然后又找到一篇文章：
https://zhuanlan.zhihu.com/p/30897711
也是说flask基本上是不支持原生async/await，唯一的解决方案只有celery了。太坑爹了而且celery真的很重。目前也没有linux服务器
