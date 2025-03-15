import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {


  constructor() { }

  //url = 'https://dummyjson.com/products';
  url = 'http://localhost:3000/data';

  async getAllData(): Promise<DummyResponse> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
}

export interface Row {
  [key:string]: any;
}

export interface DummyResponse{
  products : Row[];
  total : number;
  skip : number;
  limit : number;
}

