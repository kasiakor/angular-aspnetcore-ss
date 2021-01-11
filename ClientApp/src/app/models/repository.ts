import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Filter } from "./configClasses.repository";
import { Supplier } from "./supplier.model";

@Injectable()
export class Repository {
  product: Product;
  products: Product[];
  suppliers: Supplier[] = [];
  filter: Filter = new Filter();
  constructor(private http: HttpClient) {
    //this.filter.category = "soccer";
    //this.filter.search = "ball";
    this.getProducts();
    //this.getSuppliers();
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
    console.log("get products method");
  }

  getSuppliers() {
    let url = `/api/suppliers`;
    this.http.get<Supplier[]>(url).subscribe(sups => this.suppliers = sups);
  }
  createProduct(prod: Product) {
    let data = {
      name: prod.name, category: prod.category,
      description: prod.description, price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };

    this.http.post<number>("/api/products", data)
      .subscribe(id => {
        prod.productId = id;
        this.products.push(prod);
      });
  }
}



