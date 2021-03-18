import { Component } from "@angular/core";
import { Cart } from "../models/cart.model";

//decorator that marks a class as angular component
@Component({
  templateUrl: "cartDetail.component.html"
})

export class CartDetailComponent {
  constructor(public cart: Cart) {}
}
