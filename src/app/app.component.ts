import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenuBarComponent } from "./menu-bar/menu-bar.component";

@Component({
    selector: 'app-root',
    imports: [RouterModule,MenuBarComponent],
    template: `
        <main>
            <a [routerLink]="['/']">
                <header class="brand-name">
                    <img class="brand-logo" src="/assets/angular.svg" alt="logo" aria-hidden="true" />
                </header>
            </a>
            <app-menu-bar></app-menu-bar>

            <section class="content">
                <router-outlet></router-outlet>
            </section>
        </main>
  `,
    styleUrls: [`./app.component.css`],
})
export class App {

}