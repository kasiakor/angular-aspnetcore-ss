import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModelModule } from "./models/model.module";
//import { ProductTableComponent } from "./structure/productTable.component";
//import { CategoryFilterComponent } from "./structure/categoryFilter.component";
//import { ProductDetailComponent } from "./structure/productDetail.component";
import { FormsModule } from "@angular/forms";
import { StoreModule } from "./store/store.module";
import { ExternalService } from "./external.service";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModelModule,
    FormsModule,
    StoreModule
  ],
  //A provider is an instruction to the Dependency Injection system on how to obtain a value for a dependency. Most of the time, these dependencies are services that you create and provide.
  providers: [ExternalService],
  bootstrap: [AppComponent]
})
export class AppModule {
  //constructor ensures that externalservice object will be created to provide Blazor with a global function angular_searchProducts to invoke
  constructor(external: ExternalService) { }
  }
