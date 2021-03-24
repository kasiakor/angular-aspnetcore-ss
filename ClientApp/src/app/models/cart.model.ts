import { Injectable } from "@angular/core";
import { Product } from "./product.model";
import { Repository } from './repository';

//Decorator that marks a class as available to be provided and injected as a dependency
@Injectable()
export class Cart {
  selections: ProductSelection[] = [];
  itemCount: number = 0;
  totalPrice: number = 0;

  //dependency injection
  constructor(private repo: Repository) {
    repo.getSessionData<ProductSelection[]>("cart").subscribe(cartData => {
      //data is used to populate the card
      if (cartData != null) {
        cartData.forEach(item => this.selections.push(item));
        this.update(false);
      }
    });
  }
  //The find() method returns the value of the first element in the provided array that satisfies the provided testing function.
  addProduct(product: Product) {
    let selection = this.selections
      .find(ps => ps.productId == product.productId);
    if (selection) {
      selection.quantity++;
    } else {
      this.selections.push(new ProductSelection(this,
        product.productId, product.name,
        product.price, 1));
    }
    //update method is called every time the product selection changes
    //angular evaluates data binding expresion repeatedly when there is an update
    this.update();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      let selection = this.selections.find(ps => ps.productId == productId);
      if (selection) {
        selection.quantity = quantity;
      }
    } else {
      let index = this.selections.findIndex(ps => ps.productId == productId);
      if (index != -1) {
        this.selections.splice(index, 1);
      }
      this.update();
    }
  }

  clear() {
    this.selections = [];
    this.update();
  }

  update(storeData: boolean = true) {
    this.itemCount = this.selections.map(ps => ps.quantity)
      .reduce((prev, curr) => prev + curr, 0);
    this.totalPrice = this.selections.map(ps => ps.price * ps.quantity)
      .reduce((prev, curr) => prev + curr, 0);

    if (storeData) {
      //update is called to update the properties used in data binding
      //to present modified cart to the user
      this.repo.storeSessionData("cart", this.selections.map(s => {
        return {
          productId: s.productId,
          name: s.name,
          price: s.price,
          quantity: s.quantity
        }
      }));
    }
  }
}

export class ProductSelection {

  constructor(public cart: Cart,
    public productId?: number,
    public name?: string,
    public price?: number,
    private quantityValue?: number) { }

  get quantity() {
    return this.quantityValue;
  }

  set quantity(newQuantity: number) {
    this.quantityValue = newQuantity;
    this.cart.update();
  }
}
