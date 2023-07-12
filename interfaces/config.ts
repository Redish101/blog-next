interface MenuItem {
  key: string;
  name: string;
  to: string;
}

interface SiteConfig {
  name: string;
  description: string;
  msg?: string;
  menu: MenuItem[];
  friendLinks?: string;
}
