import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CartSummaryComponent } from "./cartSummary.component";
import { CategoryFilterComponent } from "./categoryFilter.component";
import { PaginationComponent } from "./pagination.component";
import { ProductListComponent } from "./productList.component";
import { RatingsComponent } from "./ratings.component";
import { ProductSelectionComponent } from "./productSelection.component";

//configuration metadata
@NgModule({
  declarations: [CartSummaryComponent, CategoryFilterComponent, PaginationComponent, ProductListComponent, ProductSelectionComponent, RatingsComponent],
  imports: [BrowserModule],
  exports: [ProductSelectionComponent]
})
export class StoreModule {}
