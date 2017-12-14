export class SidebarItem {
  description: string;
  routerLink: string;
  children?: Array<SidebarItem>;

  constructor(description: string, routerLink: string, children?: Array<SidebarItem>) {
    this.description = description;
    this.routerLink = routerLink;
    this.children = children;
  }
}