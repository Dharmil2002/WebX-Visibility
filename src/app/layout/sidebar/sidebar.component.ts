import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from 'src/app/core/service/auth.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { MenuData } from './sidebar.metadata';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/core/service/menu-access/menu.serrvice';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: MenuData[];
  level1Menu = '';
  level2Menu = '';
  level3Menu = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;
  routerObj = null;
  userName: string;
  storageSub: Subscription = new Subscription();
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private storageService: StorageService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // logic for select active menu in dropdown
        const currenturl = event.url.split('?')[0];
        this.level1Menu = currenturl.split('/')[1];
        this.level2Menu = currenturl.split('/')[2];

        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callLevel1Toggle(event: any, element: any) {
    if (element === this.level1Menu) {
      this.level1Menu = '0';
    } else {
      this.level1Menu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');
    }
  }
  callLevel2Toggle(event: any, element: any) {
    if (element === this.level2Menu) {
      this.level2Menu = '0';
    } else {
      this.level2Menu = element;
    }
  }
  callLevel3Toggle(event: any, element: any) {
    if (element === this.level3Menu) {
      this.level3Menu = '0';
    } else {
      this.level3Menu = element;
    }
  }
  ngOnInit() {
    // if (this.authService.currentUserValue) {
    // }
    this.sidebarItems = JSON.parse(this.storageService.menuToBind);

    this.storageSub = this.storageService.watchStorage("Mode").subscribe((data: string | null) => {            
      if(data){
        this.setMenuToBind(data);
        this.sidebarItems = JSON.parse(this.storageService.menuToBind);
      }
    });
    this.userName = localStorage.getItem('UserName');
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  setMenuToBind(mode) {
    if(mode) {
      let menu = JSON.parse( this.storageService.menu);
      let menuItems = menu.filter((x) => !x.MenuGroup || x.MenuGroup == mode.toUpperCase() || x.MenuGroup == "" || x.MenuGroup == "ALL");

      let menuData = this.menuService.buildHierarchy(menuItems);
      let root = menuData.find((x) => x.MenuLevel == 1);
      this.storageService.setItem("menuToBind", JSON.stringify(root.SubMenu || []));

      const searchData = menuItems.filter((x) => x.MenuLevel != 1 && x.HasLink).map((x) => {
        const p = menu.find((y) => y.MenuId == x.ParentId);      
        const d = {
          title: `${p?.MenuName}/${x.MenuName}`,  
          tag: x.MenuName.split(" "),
          router: x.MenuLink
        };

        return d;
      });

      this.storageService.setItem("searchData", JSON.stringify(searchData || []));
      this.storageService.setItem('searchResults', '[]');
    }
  }

  ngOnDestroy() {
    this.routerObj.unsubscribe();
    this.storageSub.unsubscribe();
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }
  mouseOut() {
    const hasClass = this.elementRef.nativeElement.closest('body');
    if (hasClass) {
      this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }
  // mouseHover(e) {
  //   const body = this.elementRef.nativeElement.closest('body');
  //   if (body.classList.contains('submenu-closed')) {
  //     this.renderer.addClass(this.document.body, 'side-closed-hover');
  //     this.renderer.removeClass(this.document.body, 'submenu-closed');
  //   }
  // }
  // mouseOut(e) {
  //   const body = this.elementRef.nativeElement.closest('body');
  //   if (body.classList.contains('side-closed-hover')) {
  //     this.renderer.removeClass(this.document.body, 'side-closed-hover');
  //     this.renderer.addClass(this.document.body, 'submenu-closed');
  //   }
  // }
}
