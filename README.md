# Hexo Memos 说说页面

在Hexo博客中创建一个独立页面，通过Memos API展示说说内容。

## 功能说明

- 创建独立说说页面，不依赖插件
- 通过Memos API获取最新内容
- 响应式设计，适配各种设备

## Demo

你可以访问我的博客查看效果：[https://www.mintimate.cn/Memos/](https://www.mintimate.cn/Memos/)

## 创建步骤

1. 创建新页面：

下载 `source` 目录，将内部的文件全部复制到Hexo博客的 `source` 目录下。

2. 编辑生成的 `source/Memos/index.md` 文件：

```js
var bbMemos = {
    memos : '',//修改为自己部署 Memos 的网址，末尾有 / 斜杠
    limit : '10',//默认每次显示 10 条
    creatorId:'1' ,//早期默认为 101 用户，新安装是 1； https://demo.usememos.com/u/101
    domId: '#bber',//默认为 bber
}
---
```

3. 编辑主题配置文件：

编辑主题配置文件，添加导航内容。以 fluid 主题为例，编辑`_config.fluid.yml`内`menu`部分：

```yaml
  menu:
    - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
    - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
    - { key: "category", link: "/categories/", icon: "iconfont icon-category-fill" }
    - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }
    - { key: "links", link: "/links/", icon: "iconfont icon-link-fill" }
    - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }
    - { key: "意马", link: "/Memos/", icon: "iconfont iconbg-chat" } # 添加说说页面
    - {
      key: '发现',
      icon: 'iconfont iconnaicha',
      submenu: [
        { key: '哔哩哔哩', link: 'https://space.bilibili.com/355567627',icon: "iconfont iconbilibili"},
        { key: 'Youtube', link: 'https://www.youtube.com/@mintimate',icon: "iconfont iconyoutube"},
        { key: 'Github', link: 'https://github.com/Mintimate',icon: "iconfont icongit"},
      ]
    }
```

重启Hexo服务，访问 `http://localhost:4000/Memos/` 即可查看效果。

## 鸣谢

代码基于 木木木木木<https://immmmm.com> 修改，感谢原作者。

## 许可证

GPL-3.0 License