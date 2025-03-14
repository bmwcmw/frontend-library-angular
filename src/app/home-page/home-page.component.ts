import { Component } from '@angular/core';
import { DynamicTableComponent } from "../dynamic-table/dynamic-table.component";

@Component({
  selector: 'app-home-page',
  imports: [DynamicTableComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
