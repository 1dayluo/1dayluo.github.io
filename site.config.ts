import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://1dayluo.github.io/',
  lang: 'zh-CN',
  title: '星尘谷',
  author: {
    name: '1dayluo',
  },
  description: '欢迎来到我的blog. ^ ^',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/1dayluo',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/U_dayluo',
      icon: 'i-ri-twitter-line',
      color: '#1da1f2',
    },
    {
      name: 'Telegram Channel',
      link: 'https://t.me/+mE3ExiZIEaMxM2Rl',
      icon: 'i-ri-telegram-line',
      color: '#0088CC',
    },

  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: true,
    title: 'meow！',
    methods: [
    ],
  },
})
