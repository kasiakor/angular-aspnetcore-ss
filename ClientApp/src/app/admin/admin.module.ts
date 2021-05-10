import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AdminComponent } from "./admin.component";
import { OverviewComponent } from "./overview.component";
import { ProductAdminComponent } from "./productAdmin.component";
import { OrderAdminComponent } from "./orderAdmin.component";
import { ProductEditorComponent } from "./productEditor.component";
import { CommonModule } from "@angular/common";
import { ExternalService } from '../external.service';
import { AppComponent } from '../app.component';


const routes: Routes = [
  {
    path: "", component: AdminComponent,
    children: [
      { path: "products", component: ProductAdminComponent },
      { path: "orders", component: OrderAdminComponent },
      { path: "overview", component: OverviewComponent },
      { path: "", component: OverviewComponent }]
  }
];

@NgModule({
  //router module is required to support the url navigation between components
  //CommonModule it is used when you want to use directives - NgIf, NgFor ..
  imports: [RouterModule,
    FormsModule, RouterModule.forChild(routes), CommonModule],
  declarations: [AdminComponent, OverviewComponent,
    ProductAdminComponent, OrderAdminComponent, ProductEditorComponent],
})
export class AdminModule { }
