// . 配置导航栏它是显示在页面顶部的位置,可以在themeConfig下nav中配置。这里link我们仅配置到 / 他会自动匹配到目录的 index.md 文件,因为index.md是vitepress的默认入口文件,在vuepress中使用的是README.md作为默认的入口文件
export default [
  {
    text: '💻 前端知识',
    items: [
      {
        text: '🗡️ 基础',
        items: [
          { text: 'Canvas', link: '/Canvas/index' },
          { text: 'CSS', link: '/CSS/属性详解/-webkit-box-reflect' },
          { text: 'JavaScript', link: '/Javascript/markdown/' },
        ],
      },
      {
        text: '🧺 框架',
        items: [
          { text: 'Vue2', link: '/vue2/指令' },
          { text: 'Vue3', link: '/Vue3/vue3项目创建' },
          { text: 'React', link: '/React/' },
        ],
      },
      {
        text: '⬆️ 进阶',
        items: [
          { text: 'TypeScript', link: '/TypeScript/环境配置' },
          { text: 'Git', link: '/Git/潜在的BUG/大小写规则' },
          { text: '正则表达式', link: '/Reg/knowledge/index' },
          { text: 'Node', link: '/Node/' },
        ],
      },
      {
        text: '🌹 拓展',
        items: [
          {
            text: '学而时习之',
            link: '/study/',
          },
        ],
      },
    ],
  },
  {
    text: '💾 项目经验',
    items: [
      {
        text: '💼 工作项目',
        items: [
          { text: '🧟 中科星图', link: '/lingsi/' },
          { text: '⛷️ 百度', link: '/baidu/' },
        ],
      },
      {
        text: '📜 自主学习',
        items: [
          { text: '🔪 tydumpling博客', link: '/tydumpling/' },
          { text: '📢 网上学习', link: '/myself/' },
        ],
      },
    ],
  },
  {
    text: '🦆 面试鸭',
    items: [
      { text: '📔 面试八股', link: '/面试鸭/面试典/js/数组方法手写原理.md' },
      { text: '🧮 面试算法', link: '/面试鸭/面试算法/简单题/罗马转数字.md' },
      { text: '👨‍⚖️ 面试经历', link: '/面试鸭/面试问/index.md' },
    ],
  },
  {
    text: '🧊 博客部署',
    items: [
      { text: '🌩️ 引言', link: '/vitePress/' },
      { text: '🧩 搭建', link: '/vitePress/Dev' },
      { text: '🎁 打包', link: '/vitePress/Build' },
      { text: '⏳ 部署', link: '/vitePress/Deploy' },
      { text: '✨ 拓展', link: '/vitePress/Know' },
    ],
  },
  {
    text: '📖 阅读',
    items: [
      { text: '✨ 索引', link: '/read/' },
      { text: 'Javascript', link: '/read/javascript/ES6标准入门/index' },
      { text: 'Vue', link: '/read/Vue/Vue.js设计与实现.md' },
    ],
  },
  {
    text: '📴 有用的帮助',
    items: [
      { text: '🎃 开发帮助', link: '/help/' },
      { text: '📕 官方文档', link: '/help/官方文档' },
    ],
  },
  {
    text: '⭐ 关于',
    items: [
      { text: '⭐ 关于我', link: '/about/' },
      { text: '🔪 关于tydumpling博客', link: '/about/blog' },
      { text: '📑 关于学习准则', link: '/about/furtrue' },
      { text: '🧟 关于中科星图', link: '/about/lingsi' },
      { text: '⛷️ 关于百度', link: '/about/baidu' },
    ],
  },
]
