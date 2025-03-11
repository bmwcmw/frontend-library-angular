import { Injectable } from '@angular/core';
import { MenuNode } from "./menu-node";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
   menu = [
    {
      nodeName: 'Home',
      level: 0,
      children: [],
      path:''
    },
    {
      nodeName: 'Products',
      level: 2,
      children: [
        {
          nodeName: 'cars',
          level: 0,
          children: [],
          path:''
        },
        {
          nodeName: 'furnitures',
          level: 1,
          children: [
              {
                  nodeName:'bed',
                  level:0,
                  children:[],
                  path:''
              },
              {
                  nodeName:'closet',
                  level:1,
                  children:[
                      {
                          nodeName:'MonkeyCloset',
                          level:0,
                          children:[],
                          path:''
                      }
                  ],
                  path:''
              },
          ],
          path:''
        },
          {
              nodeName: 'foods',
              level: 0,
              children: [],
              path:''
          }
      ],
      path:''
    },
    {
      nodeName: 'Contact Us',
      level: 0,
      children: [],
      path:''
    }
  ]

  getMenu():MenuNode[]{
    return this.menu;
  }

  constructor() { }
}
