import { Component } from "@angular/core";
import { Repository } from "../models/repository";
import { Product } from "../models/product.model";
import { Cart } from "../models/cart.model";

@Component({
  selector: "store-product-list",
  templateUrl: "productList.component.html"
})

export class ProductListComponent {
  //constructor receives a cart object
  constructor(private repo: Repository, private cart: Cart) { }
  get products(): Product[] {
    if (this.repo.products != null && this.repo.products.length > 0) {
      let pageIndex = (this.repo.paginationObject.currentPage - 1)
        * this.repo.paginationObject.productsPerPage;
      console.log("pageIndex:" +pageIndex);
      console.log("slice:" + this.repo.products.slice(pageIndex,
        pageIndex + this.repo.paginationObject.productsPerPage));
      console.log(Product[0]);
      return this.repo.products.slice(pageIndex,
        pageIndex + this.repo.paginationObject.productsPerPage);
  
    }
  }
    //addProduct method of a Cart object is called by addToCart component's method
    addToCart(product: Product) {
      this.cart.addProduct(product);
  }
}

