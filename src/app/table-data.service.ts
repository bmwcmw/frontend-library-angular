import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {


  constructor() { }

  url = 'https://dummyjson.com/products';

  async getAllData(): Promise<DummyResponse> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
}

export interface Row {
  [key:string]: string;
}

export interface DummyResponse{
  products : Row[];
  total : number;
  skip : number;
  limit : number;
}
