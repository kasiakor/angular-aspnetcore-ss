import { Component } from '@angular/core';
import { Repository } from "./models/repository";
import { Product } from "./models/product.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private repo: Repository) { }

  get product(): Product {
    return this.repo.product;
  }
  get products(): Product[] {
    return this.repo.products;
  }

  createProduct() {
    this.repo.createProduct(new Product(0, "X-Ray Scuba Mask", "Watersports",
      "See what the fish are hiding", 49.99, this.repo.products[0].supplier));
  }
}
