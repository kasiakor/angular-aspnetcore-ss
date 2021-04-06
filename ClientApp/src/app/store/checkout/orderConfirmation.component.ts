import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Order } from "../../models/order.model";

@Component({
  templateUrl: "orderConfirmation.component.html"
})
export class OrderConfirmationComponent {

  constructor(private router: Router,
    public order: Order) {
    if (!order.submitted) {
      //if values not provided
      this.router.navigateByUrl("/checkout/step3");
    }
  }
  submitOrder() {
    //sends order to web service
    this.order.submit();
    this.router.navigateByUrl("/checkout/confirmation");
  }
}
