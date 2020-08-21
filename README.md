# Vue-next-zh-cn

![Vue-docs CI](https://github.com/vuejs/docs-next-zh-cn/workflows/Vue-docs%20CI/badge.svg)     

## TODO项目

- examples 目录

## 如何参与Vue 3 中文仓库项目+注意事项？

### 如何参与？

1. 然后clone 本仓库
```bash
git clone git@github.com:vuejs/docs-next-zh-cn.git
```
  - 可以更新readme的 [进度](#进度) ，填写上你的Github账号，发起pr，以免重复翻译

2. 安装依赖
```bash
yarn # or npm install
```

3. 项目启动
```bash
yarn serve # or npm run serve
```

### 存在争议的翻译

如果发现某些段落有疑虑，不顺畅的，可以打个记号，以让其他人协助完成。

|记录|翻译人|校验人|状态|
|----|----|----|----|
|[[argue-1]](/src/guide/installation.md#argue-1)||-||
|[[argue-2]](/src/guide/reactivity-computed-watchers.md#argue-2)|-|||
|[[argue-3]](/src/guide/reactivity-computed-watchers.md#argue-3)|-|||
|Identity hazards|-|||
|side effect|-|||

### 翻译规范

- [术语翻译约定.md](https://github.com/vuejs/cn.vuejs.org/wiki)
- 【建议】：如果是link 的链接，应该前后加个空格出来

  <div class="style-example style-example-bad">
  <h4>反例</h4>

  ```markdown
  该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你还对组件不太了解，推荐你先阅读它。
  ```

  <div class="style-example style-example-good">
  <h4>好例子</h4>

  ```markdown
  该页面假设你已经阅读过了 [组件基础](component-basics.md) 。如果你还对组件不太了解，推荐你先阅读它。
  ```
  </div>

## 引用与参考

- [vue2 中文文档.md](https://cn.vuejs.org)
- [vue 2 英文文档.md](https://vuejs.org)
- [vue 3 英文文档.md](https://v3.vuejs.org)


## 部署

本仓库使用的是Github Actions 部署。

## 贡献

网站在创立之初得到了很多朋友们的帮助，大家一起分工协作完成了整站的翻译工作。[TODO这个页面](/src/about.md) 集中记录了大家这段时期的努力和付出，以表谢意！

感谢所有参与翻译的朋友们！

目前网站已处于维护状态，最新的文档/翻译贡献情况可以参阅 GitHub 提供的 [contributors](https://github.com/vuejs/docs-next-zh-cn/graphs/contributors) 页面。
