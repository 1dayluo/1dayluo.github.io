import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://1dayluo.github.io/',
  lang: 'zh-CN',
  title: '喵帕斯',
  author: {
    name: '1dayluo',
    avatar: '',
  },
  encrypt: {
    enable: true,
  },
  description: '遁入迷宫的技术宅的隐秘角落 ｜ 我记录些什么就是为了记录些什么',
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
    enable: true,
    type: 'fuse',
  }

  // sponsor: {
  //   enable: true,
  //   title: 'meow！',
  //   methods: [
  //   ],
  // },
})
