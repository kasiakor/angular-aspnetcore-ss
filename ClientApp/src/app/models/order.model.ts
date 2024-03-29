import { Injectable } from "@angular/core";
import { Cart } from "./cart.model";
import { Repository } from "./repository";
import { Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";

type OrderSession = {
  name: string,
  address: string,
  cardNumber: string,
  cardExpiry: string,
  cardSecurityCode: string
}

@Injectable()
export class Order {
  orderId: number;
  name: string;
  address: string;
  payment: Payment = new Payment();

  submitted: boolean = false;
  shipped: boolean = false;
  orderConfirmation: OrderConfirmation;

  constructor(private repo: Repository,
    public cart: Cart,
    router: Router) {

    //data will be stored when the app navigates to a new url that begins with checkout - router class generates events that can be observed within component
    //router.events returns an observable for the routing events
    //subscribe handles events by sending session data to the server
    //filter selects navigationstart even not to send multiple requests to the server for the same navigation change
    router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        if (router.url.startsWith("/checkout")
          && this.name != null && this.address != null) {
          repo.storeSessionData<OrderSession>("checkout", {
            name: this.name,
            address: this.address,
            cardNumber: this.payment.cardNumber,
            cardExpiry: this.payment.cardExpiry,
            cardSecurityCode: this.payment.cardSecurityCode
          });
        }
      });
    //getSessionData retrieves previously stored data and uses it to populate properties
    repo.getSessionData<OrderSession>("checkout").subscribe(data => {
      if (data != null) {
        this.name = data.name;
        this.address = data.address;
        this.payment.cardNumber = data.cardNumber;
        this.payment.cardExpiry = data.cardExpiry;
        this.payment.cardSecurityCode = data.cardSecurityCode;
      }
    })
  }

  get products(): CartLine[] {
    return this.cart.selections
      .map(p => new CartLine(p.productId, p.quantity));
  }

  clear() {
    this.name = null;
    this.address = null;
    this.payment = new Payment();
    this.cart.clear();
    this.submitted = false;
  }

  submit() {
    this.submitted = true;
    this.repo.createOrder(this);
  }
}

export class Payment {
  cardNumber: string;
  cardExpiry: string;
  cardSecurityCode: string;
}

export class CartLine {

  constructor(private productId: number,
    private quantity: number) { }
}

export class OrderConfirmation {

  constructor(public orderId: number,
    public authCode: string,
    public amount: number) { }
}
