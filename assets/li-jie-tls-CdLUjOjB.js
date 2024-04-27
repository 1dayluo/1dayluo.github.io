import{_ as E}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRVqeRiY.js";import{a as d,p as k,o,c as g,w as a,f as y,r as t,g as s,h as i}from"./app-CzjF7NIc.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-17i98rOK.js";import"./YunCard.vue_vue_type_script_setup_true_lang-Da3dkqK-.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-BsneHNVS.js";import"./index-C7yU5XnD.js";const c=s("h2",{id:"为什么需要tls",tabindex:"-1"},[i("为什么需要TLS "),s("a",{class:"header-anchor",href:"#为什么需要tls","aria-label":'Permalink to "为什么需要TLS"'},"​")],-1),F=s("p",null,[i("前提：每个线程都有TLS 如果我们要在多线程中对全局变量("),s("code",null,"Global Variable"),i(")进行操作，除了保护多个线程对该变量内存读写不会有影响（加锁)，同时也要保证在单个线程在某些不可控状态下对其进行修改时，程序不会因此发生产生影响，例如崩溃。 那么，我们不定义全局变量，将其定义为局部变量，但是即使是局部变量在函数调用的时候，传递该参数又很麻烦。例如")],-1),m=s("div",{class:"language-python vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"python"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," process_student"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(name):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    std "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," Student(name)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"    # std是局部变量，但是每个函数都要用它，因此必须传进去：")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    do_task_1(std)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    do_task_2(std)")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," do_task_1"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(std):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    do_subtask_1(std)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    do_subtask_2(std)")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," do_task_2"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(std):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    do_subtask_2(std)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    do_subtask_2(std)")])])]),s("button",{class:"collapse"})],-1),_=s("p",null,"在用全局变量和局部变量都会产生如此窘迫的情况下，产生了TLS的概念。同时也是为了代码更加的整洁/布局合理（搞技术的老毛病，完美主义+强迫症?)",-1),u=s("h2",{id:"什么是threadlocal变量",tabindex:"-1"},[i("什么是ThreadLocal变量 "),s("a",{class:"header-anchor",href:"#什么是threadlocal变量","aria-label":'Permalink to "什么是ThreadLocal变量"'},"​")],-1),C=s("p",null,[i("ThreadLocal变量，也就是线程本地变量，它会为每个使用该变量的线程维护一个变量的副本，在某个线程中，对该变量的修改，只会改变自己的副本，不会影响其他的线程的副本。 例如(这个例子可能不是很好），我在实际应用场景中有如下需求，我要在单条线程中处理和保存一个变量，类型为"),s("code",null,"list"),i(" ，并且在每次当前线程中的"),s("code",null,"for"),i("循环中我会对这个list进行操作。这样我避免了每次在 "),s("code",null,"process_id"),i("函数的位置都不得不传入last_id变量。")],-1),f=s("div",{class:"language-python vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"python"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  threading")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," multiprocessing")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," signal")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," time")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"last_id "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," threading.local()")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," process_id"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(id):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    last_id.val.append("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"id"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    return"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," last_id")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," key_processing"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(id):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    if"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," id"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," is"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," not"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," None"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," :")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"        filter"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," ="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'_id'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":{"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'$gte'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"id"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}}")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    else"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"        filter"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," ="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," {}")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    last_id.val "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," []")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," range"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"20"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"        # save_id = i + 2")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        save_id "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," process_id(i)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"        print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(save_id.val)")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," init_worker"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"():")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    signal.signal(signal."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"SIGINT"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", signal."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"SIG_IGN"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"def"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," main"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"():")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    pool "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," multiprocessing.Pool("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"3"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", init_worker)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    idlist "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [ i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," range"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")]")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    try"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        results "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," []")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        for"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," id"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," in"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," idlist:")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            results.append(pool.apply_async(key_processing, ("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"id"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},",)))")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"            # results.append(pool.apply_async(coroutine_process, (key_processing,id,)))")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        pool.close()")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        while"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," True"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"            if"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," all"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(r.ready() "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," r "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," results):")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"                print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"All processes completed"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"                return")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            time.sleep("),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    except"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," KeyboardInterrupt"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"        print"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"Caught KeyboardInterrupt, terminating workers"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        pool.terminate()")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        pool.join()")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    finally"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        pass")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," __name__"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," =="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," '__main__'"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    main()")])])]),s("button",{class:"collapse"})],-1),A=s("p",null,"这样做的好处除了在比案例更复杂的场景使代码看起来规范，整齐外，在PEP266中有提，ThreadLocal变量是可以减少指令加速运算的，因为全局变量往往需要更多的指令。",-1),D=s("h2",{id:"参考文章",tabindex:"-1"},[i("参考文章 "),s("a",{class:"header-anchor",href:"#参考文章","aria-label":'Permalink to "参考文章"'},"​")],-1),B=s("p",null,[s("a",{href:"https://zhuanlan.zhihu.com/p/60126952",target:"_blank",rel:"noreferrer"},"深入理解Python的TLS机制和Threading.local()"),s("a",{href:"http://timd.cn/python-thread-local/",target:"_blank",rel:"noreferrer"},"python-thread-local")],-1),w={__name:"li-jie-tls",setup(b,{expose:r}){const h=JSON.parse('{"title":"理解TLS","description":"","frontmatter":{"title":"理解TLS","date":"2020-06-30T15:52:47.000Z","tags":["学习笔记","python"],"published":true,"hideInList":false,"feature":"http://pic.netbian.com/uploads/allimg/200627/004311-15931897916db2.jpg","isTop":false},"headers":[{"level":2,"title":"为什么需要TLS","slug":"为什么需要tls","link":"#为什么需要tls","children":[]},{"level":2,"title":"什么是ThreadLocal变量","slug":"什么是threadlocal变量","link":"#什么是threadlocal变量","children":[]},{"level":2,"title":"参考文章","slug":"参考文章","link":"#参考文章","children":[]}],"relativePath":"pages/posts/history/li-jie-tls.md","path":"/home/runner/work/1dayluo.github.io/1dayluo.github.io/pages/posts/history/li-jie-tls.md","lastUpdated":1714218709000}'),e=d(),n=h.frontmatter||{};return e.meta.frontmatter=Object.assign(e.meta.frontmatter||{},h.frontmatter||{}),k("pageData",h),k("valaxy:frontmatter",n),globalThis.$frontmatter=n,r({frontmatter:{title:"理解TLS",date:"2020-06-30T15:52:47.000Z",tags:["学习笔记","python"],published:!0,hideInList:!1,feature:"http://pic.netbian.com/uploads/allimg/200627/004311-15931897916db2.jpg",isTop:!1}}),(l,T)=>{const p=E;return o(),g(p,{frontmatter:y(n)},{"main-content-md":a(()=>[c,F,m,_,u,C,f,A,D,B]),"main-header":a(()=>[t(l.$slots,"main-header")]),"main-header-after":a(()=>[t(l.$slots,"main-header-after")]),"main-nav":a(()=>[t(l.$slots,"main-nav")]),"main-content":a(()=>[t(l.$slots,"main-content")]),"main-content-after":a(()=>[t(l.$slots,"main-content-after")]),"main-nav-before":a(()=>[t(l.$slots,"main-nav-before")]),"main-nav-after":a(()=>[t(l.$slots,"main-nav-after")]),comment:a(()=>[t(l.$slots,"comment")]),footer:a(()=>[t(l.$slots,"footer")]),aside:a(()=>[t(l.$slots,"aside")]),"aside-custom":a(()=>[t(l.$slots,"aside-custom")]),default:a(()=>[t(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{w as default};