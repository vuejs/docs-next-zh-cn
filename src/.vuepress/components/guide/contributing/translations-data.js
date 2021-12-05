export const labels = {
  language: '语种',
  github: 'GitHub',
  lastCommit: '最后一次提交',
  last90Days: '过去 90 天',
  loadDetails: '加载详情',
  commits: '提交',
  loading: '加载中...'
}

// 代码仓库按语言代码的字母顺序排列。
// 在此列表中添加新项目时，你可能需要清除一下 sessionStorage。
export const repos = [
  { lang: 'en-us', owner: 'vuejs', repo: 'docs', branch: 'master', url: 'https://v3.vuejs.org/' },
  { lang: 'id', owner: 'vuejs-id', repo: 'docs-next', branch: 'indonesian', url: 'https://v3-vuejsid-docs.netlify.app/' },
  { lang: 'ja', owner: 'vuejs-jp', repo: 'ja.vuejs.org', branch: 'lang-ja', url: 'https://v3.ja.vuejs.org/' },
  { lang: 'ko', owner: 'vuejs-kr', repo: 'docs-next', branch: 'rootKoKr', url: 'https://v3.ko.vuejs.org/'  },
  { lang: 'pt-br', owner: 'vuejs-br', repo: 'docs-next', branch: 'master', url: 'https://vuejsbr-docs-next.netlify.app/' },
  { lang: 'ru', owner: 'translation-gang', repo: 'docs-next', branch: 'master', url: 'https://v3.ru.vuejs.org/' },
  { lang: 'zh-cn', owner: 'vuejs', repo: 'docs-next-zh-cn', branch: 'master', url: 'https://v3.cn.vuejs.org/' }
]
