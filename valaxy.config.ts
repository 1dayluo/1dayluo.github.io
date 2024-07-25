import { defineConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-hairy'
import { addonMeting } from 'valaxy-addon-meting'

/**
 * User Config
 * do not use export const config to avoid defu conflict
 */
export default defineConfig<ThemeConfig>({
  theme: 'hairy',
  themeConfig: {
    theme: 'dark',
    nav: [
      {
        text: 'Home',
        link: '/',
        icon: 'i-material-symbols-home-work-sharp',
      },
      {
        text: 'About',
        link: '/about',
        icon: 'i-material-symbols-recent-actors-rounded',
      },
      {
        text: 'Posts',
        link: '/archives/',
        icon: 'i-material-symbols-import-contacts-rounded',
      },
      {
        text: 'Links',
        link: '/links/',
        icon: 'i-material-symbols-monitor-heart',
      },
      {
        text: 'Github',
        link: 'https://github.com/1dayluo',
        icon: 'i-ri-github-fill',
      },
    ],
    footer: {
      since: 2020,
      powered: true,
    },
  },

  addons: [
    addonWaline({
      comment: true,
      serverURL: 'https://waline-blog-vd3b.vercel.app/',
      emoji: [
        '//unpkg.com/@waline/emojis@1.0.1/weibo',
        '//unpkg.com/@waline/emojis@1.0.1/bilibili',
      ],
      pageview: true,
    }),
    addonMeting({
      global: true,
      props: {
        id: '7676862186',
        type: 'playlist',
        autoplay: false,
        theme: 'var(--hy-c-primary)',
      },
    }),
  ],
})