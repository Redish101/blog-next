import { SiteConfig } from "./interfaces/config";

const config: SiteConfig = {
  name: "Redish101 Blog",
  description: "人文 科技 白日梦",
  server: "http://localhost:8001",
  hexo: false,
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
    {
      name: "星の野",
      desc: "我自是年少，韶华倾负✨",
      link: "https://byer.top/",
    },
    {
      name: "HiPeach",
      desc: "妙不可言",
      link: "https://blog.opeach.cn",
    },
    {
      name: "呓语梦轩",
      desc: "用心感受生活",
      link: "https://blog.awaae001.top",
    },
    {
      name: "清羽飞扬",
      desc: "柳影曳曳，清酒孤灯，扬笔撒墨，心境如霜",
      link: "https://blog.qyliu.top",
    },
    {
      name: "辞琼",
      desc: "突破了瓶颈，发现还有瓶盖qwq",
      link: "https://blog.wsq127.top",
    },
    {
      name: "Lafcadia's Blog",
      desc: "Et in Arcadia, ego.",
      link: "https://chuishen.xyz",
    },
  ],
};

export default config;
