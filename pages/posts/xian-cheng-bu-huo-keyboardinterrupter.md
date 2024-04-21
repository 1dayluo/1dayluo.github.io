---
title: '线程捕获KeyboardInterrupter'
date: 2020-06-30 11:39:19
tags: [python]
published: true
hideInList: false
feature: 
isTop: false
---


线程捕获KeyboardInterrupter不能简单用`try....except`.......来捕获。原因在stackover上说的很明白：This is a Python bug. When waiting for a condition in threading.Condition.wait(), KeyboardInterrupt is never sent. 
以以下代码为例：
```python
import threading
cond = threading.Condition(threading.Lock())
cond.acquire()
cond.wait(None)
print "done"
````
在wait()返回之前，Keyboardinterrupt的信号是不会发送给运行中的程序的。
所以，要想实现捕获KeyboardInterrupt有以下几种方法：
1. 设置信号
2. 在线程中使用timeout

## 设置信号
示例代码如下
````python
import multiprocessing
import time
import signal
import sys


# based on http://stackoverflow.com/a/6191991/1711188
# but instead of calling Pool.join(), we just close and manually poll for processes exiting
# also it assumes we have a finite number of jobs we want to run; if they complete
# it terminates in the normal way


def init_worker():
    signal.signal(signal.SIGINT, signal.SIG_IGN)


def worker(jobid):
    time.sleep(1.1234)
    print("Working on job...", jobid)


def main():
    pool = multiprocessing.Pool(3, init_worker)
    try:
        results = []
        for i in range(23):
            results.append(pool.apply_async(worker, (i,)))


        pool.close()
        while True:
            if all(r.ready() for r in results):
                print("All processes completed")
                return
            time.sleep(1)


    except KeyboardInterrupt:
        print("Caught KeyboardInterrupt, terminating workers")
        pool.terminate()
        pool.join()




if __name__ == "__main__":
    main()
````

## 在线程中使用timeout
我初次见于`map_async`中，
用法大抵如下：
````python
from multiprocessing.pool import ThreadPool
import time

timeout = 25

with ThreadPool(processes=4) as tp:
    async_result = tp.map_async(time.sleep, [5, 4])

    for i in range(timeout):
        time.sleep(1)

        if async_result.ready():
            if async_result.successful():
                print(async_result.get())
                break
    else:
        print("Task did not complete on time, or with errors")
````
### 参考文章
参考如下：
    https://codecalamity.com/threadpools-explained-in-the-deep-end/
    https://stackoverflow.com/questions/1408356/keyboard-interrupts-with-pythons-multiprocessing-pool/6191991#6191991
