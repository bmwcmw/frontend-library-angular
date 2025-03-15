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
  filterOption: FilterOption = {headers : [], ordersAsc : []};



  displayedTableData :  IDynamicTable = {headers : [], items : []};
  totalPages : number =1;
  rowsPerPage : number = 14;
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

          console.log(this.filteredTableData);

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
    this.pageAt  = 1;
    this.startRowAt  = (this.pageAt - 1) * this.rowsPerPage;
    this.endRowAt  = this.startRowAt + this.rowsPerPage;
    this.filterOption = {headers:[],ordersAsc:[]};



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
    console.log("isAsc: "+this.isAsc);
    console.log("filteredTableData: ");
    console.log(this.filteredTableData);
    if(this.isAsc){
      this.sortResultsByHeaderDescAndFetchDisplayedTable(header);
      this.isAsc = false;
    }else{
      this.sortResultsByHeaderAscAndFetchDisplayedTable(header);
      this.isAsc = true;
    }
  }

  modifyFilterOptionThenMultiSort(header:string){
    this.modifyFilterOption(header);
    this.multiSort();
    console.log('filterOption: ');
    console.log(this.filterOption);

  }

  multiSort(){
    console.log("headers:");
    console.log(this.filterOption.headers);
    this.sortResultsByFilterOptionAndFetchDisplayedTable(this.filterOption);
    this.switchToPage(1);
  }

  private sortResultsByHeaderAscAndFetchDisplayedTable(header:string){

    this.sortResultsByHeaderAsc(header);
    this.fetchDisplayedTableFromFilteredTable();
  }

  private sortResultsByFilterOptionAndFetchDisplayedTable(filterOption:FilterOption){

    this.sortResultsByFilterOption(filterOption);
    this.fetchDisplayedTableFromFilteredTable();

  }

  private sortResultsByHeadersAscAndFetchDisplayedTable(header:string[]){
    this.sortResultsByFilterOption(this.filterOption);

    this.fetchDisplayedTableFromFilteredTable();
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


  }

  private sortResultsByFilterOption(filterOption:FilterOption){

    this.filteredTableData.items.sort((a,b)=>{

      let comparedValue = 0;

      for(let i = 0; i < filterOption.headers.length; i++){
        let valueType = typeof(this.tableData.items[0][filterOption.headers[i]]);
        let header = filterOption.headers[i];
        if( valueType === "number"){
          comparedValue = Number(a[header])-Number(b[header]);
        }else if( valueType === "string"){
          comparedValue = a[header].localeCompare( b[header]);
        }else{
          //alert("Sorry, can't sort the table with type "+valueType);
        }
        if (!filterOption.ordersAsc[i]) comparedValue =  -comparedValue;
        if(comparedValue !=0) return comparedValue;
      }
      return comparedValue;
    });
  }





  private sortResultsByHeaderDescAndFetchDisplayedTable(header:string){
    this.sortResultsByHeaderAsc(header);
    this.filteredTableData.items.reverse();
    this.fetchDisplayedTableFromFilteredTable();
  }

  private fetchDisplayedTableFromFilteredTable(){
    console.log('before fetch: displayedTable');
    console.log(this.displayedTableData);
    this.displayedTableData.items = this.filteredTableData.items.slice(this.startRowAt, this.endRowAt);
    console.log('after fetch: displayedTable');
    console.log(this.displayedTableData);
    this.calculatePages();
  }

  private calculatePages(){

    this.totalPages = Math.ceil(this.filteredTableData.items.length / this.rowsPerPage);
    this.pageAt = 1;
    this.startRowAt = (this.pageAt - 1) * this.rowsPerPage;
    this.endRowAt = this.startRowAt + this.rowsPerPage;


  }

  switchToPage(page:number){

    this.pageAt = page;
    this.startRowAt = (this.pageAt - 1) * this.rowsPerPage;
    this.endRowAt = this.startRowAt + this.rowsPerPage;
    this.displayedTableData.items = this.filteredTableData.items.slice(this.startRowAt, this.endRowAt);

  }

  modifyFilterOption( header: string){
    let index = this.filterOption.headers.indexOf(header);
    if(index > -1){
      if(this.filterOption.ordersAsc[index]){
        this.filterOption.ordersAsc[index] = false;
      }else{
        this.filterOption.headers.splice(index,1);
        this.filterOption.ordersAsc.splice(index,1);
      }

    }else{
      this.filterOption.headers.push(header);
      this.filterOption.ordersAsc.push(true);
    }

    console.log('filterOption: ');
    console.log(this.filterOption);
  }

}

interface IDynamicTable {
  headers: string[];
  items: Row[];
}

interface FilterOption {
  headers : string[];
  ordersAsc : boolean[];
}