# Vue 项目

## 1. 介绍

编写此文档的目的是为了更好理解这个项目的结构。


## 4. 项目结构

```text
web/
  source/   # 源代码目录
  dist/     # 发布目录
  build/    # 构建目录（webpack 配置文件）
  public/   # 静态资源目录，构建时其中的所有文件（和目录）会自动复制到 “dist/”
  test/     # 测试目录
  doc/      # 文档
  
  .babelrc          # Babel 配置
  .eslintrc.js      # ESLint 配置
  package.json      # 项目描述文件
  package-lock.json # 依赖包版本锁定文件
  postcss.config.js # postcss 配置
  README.md         # 项目说明文件
```

### 4.1. `source` 源码

```text
web/source/ # 源代码目录
  common/       # 公共机制
  main.js       # 脚本入口
  App.vue       # 根组件
  i18n.js       # 国际化配置
  router.js     # 路由配置
  store.js      # vuex
  style.less    # 样式入口
```

### 4.2. `source/common` 源码/公共机制

```text
web/source/common/ # 公共机制
  lib/                # 第三方库
  i18n/               # i18n
```

```text
web/source/common/ # 公共机制
  lib/                # 第三方库
    exui/                 # UI 库
```
