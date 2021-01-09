import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Filter } from "./configClasses.repository";

@Injectable()
  export class Repository {
  product: Product;
  products: Product[];
  filter: Filter = new Filter();
  constructor(private http: HttpClient) {
    this.filter.category = "soccer";
    //this.filter.search = "ball";
        this.getProducts();
      }
      getProduct(id: number) {
        this.http.get<Product>("/api/products/" + id).subscribe(p => this.product = p);
    }
    getProducts() {
      let url = `/api/products`;
      if (this.filter.category) {
        url += `?category=${this.filter.category}`;
      }
    if (this.filter.search) {
        url += `&search=${this.filter.search}`;
      }
      this.http.get<Product[]>(url).subscribe(prods => this.products = prods);
    }
  }


