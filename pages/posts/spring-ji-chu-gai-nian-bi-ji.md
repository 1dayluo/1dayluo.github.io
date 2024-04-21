---
title: 'spring 基础概念笔记'
date: 2024-01-09 21:46:37
tags: [java,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---


基于廖雪峰老师网站所做的java学习笔记。为了快速审计java代码，而非开发~


## IOC

**Ioc容器**，负责把一些service和datasource包装起来，并且管理创建和销毁

**Bean**， 一些service，例如用户注册，登陆，邮箱发送。。。这些会反复用到的.定义用[Annotation](([https://www.liaoxuefeng.com/wiki/1252599548343744/1282382596407330](https://www.liaoxuefeng.com/wiki/1252599548343744/1282382596407330))，即`@Component` 注解的方式, 和 `@Autowired`注解，将指定Bean注入到指定字段中。其他注解：

- `@Configuration` : 配置类，包括创建第三方Bean
- `@ComponentScan`： 配置类同时会用这个Annotation，用于自动搜索当前类所在的包以及子包，把所有标注为`@Component`的Bean自动创建出来，并根据`@Autowired`进行装配。
- @Autowired(required = false) 注入Bean，但如果没有则忽略
- `@PostConstruct`和`@PreDestroy` ： Bean的垃圾清理机制，对清理方法标记

Bean系统中一个数据库事务中被调用，则使用 `@Transactional` 注解
除此之外，还有`Prototype`的Bean，需要 `@Scope`注解，第三方Bean，则需要 `@Bean`
注解。
**注入配置(`.properties`文件)：**
注入方法1: 使用 `@PropertySource`注解（例如`@PropertySource("app.properties"))，在`@Configuration`配置类上加注解。

```java
@Value("${smtp.port:25}")
    private int port;

```

上述，`@Value("${smtp.port:25}")` 的用法为读取[默认值](https://www.liaoxuefeng.com/wiki/1252599548343744/1282383225552930)。
注入方法2: 在Bean上直接用 `@Value("${smtp.port:25}")` , 然后，也可以用 `@Value("#{smtpConfig.host}")`读取Bean下的host值（没有注解的变量也可以）。`#{}`表示从JavaBean读取属性
此外，java分不同的环境，例如开发（native/dev），测试（test），生产（prod），则需要用条件装配：

```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean
    @Profile("!test")
    ZoneId createZoneId() {
        return ZoneId.systemDefault();
    }

    @Bean
    @Profile("test")
    ZoneId createZoneIdForTest() {
        return ZoneId.of("America/New_York");
    }
}

```

除此之外，还可以用 `@Conditional` 决定是否创建某个Bean， 案例见[这个](https://www.liaoxuefeng.com/wiki/1252599548343744/13080438746644820)，还有：

- `@ConditionalOnProperty(name="app.smtp", havingValue="true")`
- `@ConditionalOnClass(name = "javax.mail.Transport")`

## AOP

AOP包括以下概念：

- Aspect：切面，即一个横跨多个核心逻辑的功能，或者称之为系统关注点；
- Joinpoint：连接点，即定义在应用程序流程的何处插入切面的执行；
- Pointcut：切入点，即一组连接点的集合；
- Advice：增强，指特定连接点上执行的动作；
- Introduction：引介，指为一个已有的Java对象动态地增加新的接口；
- Weaving：织入，指将切面整合到程序的执行流程中；
- Interceptor：拦截器，是一种实现增强的方式；
- Target Object：目标对象，即真正执行业务的核心逻辑对象；
- AOP Proxy：AOP代理，是客户端持有的增强后的对象引用。
通过AOP可以将指定的方法装配到指定Bean的前后

Aspect相关注解/拦截器类型
拦截器：

- `@Aspect` : 表明是一个Aspect
- `@Before`： 标注的方法在注入到指定Service的每个public方法执行前
- `@Around` ： 标注的方法在注入到指定Service的每个public方法执行后

案例还是看[教程](https://www.liaoxuefeng.com/wiki/1252599548343744/1310052352786466)写的
同时，例如于配置的类，需要加注解 `@EnableAspectJAutoProxy` 表示自动查找Aspect的Bean
另外这里还可以自定义注解, 任何有@MetricTIme注解的方法， 则调用 `metric()` 方法:

```java
@Aspect
@Component
public class MetricAspect {
    @Around("@annotation(metricTime)")
    public Object metric(ProceedingJoinPoint joinPoint, MetricTime metricTime) throws Throwable {
        String name = metricTime.value();
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long t = System.currentTimeMillis() - start;
            // 写入日志或发送至JMX:
            System.err.println("[Metrics] " + name + ": " + t + "ms");
        }
    }
}

```

### 数据库

**jdbc**
spring提供了使用jdbc访问数据库的方法，例如用 `@PropertySource("jdbc.properties")` 读取数据库配置文件，同样也是加载配置类上的。spring还提供了 JdbcTemplate的方式：

```java
return jdbcTemplate.execute((Connection conn) -> {

	// ...
}
return jdbcTemplate.execute("SELECT * FROM users WHERE name = ?", (PreparedStatement ps) -> {
	// ...
}

```

更多的jdbcTemplate的数据库查询案例见[原文](https://www.liaoxuefeng.com/wiki/1252599548343744/1282383699509281)

**事务**
spring为了同时支持jdbc和jta（分布式）两种事务类型，抽象出 `PlatformTransactionManager`, 除了在配置类下，定义出`PlatformTransactionManger`外，还要加 `@EnableTransactionManagement` 用于支持声明式事务。
使用到事务的方法，则加一个 `@Transactional`注解 / 或加在类上，表示任何public方法都支持事务

- 需要回滚的事务注解：`@Transactional(rollbackFor = {RuntimeException.class, IOException.class})`
- 复杂的事务场景：需要定义事务传播模型

**集成Hibernate**
实现orm到java对象互换

**JPA**
一个ORM标准，但只是提供接口，依旧需要一些”实现“，例如Hibernate就是JPA的实现

Hibernate和JPA需要用到`SessionFactory`与`EntityManagerFactory`

**Proxy模式**
为了获取Bean的更改及时同步到数据库，需要创建代理类。例如一些实现用户注册，登陆的User类，让UserProxy继承User类，同时这个代理类必须保持session，事务提交session关闭。但，为了关闭后，依旧获取事务一致的数据，引入了Attached/Datached状态，用于记录Bean是否在session范围内。
ORM还提供了多级缓存，用于多次查询返回同一实例

**全自动ORM/半自动ORM**

全自动ORM相对于jdbcTemplate有以下差别：

1. 查询后需要手动提供Mapper实例以便把ResultSet的每一行变为Java对象；
2. 增删改操作所需的参数列表，需要手动传入，即把User实例变为[[user.id](http://user.id/), [user.name](http://user.name/), user.email]这样的列表，比较麻烦。
jdbcTemplate有确定性，缺点是代码繁琐，ORM则有多个缓存，在二级缓存增大了数据的不一致性，可能会意外更新。所以产生了半自动ORM
半自动ORM框架常见的就是MyBatis，

**MyBaitis**
需要创建 `SqlSessionFactoryBean`

```java
@Bean
SqlSessionFactoryBean createSqlSessionFactoryBean(@Autowired DataSource dataSource) {
    var sqlSessionFactoryBean = new SqlSessionFactoryBean();
    sqlSessionFactoryBean.setDataSource(dataSource);
    return sqlSessionFactoryBean;
}```
另外，Mybatis使用Mapper来实现映射，且Mapper必须是接口。例如
```java
public interface UserMapper {
	@Select("SELECT * FROM users WHERE id = #{id}")
	User getById(@Param("id") long id);
}
```

如果插入不需要传入 `id` 但是需要获取插入后的主键，需要加 `@Options`注解。
使用 `@MapperScan`自动创建Mapper实现类，将多个不同的Mapper接口自动创建接口实现。