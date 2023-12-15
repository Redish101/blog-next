interface MenuItem {
  key: string;
  name: string;
  to: string;
}

export interface FriendLink {
  name: string;
  desc: string;
  link: string;
}


export interface SiteConfig {
  name: string;
  description: string;
  server: string;
  hexo?: boolean;
  msg?: string;
  menu: MenuItem[];
  links?: FriendLink[];
}
