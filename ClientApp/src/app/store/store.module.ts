import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CartSummaryComponent } from "./cartSummary.component";
import { CategoryFilterComponent } from "./categoryFilter.component";
import { PaginationComponent } from "./pagination.component";
import { ProductListComponent } from "./productList.component";
import { RatingsComponent } from "./ratings.component";
import { ProductSelectionComponent } from "./productSelection.component";
import { CartDetailComponent } from "./cartDetail.component";
//to enable NgModule directive used in two-way data binding allowing the user to change the value in the input element
import { FormsModule } from "@angular/forms";
//required for button elements to which routerLink directived was applied.
import { RouterModule } from "@angular/router";
import { CheckoutDetailsComponent } from "./checkout/checkoutDetails.component";
import { CheckoutPaymentComponent } from "./checkout/checkoutPayment.component";
import { CheckoutSummaryComponent } from "./checkout/checkoutSummary.component";
import { OrderConfirmationComponent } from "./checkout/orderConfirmation.component";
import { BlazorLoader } from "./blazorLoader.component";


//configuration metadata
@NgModule({
  declarations: [CartSummaryComponent, CategoryFilterComponent, PaginationComponent, ProductListComponent, ProductSelectionComponent, RatingsComponent, CartDetailComponent, CheckoutDetailsComponent, CheckoutPaymentComponent, CheckoutSummaryComponent, OrderConfirmationComponent, BlazorLoader],
  imports: [BrowserModule, FormsModule, RouterModule],
  exports: [ProductSelectionComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StoreModule {}
