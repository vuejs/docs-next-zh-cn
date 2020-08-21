/**
 * sidebar
 * */
module.exports = {
  guide: [
    {
      title: '基础',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/introduction',
        '/guide/instance',
        '/guide/template-syntax',
        '/guide/computed',
        '/guide/class-and-style',
        '/guide/conditional',
        '/guide/list',
        '/guide/events',
        '/guide/forms',
        '/guide/component-basics'
      ]
    },
    {
      title: '深入组件',
      collapsable: false,
      children: [
        '/guide/component-registration',
        '/guide/component-props',
        '/guide/component-attrs',
        '/guide/component-custom-events',
        '/guide/component-slots',
        '/guide/component-provide-inject',
        '/guide/component-dynamic-async',
        '/guide/component-template-refs',
        '/guide/component-edge-cases'
      ]
    },
    {
      title: '过渡 & 动画',
      collapsable: false,
      children: [
        '/guide/transitions-overview',
        '/guide/transitions-enterleave',
        '/guide/transitions-list',
        '/guide/transitions-state'
      ]
    },
    {
      title: '可复用性 & 组合',
      collapsable: false,
      children: [
        '/guide/mixins',
        '/guide/custom-directive',
        '/guide/teleport',
        '/guide/render-function',
        '/guide/plugins'
      ]
    },
    {
      title: '高级指南',
      collapsable: false,
      children: [
        {
          title: '响应式',
          children: [
            '/guide/reactivity',
            '/guide/reactivity-fundamentals',
            '/guide/reactivity-computed-watchers'
          ]
        },
        {
          title: '组合 API',
          children: [
            '/guide/composition-api-introduction',
            '/guide/composition-api-setup',
            '/guide/composition-api-lifecycle-hooks',
            '/guide/composition-api-provide-inject',
            '/guide/composition-api-template-refs'
          ]
        },
        '/guide/optimizations',
        '/guide/change-detection'
      ]
    },
    {
      title: '工具',
      collapsable: false,
      children: [
        '/guide/single-file-component',
        '/guide/testing',
        '/guide/typescript-support'
      ]
    },
    {
      title: '规模化',
      collapsable: false,
      children: [
        '/guide/routing',
        '/guide/state-management',
        '/guide/ssr'
      ]
    },
    {
      title: '无障碍',
      collapsable: false,
      children: [
        '/guide/a11y-basics',
        '/guide/a11y-semantics',
        '/guide/a11y-standards',
        '/guide/a11y-resources'
      ]
    },
    {
      title: '从Vue 2迁移',
      collapsable: true,
      children: [
        '/guide/migration/introduction',
        '/guide/migration/async-components',
        '/guide/migration/attribute-coercion',
        '/guide/migration/custom-directives',
        '/guide/migration/custom-elements-interop',
        '/guide/migration/data-option',
        '/guide/migration/events-api',
        '/guide/migration/filters',
        '/guide/migration/fragments',
        '/guide/migration/functional-components',
        '/guide/migration/global-api',
        '/guide/migration/global-api-treeshaking',
        '/guide/migration/inline-template-attribute',
        '/guide/migration/keycode-modifiers',
        '/guide/migration/render-function-api',
        '/guide/migration/slots-unification',
        '/guide/migration/v-model'
      ]
    },
    {
      title: '贡献文档',
      collapsable: true,
      children: [
        '/guide/contributing/writing-guide',
        '/guide/contributing/doc-style-guide',
        '/guide/contributing/translations'
      ]
    }
  ],
  community: [],
  api: [
    '/api/application-config',
    '/api/application-api',
    '/api/global-api',
    {
      title: '选项',
      collapsable: false,
      children: [
        '/api/options-data',
        '/api/options-dom',
        '/api/options-lifecycle-hooks',
        '/api/options-assets',
        '/api/options-composition',
        '/api/options-misc'
      ]
    },
    '/api/instance-properties',
    '/api/instance-methods',
    '/api/directives',
    '/api/special-attributes',
    '/api/built-in-components.md',
    {
      title: '响应式 API',
      collapsable: false,
      children: [
        '/api/basic-reactivity',
        '/api/refs-api',
        '/api/computed-watch-api'
      ]
    },
    '/api/composition-api'
  ],
  examples: [
    {
      title: '示例',
      collapsable: false,
      children: [
        '/examples/markdown',
        '/examples/commits',
        '/examples/grid-component',
        '/examples/tree-view',
        '/examples/svg',
        '/examples/modal',
        '/examples/elastic-header',
        '/examples/select2',
        '/examples/todomvc'
      ]
    }
  ]
}
