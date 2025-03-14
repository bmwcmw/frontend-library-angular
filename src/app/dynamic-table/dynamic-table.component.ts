import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { DummyResponse, Row, TableDataService } from '../table-data.service';

@Component({
  selector: 'app-dynamic-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css'
})
export class DynamicTableComponent {


  results: Row[] = [
    {id: "1", status: 'complete', task: 'build', att1: '3'},
    {id: "2", status: 'working', task: 'test', att1: '2'},
    {id: "3", status: 'failed', task: 'deploy', att1: '1'},
  ];

  tableDataService: TableDataService = inject(TableDataService);

  tableData : IDynamicTable = {headers : [], items : []};

  filteredTableData : IDynamicTable = {headers : [], items : []};
  headerForFiltering: string ='';
  valueForFiltering: any = '';

  displayedTableData :  IDynamicTable = {headers : [], items : []};
  totalPages : number =1;
  rowsPerPage : number = 10;
  pageAt : number = 1;
  startRowAt : number = (this.pageAt - 1) * this.rowsPerPage;
  endRowAt : number = this.startRowAt + this.rowsPerPage;


  constructor(){
    this.parseResultsToTableData();
  }


  private parseResultsToTableData(){
    this.tableDataService.getAllData().then(
        (res:DummyResponse)=>{

          this.tableData.headers = Object.keys(res.products[0]);
          this.tableData.items = res.products;

          this.filteredTableData.headers = Object.keys(res.products[0]);
          this.filteredTableData.items = res.products;

          this.displayedTableData.headers = Object.keys(res.products[0]);
          this.fetchDisplayedTableFromFilteredTable();

        }
    );


  }

  filter(){

    console.log('before filter, all Data:');
    console.log(this.tableData);
    console.log('before filter, filtered Data:');
    console.log(this.filteredTableData);
    this.filterResultsByHeader(this.headerForFiltering,this.valueForFiltering);
    console.log('after filter, all Data:');
    console.log(this.tableData);
    console.log('after filter, filtered Data:');
    console.log(this.filteredTableData);
  }

  resetFilterResults(){
    //this.parseResultsToTableData();
    this.parseResultsToTableData();
    this.headerForFiltering="";
    this.valueForFiltering="";
    console.log('after reset, all Data:');
    console.log(this.tableData);
    console.log('after reset, filtered Data:');
    console.log(this.filteredTableData);
  }

  private filterResultsByHeader(header: string, value: string){

    let valueType = typeof(this.tableData.items[0][header]);
    if( valueType === "number"){
      this.filteredTableData.items = this.tableData.items.filter(
          object => object[header].toString().includes(value)
      );
    }
    else if (valueType ==="string"){
      this.filteredTableData.items = this.tableData.items.filter(
          object => object[header].toLowerCase().includes(value.toLowerCase())
      );
    }else{
      alert("Sorry, can't search a value of type "+valueType);
    }

    this.fetchDisplayedTableFromFilteredTable();

  }

  isAsc :boolean = true;

  sort(header:string){
    if(this.isAsc){
      this.sortResultsByHeaderDesc(header);
      this.isAsc = false;
    }else{
      this.sortResultsByHeaderAsc(header);
      this.isAsc = true;
    }
  }

  private sortResultsByHeaderAsc(header:string){
    let valueType = typeof(this.tableData.items[0][header]);
    if( valueType === "number"){
      this.filteredTableData.items.sort((a,b)=>Number(a[header])-Number(b[header]));
    }else if( valueType === "string"){
      this.filteredTableData.items.sort((a,b)=>a[header].localeCompare( b[header]));
    }else{
      alert("Sorry, can't sort the table with type "+valueType);
    }

    this.fetchDisplayedTableFromFilteredTable();

  }

  private sortResultsByHeaderDesc(header:string){
    this.sortResultsByHeaderAsc(header);
    this.filteredTableData.items = this.filteredTableData.items.reverse();
  }

  private fetchDisplayedTableFromFilteredTable(){
    this.displayedTableData.items = this.filteredTableData.items.slice(this.startRowAt, this.endRowAt);
    this.calculatePages();
  }

  private calculatePages(){

    this.totalPages = Math.ceil(this.filteredTableData.items.length / this.rowsPerPage);
    this.pageAt = 1;
    this.startRowAt = (this.pageAt - 1) * this.rowsPerPage;
    this.endRowAt = this.startRowAt + this.rowsPerPage;


  }

  switchToPage(page:number){

    this.startRowAt = (page - 1) * this.rowsPerPage;
    this.endRowAt = this.startRowAt + this.rowsPerPage;
    this.displayedTableData.items = this.filteredTableData.items.slice(this.startRowAt, this.endRowAt);

  }

}

interface IDynamicTable {
  headers: string[];
  items: Row[];
}