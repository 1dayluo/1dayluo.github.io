/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...path]': RouteRecordInfo<'/[...path]', '/:path(.*)', { path: ParamValue<true> }, { path: ParamValue<false> }>,
    '/404': RouteRecordInfo<'/404', '/404', Record<never, never>, Record<never, never>>,
    '/about/': RouteRecordInfo<'/about/', '/about', Record<never, never>, Record<never, never>>,
    '/about/site': RouteRecordInfo<'/about/site', '/about/site', Record<never, never>, Record<never, never>>,
    '/archives/': RouteRecordInfo<'/archives/', '/archives', Record<never, never>, Record<never, never>>,
    '/categories/': RouteRecordInfo<'/categories/', '/categories', Record<never, never>, Record<never, never>>,
    '/links/': RouteRecordInfo<'/links/', '/links', Record<never, never>, Record<never, never>>,
    '/page/[page]': RouteRecordInfo<'/page/[page]', '/page/:page', { page: ParamValue<true> }, { page: ParamValue<false> }>,
    '/posts/2022-nian-zong-jie': RouteRecordInfo<'/posts/2022-nian-zong-jie', '/posts/2022-nian-zong-jie', Record<never, never>, Record<never, never>>,
    '/posts/20220714-hui-tou-kan-wang-qian-zou': RouteRecordInfo<'/posts/20220714-hui-tou-kan-wang-qian-zou', '/posts/20220714-hui-tou-kan-wang-qian-zou', Record<never, never>, Record<never, never>>,
    '/posts/about': RouteRecordInfo<'/posts/about', '/posts/about', Record<never, never>, Record<never, never>>,
    '/posts/avatar-de-gong-neng-shi-xian-xue-xi-bi-ji': RouteRecordInfo<'/posts/avatar-de-gong-neng-shi-xian-xue-xi-bi-ji', '/posts/avatar-de-gong-neng-shi-xian-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/aws-chang-jian-an-quan-wen-ti-zong-jie-yi': RouteRecordInfo<'/posts/aws-chang-jian-an-quan-wen-ti-zong-jie-yi', '/posts/aws-chang-jian-an-quan-wen-ti-zong-jie-yi', Record<never, never>, Record<never, never>>,
    '/posts/burpsuite-labauthentication-bypass-via-encryption-oracle': RouteRecordInfo<'/posts/burpsuite-labauthentication-bypass-via-encryption-oracle', '/posts/burpsuite-labauthentication-bypass-via-encryption-oracle', Record<never, never>, Record<never, never>>,
    '/posts/cc-pen-testingorwriteupornote': RouteRecordInfo<'/posts/cc-pen-testingorwriteupornote', '/posts/cc-pen-testingorwriteupornote', Record<never, never>, Record<never, never>>,
    '/posts/cc1-lian-xue-xi-bi-ji': RouteRecordInfo<'/posts/cc1-lian-xue-xi-bi-ji', '/posts/cc1-lian-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/code-audit-challengesphp-shua-ti-ji-lu-li-shi-bi-ji': RouteRecordInfo<'/posts/code-audit-challengesphp-shua-ti-ji-lu-li-shi-bi-ji', '/posts/code-audit-challengesphp-shua-ti-ji-lu-li-shi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/cve-2018-0114': RouteRecordInfo<'/posts/cve-2018-0114', '/posts/cve-2018-0114', Record<never, never>, Record<never, never>>,
    '/posts/cve-2023-50164-lou-dong-fen-xi-yu-xue-xi': RouteRecordInfo<'/posts/cve-2023-50164-lou-dong-fen-xi-yu-xue-xi', '/posts/cve-2023-50164-lou-dong-fen-xi-yu-xue-xi', Record<never, never>, Record<never, never>>,
    '/posts/geng-xin-liao-blog-nei-de-htb-de-wen-zhang-she-zhi-jia-mi': RouteRecordInfo<'/posts/geng-xin-liao-blog-nei-de-htb-de-wen-zhang-she-zhi-jia-mi', '/posts/geng-xin-liao-blog-nei-de-htb-de-wen-zhang-she-zhi-jia-mi', Record<never, never>, Record<never, never>>,
    '/posts/gogs-rce-li-shi-lou-dong-xue-xi-bi-ji': RouteRecordInfo<'/posts/gogs-rce-li-shi-lou-dong-xue-xi-bi-ji', '/posts/gogs-rce-li-shi-lou-dong-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/google-dorking-learn': RouteRecordInfo<'/posts/google-dorking-learn', '/posts/google-dorking-learn', Record<never, never>, Record<never, never>>,
    '/posts/gruyereorbi-ji-yi-ge-web-ping-tai-de-lou-dong-xue-xi-bi-ji-': RouteRecordInfo<'/posts/gruyereorbi-ji-yi-ge-web-ping-tai-de-lou-dong-xue-xi-bi-ji-', '/posts/gruyereorbi-ji-yi-ge-web-ping-tai-de-lou-dong-xue-xi-bi-ji-', Record<never, never>, Record<never, never>>,
    '/posts/guan-yu-mu-lu-bian-li-lou-dong-zhong-fei-biao-zhun-bian-ma-c02f-he-c0af-jun-neng-dai-biao-qie-jun-zai-lou-dong-zhong-sheng-xiao-de-yuan-li-tan-suo': RouteRecordInfo<'/posts/guan-yu-mu-lu-bian-li-lou-dong-zhong-fei-biao-zhun-bian-ma-c02f-he-c0af-jun-neng-dai-biao-qie-jun-zai-lou-dong-zhong-sheng-xiao-de-yuan-li-tan-suo', '/posts/guan-yu-mu-lu-bian-li-lou-dong-zhong-fei-biao-zhun-bian-ma-c02f-he-c0af-jun-neng-dai-biao-qie-jun-zai-lou-dong-zhong-sheng-xiao-de-yuan-li-tan-suo', Record<never, never>, Record<never, never>>,
    '/posts/guan-yu-opener-de-xue-xi-ji-li-yong': RouteRecordInfo<'/posts/guan-yu-opener-de-xue-xi-ji-li-yong', '/posts/guan-yu-opener-de-xue-xi-ji-li-yong', Record<never, never>, Record<never, never>>,
    '/posts/htb-petpet-rcbee': RouteRecordInfo<'/posts/htb-petpet-rcbee', '/posts/htb-petpet-rcbee', Record<never, never>, Record<never, never>>,
    '/posts/htb-templated-or-writeup': RouteRecordInfo<'/posts/htb-templated-or-writeup', '/posts/htb-templated-or-writeup', Record<never, never>, Record<never, never>>,
    '/posts/htb-weather-App': RouteRecordInfo<'/posts/htb-weather-App', '/posts/htb-weather-App', Record<never, never>, Record<never, never>>,
    '/posts/htbbackend-api': RouteRecordInfo<'/posts/htbbackend-api', '/posts/htbbackend-api', Record<never, never>, Record<never, never>>,
    '/posts/htbencoding': RouteRecordInfo<'/posts/htbencoding', '/posts/htbencoding', Record<never, never>, Record<never, never>>,
    '/posts/htbforgot': RouteRecordInfo<'/posts/htbforgot', '/posts/htbforgot', Record<never, never>, Record<never, never>>,
    '/posts/htbmentor': RouteRecordInfo<'/posts/htbmentor', '/posts/htbmentor', Record<never, never>, Record<never, never>>,
    '/posts/htbphonebook-or-writeup': RouteRecordInfo<'/posts/htbphonebook-or-writeup', '/posts/htbphonebook-or-writeup', Record<never, never>, Record<never, never>>,
    '/posts/htbvessel': RouteRecordInfo<'/posts/htbvessel', '/posts/htbvessel', Record<never, never>, Record<never, never>>,
    '/posts/htbyi-dao-she-ji-dns-rebinding-attack-de-ti-wei-zuo-chu-lai': RouteRecordInfo<'/posts/htbyi-dao-she-ji-dns-rebinding-attack-de-ti-wei-zuo-chu-lai', '/posts/htbyi-dao-she-ji-dns-rebinding-attack-de-ti-wei-zuo-chu-lai', Record<never, never>, Record<never, never>>,
    '/posts/java-rmiremote-method-invocation': RouteRecordInfo<'/posts/java-rmiremote-method-invocation', '/posts/java-rmiremote-method-invocation', Record<never, never>, Record<never, never>>,
    '/posts/java-xue-xi-bi-ji-servlet': RouteRecordInfo<'/posts/java-xue-xi-bi-ji-servlet', '/posts/java-xue-xi-bi-ji-servlet', Record<never, never>, Record<never, never>>,
    '/posts/javascript-prototype-pollution-xue-xi-bi-ji': RouteRecordInfo<'/posts/javascript-prototype-pollution-xue-xi-bi-ji', '/posts/javascript-prototype-pollution-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/ji-zhu-fen-xiang-hui-wo-dui-yu-flask-jin-qi-li-jie-de-yi-ge-gao-zi': RouteRecordInfo<'/posts/ji-zhu-fen-xiang-hui-wo-dui-yu-flask-jin-qi-li-jie-de-yi-ge-gao-zi', '/posts/ji-zhu-fen-xiang-hui-wo-dui-yu-flask-jin-qi-li-jie-de-yi-ge-gao-zi', Record<never, never>, Record<never, never>>,
    '/posts/ji-zhu-yue-du-shuang-cha-xun-yuan-li': RouteRecordInfo<'/posts/ji-zhu-yue-du-shuang-cha-xun-yuan-li', '/posts/ji-zhu-yue-du-shuang-cha-xun-yuan-li', Record<never, never>, Record<never, never>>,
    '/posts/ji-zhu-yue-du-web-huan-cun-tou-du': RouteRecordInfo<'/posts/ji-zhu-yue-du-web-huan-cun-tou-du', '/posts/ji-zhu-yue-du-web-huan-cun-tou-du', Record<never, never>, Record<never, never>>,
    '/posts/ji-zhu-yue-du-yong-github-lai-shi-xian-lou-dong-shang-jin-xi-ren': RouteRecordInfo<'/posts/ji-zhu-yue-du-yong-github-lai-shi-xian-lou-dong-shang-jin-xi-ren', '/posts/ji-zhu-yue-du-yong-github-lai-shi-xian-lou-dong-shang-jin-xi-ren', Record<never, never>, Record<never, never>>,
    '/posts/jwt-crack-zong-jie': RouteRecordInfo<'/posts/jwt-crack-zong-jie', '/posts/jwt-crack-zong-jie', Record<never, never>, Record<never, never>>,
    '/posts/length-extension-attack': RouteRecordInfo<'/posts/length-extension-attack', '/posts/length-extension-attack', Record<never, never>, Record<never, never>>,
    '/posts/lesslesszseanos-methodogygreatergreater-xue-xi-bi-ji': RouteRecordInfo<'/posts/lesslesszseanos-methodogygreatergreater-xue-xi-bi-ji', '/posts/lesslesszseanos-methodogygreatergreater-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/li-jie-tls': RouteRecordInfo<'/posts/li-jie-tls', '/posts/li-jie-tls', Record<never, never>, Record<never, never>>,
    '/posts/linux-pian-pei-zhi-ni-de-aria2': RouteRecordInfo<'/posts/linux-pian-pei-zhi-ni-de-aria2', '/posts/linux-pian-pei-zhi-ni-de-aria2', Record<never, never>, Record<never, never>>,
    '/posts/linux-pian-pei-zhi-ni-de-aria2-wang-pan-xia-zai-dai-ti-xun-lei': RouteRecordInfo<'/posts/linux-pian-pei-zhi-ni-de-aria2-wang-pan-xia-zai-dai-ti-xun-lei', '/posts/linux-pian-pei-zhi-ni-de-aria2-wang-pan-xia-zai-dai-ti-xun-lei', Record<never, never>, Record<never, never>>,
    '/posts/markdown-tips': RouteRecordInfo<'/posts/markdown-tips', '/posts/markdown-tips', Record<never, never>, Record<never, never>>,
    '/posts/php-fan-xu-lie-hua-bi-ji': RouteRecordInfo<'/posts/php-fan-xu-lie-hua-bi-ji', '/posts/php-fan-xu-lie-hua-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/san-openvpn-lian-jie-htb-bao-cuo-xiu-fu-verfiy-error': RouteRecordInfo<'/posts/san-openvpn-lian-jie-htb-bao-cuo-xiu-fu-verfiy-error', '/posts/san-openvpn-lian-jie-htb-bao-cuo-xiu-fu-verfiy-error', Record<never, never>, Record<never, never>>,
    '/posts/sddm-and-i3-mei-hua-and-za-tan': RouteRecordInfo<'/posts/sddm-and-i3-mei-hua-and-za-tan', '/posts/sddm-and-i3-mei-hua-and-za-tan', Record<never, never>, Record<never, never>>,
    '/posts/shen-ru-qian-chu-ssrf-wo-de-xue-xi-bi-ji': RouteRecordInfo<'/posts/shen-ru-qian-chu-ssrf-wo-de-xue-xi-bi-ji', '/posts/shen-ru-qian-chu-ssrf-wo-de-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/shen-ru-qian-chu-ssrfer-wo-de-xue-xi-bi-ji': RouteRecordInfo<'/posts/shen-ru-qian-chu-ssrfer-wo-de-xue-xi-bi-ji', '/posts/shen-ru-qian-chu-ssrfer-wo-de-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/shi-yong-celery-rang-ren-wu-zai-hou-tai-yun-xing-wei-wan': RouteRecordInfo<'/posts/shi-yong-celery-rang-ren-wu-zai-hou-tai-yun-xing-wei-wan', '/posts/shi-yong-celery-rang-ren-wu-zai-hou-tai-yun-xing-wei-wan', Record<never, never>, Record<never, never>>,
    '/posts/shua-ti-shui-ti-memcache-an-quan-xiang-guan': RouteRecordInfo<'/posts/shua-ti-shui-ti-memcache-an-quan-xiang-guan', '/posts/shua-ti-shui-ti-memcache-an-quan-xiang-guan', Record<never, never>, Record<never, never>>,
    '/posts/spring-ji-chu-gai-nian-bi-ji': RouteRecordInfo<'/posts/spring-ji-chu-gai-nian-bi-ji', '/posts/spring-ji-chu-gai-nian-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/struts2-s2-001-xue-xi-bi-ji': RouteRecordInfo<'/posts/struts2-s2-001-xue-xi-bi-ji', '/posts/struts2-s2-001-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/synfony-rce-fen-xi': RouteRecordInfo<'/posts/synfony-rce-fen-xi', '/posts/synfony-rce-fen-xi', Record<never, never>, Record<never, never>>,
    '/posts/tui-jian-yi-xia-zi-ji-kai-fa-de-lun-tan-dan-han': RouteRecordInfo<'/posts/tui-jian-yi-xia-zi-ji-kai-fa-de-lun-tan-dan-han', '/posts/tui-jian-yi-xia-zi-ji-kai-fa-de-lun-tan-dan-han', Record<never, never>, Record<never, never>>,
    '/posts/vue-xue-xi-bi-ji': RouteRecordInfo<'/posts/vue-xue-xi-bi-ji', '/posts/vue-xue-xi-bi-ji', Record<never, never>, Record<never, never>>,
    '/posts/wafbypassshi-yong-python-fa-song-chunked': RouteRecordInfo<'/posts/wafbypassshi-yong-python-fa-song-chunked', '/posts/wafbypassshi-yong-python-fa-song-chunked', Record<never, never>, Record<never, never>>,
    '/posts/wo-de-gao-ji-ri-chang-po-zhen-kai-yuan-xi-tong-grapheneos-de-tui-jian': RouteRecordInfo<'/posts/wo-de-gao-ji-ri-chang-po-zhen-kai-yuan-xi-tong-grapheneos-de-tui-jian', '/posts/wo-de-gao-ji-ri-chang-po-zhen-kai-yuan-xi-tong-grapheneos-de-tui-jian', Record<never, never>, Record<never, never>>,
    '/posts/wo-de-xue-xi-bi-ji-he-yi-xie-xiang-mu': RouteRecordInfo<'/posts/wo-de-xue-xi-bi-ji-he-yi-xie-xiang-mu', '/posts/wo-de-xue-xi-bi-ji-he-yi-xie-xiang-mu', Record<never, never>, Record<never, never>>,
    '/posts/wo-hao-kun-11-yue-de-shui-wen-yi-fen': RouteRecordInfo<'/posts/wo-hao-kun-11-yue-de-shui-wen-yi-fen', '/posts/wo-hao-kun-11-yue-de-shui-wen-yi-fen', Record<never, never>, Record<never, never>>,
    '/posts/xian-cheng-bu-huo-keyboardinterrupter': RouteRecordInfo<'/posts/xian-cheng-bu-huo-keyboardinterrupter', '/posts/xian-cheng-bu-huo-keyboardinterrupter', Record<never, never>, Record<never, never>>,
    '/posts/xiao-wan-ju-kai-fa-tg-shou-qu-mailslurp-ni-ming-you-jian': RouteRecordInfo<'/posts/xiao-wan-ju-kai-fa-tg-shou-qu-mailslurp-ni-ming-you-jian', '/posts/xiao-wan-ju-kai-fa-tg-shou-qu-mailslurp-ni-ming-you-jian', Record<never, never>, Record<never, never>>,
    '/posts/xin-zhu-ti-cute-notes-and-jian-ming-er-ci-kai-fa-zhi-bei': RouteRecordInfo<'/posts/xin-zhu-ti-cute-notes-and-jian-ming-er-ci-kai-fa-zhi-bei', '/posts/xin-zhu-ti-cute-notes-and-jian-ming-er-ci-kai-fa-zhi-bei', Record<never, never>, Record<never, never>>,
    '/posts/xss-jin-jie-xue-xi-fen-xiang-yi': RouteRecordInfo<'/posts/xss-jin-jie-xue-xi-fen-xiang-yi', '/posts/xss-jin-jie-xue-xi-fen-xiang-yi', Record<never, never>, Record<never, never>>,
    '/posts/xss-shui-ti-pian-guan-yu-dom-colbbering-yi-xie-ge-ren-li-jie': RouteRecordInfo<'/posts/xss-shui-ti-pian-guan-yu-dom-colbbering-yi-xie-ge-ren-li-jie', '/posts/xss-shui-ti-pian-guan-yu-dom-colbbering-yi-xie-ge-ren-li-jie', Record<never, never>, Record<never, never>>,
    '/posts/yi-pian-zhen-dui-gong-zuo-hou-de-fan-si-huo-xu-de-sui-sui-nian': RouteRecordInfo<'/posts/yi-pian-zhen-dui-gong-zuo-hou-de-fan-si-huo-xu-de-sui-sui-nian', '/posts/yi-pian-zhen-dui-gong-zuo-hou-de-fan-si-huo-xu-de-sui-sui-nian', Record<never, never>, Record<never, never>>,
    '/tags/': RouteRecordInfo<'/tags/', '/tags', Record<never, never>, Record<never, never>>,
  }
}