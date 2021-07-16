<template>
  <div id="docsearch"></div>
</template>

<script>
function isSpecialClick(event) {
  return (
    event.button === 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
}

export default {
  name: 'AlgoliaSearchBox',

  props: ['options'],

  watch: {
    $lang (newValue) {
      this.update(this.options, newValue)
    },

    options (newValue) {
      this.update(newValue, this.$lang)
    }
  },

  mounted () {
    this.initialize(this.options, this.$lang)
  },

  methods: {
    getRelativePath (absoluteUrl) {
      const { pathname, hash } = new URL(absoluteUrl)
      const url = pathname.replace(this.$site.base, '/') + hash

      return url
    },
    initialize (userOptions, lang) {
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ '@docsearch/js'),
        import(/* webpackChunkName: "docsearch" */ '@docsearch/css')
      ]).then(([docsearch]) => {
        docsearch = docsearch.default

        docsearch(
          Object.assign(
            {
              placeholder: this.$site.themeConfig.searchPlaceholder
            },
            userOptions,
            {
              container: '#docsearch',
              // #697 Make DocSearch work well in i18n mode.
              searchParameters: Object.assign(
                {},
                // lang && {
                //   facetFilters: [`lang:${lang}`].concat(
                //     userOptions.facetFilters || []
                //   )
                // },
                userOptions.searchParameters
              ),
              navigator: {
                navigate: ({ suggestionUrl }) => {
                  const { pathname: hitPathname, hash } = new URL(
                    window.location.origin + suggestionUrl
                  )
                  // Vue Router doesn't handle same-page navigation so we use
                  // the native browser location API for anchor navigation.
                  if (this.$router.history.current.path === hitPathname) {
                    window.location.assign(
                      window.location.origin + hitPathname + hash
                    )
                  } else {
                    this.$router.push(suggestionUrl)
                  }
                }
              },
              transformItems: items => {
                return items.map(item => {
                  return Object.assign({}, item, {
                    url: this.getRelativePath(item.url)
                  })
                })
              },
              hitComponent: ({ hit, children }) => {
                return {
                  type: 'a',
                  ref: undefined,
                  constructor: undefined,
                  key: undefined,
                  props: {
                    href: hit.url,
                    onClick: event => {
                      if (isSpecialClick(event)) {
                        return
                      }

                      const { pathname: hitPathname, hash } = new URL(
                        window.location.origin + hit.url
                      )

                      // Vue Router doesn't handle same-page navigation so we use
                      // the native browser location API for anchor navigation.
                      if (this.$router.history.current.fullPath === hit.url) {
                        event.preventDefault()
                        window.location.assign(
                          window.location.origin + hitPathname + hash
                        )
                        return
                      }

                      // If the hits goes to another page, we prevent the native link behavior
                      // to leverage the Vue Router loading feature.
                      if (this.$router.history.current.path !== hitPathname) {
                        event.preventDefault()
                      }

                      this.$router.push(hit.url)
                    },
                    children
                  }
                }
              }
            }
          )
        )
      })
    },

    update(options, lang) {
      this.$el.innerHTML = '<div id="docsearch"></div>'
      this.initialize(options, lang)
    }
  }
}
</script>

<style lang="scss">
@import '@theme/styles/_settings.scss';

.DocSearch {
  --docsearch-primary-color: #{$green};
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--docsearch-primary-color);
}
</style>
