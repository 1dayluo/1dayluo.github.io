---
title: '理解TLS'
date: 2020-06-30 15:52:47
tags: [学习笔记,python]
published: true
hideInList: false
feature: http://pic.netbian.com/uploads/allimg/200627/004311-15931897916db2.jpg
isTop: false
---


## 为什么需要TLS
前提：每个线程都有TLS
如果我们要在多线程中对全局变量(`Global Variable`)进行操作，除了保护多个线程对该变量内存读写不会有影响（加锁)，同时也要保证在单个线程在某些不可控状态下对其进行修改时，程序不会因此发生产生影响，例如崩溃。
那么，我们不定义全局变量，将其定义为局部变量，但是即使是局部变量在函数调用的时候，传递该参数又很麻烦。例如
````python
def process_student(name):
    std = Student(name)
    # std是局部变量，但是每个函数都要用它，因此必须传进去：
    do_task_1(std)
    do_task_2(std)

def do_task_1(std):
    do_subtask_1(std)
    do_subtask_2(std)

def do_task_2(std):
    do_subtask_2(std)
    do_subtask_2(std)
````

在用全局变量和局部变量都会产生如此窘迫的情况下，产生了TLS的概念。同时也是为了代码更加的整洁/布局合理（搞技术的老毛病，完美主义+强迫症?)



## 什么是ThreadLocal变量
ThreadLocal变量，也就是线程本地变量，它会为每个使用该变量的线程维护一个变量的副本，在某个线程中，对该变量的修改，只会改变自己的副本，不会影响其他的线程的副本。
例如(这个例子可能不是很好），我在实际应用场景中有如下需求，我要在单条线程中处理和保存一个变量，类型为`list` ，并且在每次当前线程中的`for`循环中我会对这个list进行操作。这样我避免了每次在 `process_id`函数的位置都不得不传入last_id变量。


````python
import  threading
import multiprocessing
import signal
import time

last_id = threading.local()
def process_id(id):
    last_id.val.append(id)
    return last_id

def key_processing(id):
    if id is not None :
        filter = {'_id':{'$gte': id}}
    else:
        filter = {}
    last_id.val = []
    for i in range(20):
        # save_id = i + 2
        save_id = process_id(i)
        print(save_id.val)


def init_worker():
    signal.signal(signal.SIGINT, signal.SIG_IGN)
def main():
    pool = multiprocessing.Pool(3, init_worker)
    idlist = [ i for i in range(10)]
    try:
        results = []
        for id in idlist:
            results.append(pool.apply_async(key_processing, (id,)))
            # results.append(pool.apply_async(coroutine_process, (key_processing,id,)))
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
    finally:

        pass

if __name__ == '__main__':
    main()
````
这样做的好处除了在比案例更复杂的场景使代码看起来规范，整齐外，在PEP266中有提，ThreadLocal变量是可以减少指令加速运算的，因为全局变量往往需要更多的指令。

## 参考文章

 [深入理解Python的TLS机制和Threading.local()](https://zhuanlan.zhihu.com/p/60126952)
  [python-thread-local](http://timd.cn/python-thread-local/)