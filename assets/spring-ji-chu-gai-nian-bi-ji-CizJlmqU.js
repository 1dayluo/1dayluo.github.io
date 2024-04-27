import{_ as o}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRVqeRiY.js";import{a as E,p as k,o as d,c,w as a,f as g,r as t,g as i,h as s}from"./app-CzjF7NIc.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-17i98rOK.js";import"./YunCard.vue_vue_type_script_setup_true_lang-Da3dkqK-.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-BsneHNVS.js";import"./index-C7yU5XnD.js";const y=i("p",null,"基于廖雪峰老师网站所做的java学习笔记。为了快速审计java代码，而非开发~",-1),u=i("h2",{id:"ioc",tabindex:"-1"},[s("IOC "),i("a",{class:"header-anchor",href:"#ioc","aria-label":'Permalink to "IOC"'},"​")],-1),F=i("p",null,[i("strong",null,"Ioc容器"),s("，负责把一些service和datasource包装起来，并且管理创建和销毁")],-1),m=i("p",null,[i("strong",null,"Bean"),s("， 一些service，例如用户注册，登陆，邮箱发送。。。这些会反复用到的.定义用[Annotation](("),i("a",{href:"https://www.liaoxuefeng.com/wiki/1252599548343744/1282382596407330",target:"_blank",rel:"noreferrer"},"https://www.liaoxuefeng.com/wiki/1252599548343744/1282382596407330"),s(")，即"),i("code",null,"@Component"),s(" 注解的方式, 和 "),i("code",null,"@Autowired"),s("注解，将指定Bean注入到指定字段中。其他注解：")],-1),A=i("ul",null,[i("li",null,[i("code",null,"@Configuration"),s(" : 配置类，包括创建第三方Bean")]),i("li",null,[i("code",null,"@ComponentScan"),s("： 配置类同时会用这个Annotation，用于自动搜索当前类所在的包以及子包，把所有标注为"),i("code",null,"@Component"),s("的Bean自动创建出来，并根据"),i("code",null,"@Autowired"),s("进行装配。")]),i("li",null,"@Autowired(required = false) 注入Bean，但如果没有则忽略"),i("li",null,[i("code",null,"@PostConstruct"),s("和"),i("code",null,"@PreDestroy"),s(" ： Bean的垃圾清理机制，对清理方法标记")])],-1),_=i("p",null,[s("Bean系统中一个数据库事务中被调用，则使用 "),i("code",null,"@Transactional"),s(" 注解 除此之外，还有"),i("code",null,"Prototype"),s("的Bean，需要 "),i("code",null,"@Scope"),s("注解，第三方Bean，则需要 "),i("code",null,"@Bean"),s(" 注解。 "),i("strong",null,[s("注入配置("),i("code",null,".properties"),s("文件)：")]),s(" 注入方法1: 使用 "),i("code",null,"@PropertySource"),s("注解（例如"),i("code",null,'@PropertySource("app.properties"))，在'),s("@Configuration`配置类上加注解。")],-1),f=i("div",{class:"language-java vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"java"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Value"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${smtp.port:25}"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    private"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," int"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," port;")])])]),i("button",{class:"collapse"})],-1),b=i("p",null,[s("上述，"),i("code",null,'@Value("${smtp.port:25}")'),s(" 的用法为读取"),i("a",{href:"https://www.liaoxuefeng.com/wiki/1252599548343744/1282383225552930",target:"_blank",rel:"noreferrer"},"默认值"),s("。 注入方法2: 在Bean上直接用 "),i("code",null,'@Value("${smtp.port:25}")'),s(" , 然后，也可以用 "),i("code",null,'@Value("#{smtpConfig.host}")'),s("读取Bean下的host值（没有注解的变量也可以）。"),i("code",null,"#{}"),s("表示从JavaBean读取属性 此外，java分不同的环境，例如开发（native/dev），测试（test），生产（prod），则需要用条件装配：")],-1),v=i("div",{class:"language-java vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"java"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Configuration")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"ComponentScan")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"public"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," class"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," AppConfig"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    @"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Bean")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    @"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Profile"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"!test"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    ZoneId "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"createZoneId"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        return"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ZoneId."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"systemDefault"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    @"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Bean")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    @"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Profile"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"test"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    ZoneId "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"createZoneIdForTest"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        return"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ZoneId."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"of"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"America/New_York"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},");")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),i("button",{class:"collapse"})],-1),B=i("p",null,[s("除此之外，还可以用 "),i("code",null,"@Conditional"),s(" 决定是否创建某个Bean， 案例见"),i("a",{href:"https://www.liaoxuefeng.com/wiki/1252599548343744/13080438746644820",target:"_blank",rel:"noreferrer"},"这个"),s("，还有：")],-1),C=i("ul",null,[i("li",null,[i("code",null,'@ConditionalOnProperty(name="app.smtp", havingValue="true")')]),i("li",null,[i("code",null,'@ConditionalOnClass(name = "javax.mail.Transport")')])],-1),D=i("h2",{id:"aop",tabindex:"-1"},[s("AOP "),i("a",{class:"header-anchor",href:"#aop","aria-label":'Permalink to "AOP"'},"​")],-1),j=i("p",null,"AOP包括以下概念：",-1),P=i("ul",null,[i("li",null,"Aspect：切面，即一个横跨多个核心逻辑的功能，或者称之为系统关注点；"),i("li",null,"Joinpoint：连接点，即定义在应用程序流程的何处插入切面的执行；"),i("li",null,"Pointcut：切入点，即一组连接点的集合；"),i("li",null,"Advice：增强，指特定连接点上执行的动作；"),i("li",null,"Introduction：引介，指为一个已有的Java对象动态地增加新的接口；"),i("li",null,"Weaving：织入，指将切面整合到程序的执行流程中；"),i("li",null,"Interceptor：拦截器，是一种实现增强的方式；"),i("li",null,"Target Object：目标对象，即真正执行业务的核心逻辑对象；"),i("li",null,"AOP Proxy：AOP代理，是客户端持有的增强后的对象引用。 通过AOP可以将指定的方法装配到指定Bean的前后")],-1),S=i("p",null,"Aspect相关注解/拦截器类型 拦截器：",-1),w=i("ul",null,[i("li",null,[i("code",null,"@Aspect"),s(" : 表明是一个Aspect")]),i("li",null,[i("code",null,"@Before"),s("： 标注的方法在注入到指定Service的每个public方法执行前")]),i("li",null,[i("code",null,"@Around"),s(" ： 标注的方法在注入到指定Service的每个public方法执行后")])],-1),M=i("p",null,[s("案例还是看"),i("a",{href:"https://www.liaoxuefeng.com/wiki/1252599548343744/1310052352786466",target:"_blank",rel:"noreferrer"},"教程"),s("写的 同时，例如于配置的类，需要加注解 "),i("code",null,"@EnableAspectJAutoProxy"),s(" 表示自动查找Aspect的Bean 另外这里还可以自定义注解, 任何有@MetricTIme注解的方法， 则调用 "),i("code",null,"metric()"),s(" 方法:")],-1),T=i("div",{class:"language-java vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"java"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Aspect")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Component")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"public"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," class"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," MetricAspect"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    @"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Around"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"@annotation(metricTime)"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    public"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," Object "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"metric"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(ProceedingJoinPoint "),i("span",{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"}},"joinPoint"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", MetricTime "),i("span",{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"}},"metricTime"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"throws"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," Throwable {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        String name "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," metricTime."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"value"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        long"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," start "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," System."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"currentTimeMillis"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        try"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"            return"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," joinPoint."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"proceed"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        } "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"finally"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"            long"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," t "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," System."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"currentTimeMillis"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," start;")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"            // 写入日志或发送至JMX:")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            System.err."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"println"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"[Metrics] "'),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," name "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' ": "'),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," t "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "ms"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},");")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        }")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),i("button",{class:"collapse"})],-1),O=i("h3",{id:"数据库",tabindex:"-1"},[s("数据库 "),i("a",{class:"header-anchor",href:"#数据库","aria-label":'Permalink to "数据库"'},"​")],-1),$=i("p",null,[i("strong",null,"jdbc"),s(" spring提供了使用jdbc访问数据库的方法，例如用 "),i("code",null,'@PropertySource("jdbc.properties")'),s(" 读取数据库配置文件，同样也是加载配置类上的。spring还提供了 JdbcTemplate的方式：")],-1),I=i("div",{class:"language-java vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"java"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"return"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," jdbcTemplate."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"execute"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"((Connection conn) "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"->"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"	// ...")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"return"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," jdbcTemplate."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"execute"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"SELECT * FROM users WHERE name = ?"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", (PreparedStatement ps) "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"->"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"	// ...")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),i("button",{class:"collapse"})],-1),R=i("p",null,[s("更多的jdbcTemplate的数据库查询案例见"),i("a",{href:"https://www.liaoxuefeng.com/wiki/1252599548343744/1282383699509281",target:"_blank",rel:"noreferrer"},"原文")],-1),x=i("p",null,[i("strong",null,"事务"),s(" spring为了同时支持jdbc和jta（分布式）两种事务类型，抽象出 "),i("code",null,"PlatformTransactionManager"),s(", 除了在配置类下，定义出"),i("code",null,"PlatformTransactionManger"),s("外，还要加 "),i("code",null,"@EnableTransactionManagement"),s(" 用于支持声明式事务。 使用到事务的方法，则加一个 "),i("code",null,"@Transactional"),s("注解 / 或加在类上，表示任何public方法都支持事务")],-1),J=i("ul",null,[i("li",null,[s("需要回滚的事务注解："),i("code",null,"@Transactional(rollbackFor = {RuntimeException.class, IOException.class})")]),i("li",null,"复杂的事务场景：需要定义事务传播模型")],-1),q=i("p",null,[i("strong",null,"集成Hibernate"),s(" 实现orm到java对象互换")],-1),V=i("p",null,[i("strong",null,"JPA"),s(" 一个ORM标准，但只是提供接口，依旧需要一些”实现“，例如Hibernate就是JPA的实现")],-1),Z=i("p",null,[s("Hibernate和JPA需要用到"),i("code",null,"SessionFactory"),s("与"),i("code",null,"EntityManagerFactory")],-1),U=i("p",null,[i("strong",null,"Proxy模式"),s(" 为了获取Bean的更改及时同步到数据库，需要创建代理类。例如一些实现用户注册，登陆的User类，让UserProxy继承User类，同时这个代理类必须保持session，事务提交session关闭。但，为了关闭后，依旧获取事务一致的数据，引入了Attached/Datached状态，用于记录Bean是否在session范围内。 ORM还提供了多级缓存，用于多次查询返回同一实例")],-1),H=i("p",null,[i("strong",null,"全自动ORM/半自动ORM")],-1),L=i("p",null,"全自动ORM相对于jdbcTemplate有以下差别：",-1),N=i("ol",null,[i("li",null,"查询后需要手动提供Mapper实例以便把ResultSet的每一行变为Java对象；"),i("li",null,[s("增删改操作所需的参数列表，需要手动传入，即把User实例变为["),i("a",{href:"http://user.id/",target:"_blank",rel:"noreferrer"},"user.id"),s(", "),i("a",{href:"http://user.name/",target:"_blank",rel:"noreferrer"},"user.name"),s(", user.email]这样的列表，比较麻烦。 jdbcTemplate有确定性，缺点是代码繁琐，ORM则有多个缓存，在二级缓存增大了数据的不一致性，可能会意外更新。所以产生了半自动ORM 半自动ORM框架常见的就是MyBatis，")])],-1),W=i("p",null,[i("strong",null,"MyBaitis"),s(" 需要创建 "),i("code",null,"SqlSessionFactoryBean")],-1),X=i("div",{class:"language-java vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"java"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Bean")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"SqlSessionFactoryBean "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"createSqlSessionFactoryBean"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Autowired"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," DataSource dataSource) {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    var"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," sqlSessionFactoryBean "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," new"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," SqlSessionFactoryBean"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    sqlSessionFactoryBean."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"setDataSource"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(dataSource);")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    return"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," sqlSessionFactoryBean;")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}```")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"另外，Mybatis使用Mapper来实现映射，且Mapper必须是接口。例如")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"```java")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"public"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," interface"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," UserMapper"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"	@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Select"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"SELECT * FROM users WHERE id = #{id}"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"	User "),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"getById"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(@"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"Param"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"id"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"long"),i("span",{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"}}," id"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},");")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),i("button",{class:"collapse"})],-1),Y=i("p",null,[s("如果插入不需要传入 "),i("code",null,"id"),s(" 但是需要获取插入后的主键，需要加 "),i("code",null,"@Options"),s("注解。 使用 "),i("code",null,"@MapperScan"),s("自动创建Mapper实现类，将多个不同的Mapper接口自动创建接口实现。")],-1),ei={__name:"spring-ji-chu-gai-nian-bi-ji",setup(z,{expose:r}){const e=JSON.parse('{"title":"spring 基础概念笔记","description":"","frontmatter":{"title":"spring 基础概念笔记","date":"2024-01-09T21:46:37.000Z","tags":["java","学习笔记"],"published":true,"hideInList":false,"feature":null,"isTop":false},"headers":[{"level":2,"title":"IOC","slug":"ioc","link":"#ioc","children":[]},{"level":2,"title":"AOP","slug":"aop","link":"#aop","children":[{"level":3,"title":"数据库","slug":"数据库","link":"#数据库","children":[]}]}],"relativePath":"pages/posts/history/spring-ji-chu-gai-nian-bi-ji.md","path":"/home/runner/work/1dayluo.github.io/1dayluo.github.io/pages/posts/history/spring-ji-chu-gai-nian-bi-ji.md","lastUpdated":1714218709000}'),h=E(),n=e.frontmatter||{};return h.meta.frontmatter=Object.assign(h.meta.frontmatter||{},e.frontmatter||{}),k("pageData",e),k("valaxy:frontmatter",n),globalThis.$frontmatter=n,r({frontmatter:{title:"spring 基础概念笔记",date:"2024-01-09T21:46:37.000Z",tags:["java","学习笔记"],published:!0,hideInList:!1,feature:null,isTop:!1}}),(l,K)=>{const p=o;return d(),c(p,{frontmatter:g(n)},{"main-content-md":a(()=>[y,u,F,m,A,_,f,b,v,B,C,D,j,P,S,w,M,T,O,$,I,R,x,J,q,V,Z,U,H,L,N,W,X,Y]),"main-header":a(()=>[t(l.$slots,"main-header")]),"main-header-after":a(()=>[t(l.$slots,"main-header-after")]),"main-nav":a(()=>[t(l.$slots,"main-nav")]),"main-content":a(()=>[t(l.$slots,"main-content")]),"main-content-after":a(()=>[t(l.$slots,"main-content-after")]),"main-nav-before":a(()=>[t(l.$slots,"main-nav-before")]),"main-nav-after":a(()=>[t(l.$slots,"main-nav-after")]),comment:a(()=>[t(l.$slots,"comment")]),footer:a(()=>[t(l.$slots,"footer")]),aside:a(()=>[t(l.$slots,"aside")]),"aside-custom":a(()=>[t(l.$slots,"aside-custom")]),default:a(()=>[t(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{ei as default};
