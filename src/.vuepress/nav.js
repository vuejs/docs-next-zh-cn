/**
 * sidebar
 * */
module.exports = [
  {
    text: '文档',
    ariaLabel: '文档菜单',
    items: [
      { text: '教程', link: '/guide/introduction' },
      { text: '风格指南', link: '/style-guide/' },
      { text: '示例', link: '/examples/markdown' }
    ]
  },
  { text: 'API Reference', link: '/api/application-config' },
  {
    text: '生态系统',
    items: [
      {
        text: '社区',
        ariaLabel: '社区菜单',
        items: [
          { text: '团队', link: '/community/team/' },
          { text: '合作伙伴', link: '/community/partners/' },
          { text: '加入', link: '/community/join/' },
          { text: '主题', link: '/community/themes/' }
        ]
      },
      {
        text: '官方项目',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Vuex', link: 'https://vuex.vuejs.org/' },
          { text: 'Vue CLI', link: 'https://cli.vuejs.org/' },
          {
            text: 'Vue Test Utils',
            link: 'https://vue-test-utils.vuejs.org/'
          },
          {
            text: 'Devtools',
            link: 'https://github.com/vuejs/vue-devtools'
          },
          { text: 'Weekly news', link: 'https://news.vuejs.org/' }
        ]
      }
    ]
  },
  {
    text: '支持 Vue',
    link: '/support-vuejs/',
    items: [
      {
        text: '一次性捐款',
        link: '/support-vuejs/#one-time-donations'
      },
      {
        text: '周期性捐款',
        link: '/support-vuejs/#recurring-pledges'
      },
      {
        text: '贴纸',
        link: 'https://www.smallsticker.com/%E8%B4%B4%E7%BA%B8/vue.html'
      },
      {
        text: '周边',
        link: 'https://osholic.com/?utm_source=vue&utm_medium=dropdown'
      },
      {
        text: 'T-Shirt 商店',
        link: 'https://vue.threadless.com/'
      }
    ]
  },
  {
    text: '多语言',
    link: '#',
    items: [
      {
        text: 'English',
        link: 'https://v3.vuejs.org'
      }
    ]
  }
]
