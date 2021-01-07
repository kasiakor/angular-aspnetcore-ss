import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
  export class Repository {
  product: Product;
  products: Product[];
      constructor(private http: HttpClient) {
        this.getProducts();
      }
      getProduct(id: number) {
        this.http.get<Product>("/api/products/" + id).subscribe(p => this.product = p);
    }
    getProducts() {
      this.http.get<Product[]>("/api/products/").subscribe(prods => this.products = prods);
    }
  }


