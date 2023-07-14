const config: SiteConfig = {
  name: "Redish101 Blog",
  description: "人文 科技 白日梦",
  menu: [
    {
      key: 'home',
      name: '首页',
      to: '/',
    },
    {
      key: "links",
      name: "友链",
      to: "/links",
    },
  ],
  friendLinks: "https://friend-links.redish101.top/data.json",
};

export default config;
