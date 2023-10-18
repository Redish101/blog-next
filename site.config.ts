import { SiteConfig } from "./interfaces/config";

const config: SiteConfig = {
  name: "Redish101 Blog",
  description: "人文 科技 白日梦",
  server: "http://localhost:8001",
  menu: [
    {
      key: "home",
      name: "首页",
      to: "/",
    },
    {
      key: "links",
      name: "友链",
      to: "/links",
    },
  ],
  links: [
    {
      name: "Akilarの糖果屋",
      desc: "欢迎光临糖果屋",
      link: "https://akilar.top/",
    },
    {
      name: "Tianli",
      desc: "自知之明是最可贵的知识！",
      link: "https://tianli-blog.club/",
    },
  ],
};

export default config;
