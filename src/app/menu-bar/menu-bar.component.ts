import {Component, ElementRef, inject, Renderer2, ViewChild, AfterViewInit} from '@angular/core';
import { CommonModule } from "@angular/common";
import { MenuNode } from "../menu-node";
import { MenuService } from "../menu.service";

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css'
})
export class MenuBarComponent {
  menu: MenuNode[] =[];
  menuString : string ='';
  menuService: MenuService = inject(MenuService);
  @ViewChild('myMenuBar',{static:true}) myMenuBarElement !:ElementRef;

  constructor(private renderer: Renderer2){

    this.menu = this.menuService.getMenu();
    for (let menuNode of this.menu ){
      this.menuString += this.renderMenuNodeString(menuNode);
    }


  }

  ngAfterViewInit(){
    const menuBarElement = this.myMenuBarElement;

    this.renderMenu(menuBarElement);
  }

  renderMenuNodeString(menuNode:MenuNode): string {
    let menuDOMString :string = '<li>';
    menuDOMString += menuNode.nodeName;
    if ( menuNode.level >0 ){
      menuDOMString += '<ul>';
      for ( let childNode of menuNode.children ){
        menuDOMString += this.renderMenuNodeString(childNode);
      }
      menuDOMString += '</ul>';
    }
    menuDOMString += `</li>`;
    return menuDOMString;
  }

  renderMenu(menu:ElementRef){
      for (let menuNode of this.menu ){
      this.renderMenuNode(menuNode,menu.nativeElement);
    }
  }

  renderMenuNode(menuNode:MenuNode, menu:ElementRef){
    let menuNodeElement = this.renderer.createElement('li');
    let menuNodeAElement = this.renderer.createElement('a');
    this.renderer.setProperty(menuNodeAElement,'href',menuNode.path);
    let menuNodeText = this.renderer.createText(menuNode.nodeName);
    this.renderer.appendChild(menuNodeElement,menuNodeAElement);
    this.renderer.appendChild(menuNodeAElement,menuNodeText);

    if(menuNode.level>0){
      this.renderer.addClass(menuNodeElement,'hasChildren');

      let childrenNodesElement = this.renderer.createElement('ul');

      for ( let childNode of menuNode.children){
        this.renderMenuNode(childNode,childrenNodesElement);
      }
      this.renderer.appendChild(menuNodeElement,childrenNodesElement);
    }

    this.renderer.appendChild(menu,menuNodeElement);

  }




}
