---
title: 'Google Dorking Learn'
date: 2022-02-01 22:24:18
tags: [笔记,学习笔记]
published: true
hideInList: false
feature: 
isTop: false
---
# Google Dorking Learn

Learn from: https://exposingtheinvisible.org/guides/google-dorking/

## To dork or not dork

在一些信息监控严格的国家，google dork的内容可能用于针对你。所以建议用Tor来进行google dork。

由于有的地方可能会因为你使用Tor标记你为敏感在线，则可以使用带有可插拔传输的混淆的Tor Bridge

如果不能使用Tor,可以考虑使用“a privacy-aware search engine“， 例如：DuckDuckGo。



## How it works

> a googleDorker can locate hidden login pages, error messages that give away too much information and files that a website administrator might not realise are publicly accessible.

### 知识点

搜索更具体的信息：

- 使用像“inurl”, “intext”, “site”, “feed”, “language”的关键词，后跟冒号

- 使用引号包围要搜索的text,让搜索引起仅搜索被包起来的text
- 使用全大些的“OR”在search term间，会返回包含任意一个的结果。
- 如果search item包含多个词汇，用双引号括起来.见例3
- Dorks也可以和一般的搜索词匹配，见例4
- 你可以用多个operator,而顺序是无所谓的。



### 例子

1. `site:tacticaltech.org filetype:pdf`

This googleDork will search https://tacticaltech.org for all PDF files hosted under that domain name.



2. `inurl:exposing inbody:invisible`

出现在url的页面，查找出现在body中的词



3. `intext:exposing intitle:“the invisible”`



4. `exposing feed:rss` or `exposing site:tacticaltech.org filetype:pdf`



​     在这里"exposing"是一般的搜索词，而“site”和“filetype”搜索匹配范围。



## Dorking for Dummies



 ### Example 1:Fding budgets on the US Homeland Security

The “filetype” operator does not recognise different versions of the same or similar formats (i.e. *doc* vs. *docx, xls* vs. *xlsx* vs. *csv*), so each of these formats must be dorked separately:

`budget filetype:xlsx OR budget filetype:csv`

duckduckgo要使用不同的关键词，如下(用ext代替filetype)：

`budget site:dhs.gov ext:xls`



### Example 2: Finding passwords

Try the following dorks in different search engines:

````
password filetype:doc site:Your site

password filetype:docx site:Your site

password filetype:pdf site:Your site

password filetype:xls site:Your site
````



## Dork It Youself

最新可参考：https://www.boxpiper.com/posts/google-dork-list

2015年的google-dorks-list：https://gist.github.com/heiswayi/641201f3bac04168108a



| Dork                                                        | Description                                                  | Google | DuckDuckGo | Yahoo | Bing |
| :---------------------------------------------------------- | :----------------------------------------------------------- | :----- | :--------- | :---- | :--- |
| cache:[url]                                                 | Shows the version of the web page from the search engine’s cache. | ✓      |            |       |      |
| related:[url]                                               | Finds web pages that are similar to the specified web page.  | ✓      |            |       |      |
| info:[url]                                                  | Presents some information that Google has about a web page, including similar pages, the cached version of the page, and sites linking to the page. | ✓      |            |       |      |
| site:[url]                                                  | Finds pages only within a particular domain and all its subdomains. | ✓      | ✓          | ✓     | ✓    |
| intitle:[text] or allintitle:[text]                         | Finds pages that include a specific keyword as part of the indexed title tag. *You must include a space between the colon and the query for the operator to work in Bing.* | ✓      | ✓          | ✓     | ✓    |
| allinurl:[text]                                             | Finds pages that include a specific keyword as part of their indexed URLs. |        | ✓          |       |      |
| meta:[text]                                                 | Finds pages that contain the specific keyword in the meta tags. |        |            |       | ✓    |
| filetype:[file extension]                                   | Searches for specific file types.                            | ✓      | ✓          | ✓     | ✓    |
| intext:[text], allintext:[text], inbody:[text]              | Searches text of page. *For Bing and Yahoo the query is inbody:[text]. For DuckDuckGo the query is intext:[text]. For Google either intext:[text] or allintext:[text] can be used.* | ✓      | ✓          | ✓     | ✓    |
| inanchor:[text]                                             | Search link anchor text                                      | ✓      |            |       |      |
| location:[iso code] or loc:[iso code], region:[region code] | Search for specific region. *For Bing use location:[iso code] or loc:[iso code] and for DuckDuckGo use region:[iso code].An iso location code is a short code for a country for example, Egypt is eg and USA is us.* [*https://en.wikipedia.org/wiki/ISO_3166-1* |        | ✓          |       | ✓    |
| contains:[text]                                             | Identifies sites that contain links to filetypes specified (i.e. contains:pdf) |        |            |       | ✓    |
| altloc:[iso code]                                           | Searches for location in addition to one specified by language of site (i.e. pt-us or en-us) |        |            |       | ✓    |
| feed:[feed type, i.e. rss]                                  | Find RSS feed related to search term                         |        | ✓          | ✓     | ✓    |
| hasfeed:[url]                                               | Finds webpages that contain both the term or terms for which you are querying and one or more RSS or Atom feeds. |        | ✓          |       | ✓    |
| ip:[ip address]                                             | Find sites hosted by a specific ip address                   |        |            | ✓     | ✓    |
| language:[language code]                                    | Returns websites that match the search term in a specified language |        | ✓          | ✓     |      |
| book:[title]                                                | Searches for book titles related to keywords                 | ✓      |            |       |      |
| maps:[location]                                             | Searches for maps related to keywords                        | ✓      |            |       |      |
| linkfromdomain:[url]                                        | Shows websites whose links are mentioned in the specified url (with errors) |        |            |       | ✓    |

