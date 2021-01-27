import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Filter, Pagination } from "./configClasses.repository";
import { Supplier } from "./supplier.model";

const productsUrl = "/api/products";
type productMetadata = {
  data: Product[],
  categories: string[]
}

@Injectable()
export class Repository {
  //access to app data
  product: Product;
  products: Product[];
  suppliers: Supplier[] = [];
  filter: Filter = new Filter();
  //when product data is refreshed selected page will be reset
  paginationObject = new Pagination();
  categories: string[] = [];
  constructor(private http: HttpClient) {
    //this.filter.category = "soccer";
    //this.filter.search = "ball";
    this.filter.related = true;
    //this.getProducts();
    //this.getSuppliers();
  }

  //methods that send http requests to web service and use result to update properties
  getProduct(id: number) {
    this.http.get<Product>("/api/products/" + id).subscribe(p => this.product = p);
  }
  getProducts() {
    let url = `${productsUrl}?related=${this.filter.related}`;
    if (this.filter.category) {
      url += `&category=${this.filter.category}`;
    }
    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }
    url += "&metadata=true";
    this.http.get<productMetadata>(url).subscribe(md => {
      this.products = md.data,
        this.categories = md.categories
    });
    //this.http.get<Product[]>(url).subscribe(prods => this.products = prods);
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
  replaceProduct(prod: Product) {
    let data = {
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };
    this.http.put("/api/products/" + `${prod.productId}`, data).subscribe(() => this.getProducts());
  }

  replaceSupplier(supp: Supplier) {
    let data = {
      name: supp.name,
      city: supp.city,
      state: supp.state,
    };
    this.http.put("/api/suppliers/" + `${supp.supplierId}`, data).subscribe(() => this.getProducts());
  }

  updateProduct(id: number, changes: Map<string, any>) {
    let patch = [];
    changes.forEach((value, key) => patch.push({ op: "replace", path: key, value: value }));
    this.http.patch("/api/products/" + `${id}`, patch).subscribe(() => this.getProducts());
  }

  deleteProduct(id: number) {
    this.http.delete("/api/products/" + `${id}`).subscribe(() => this.getProducts());
  }

  deleteSupplier(id: number) {
    this.http.delete("/api/suppliers/" + `${id}`).subscribe(() => {
      this.getProducts();
      this.getSuppliers();
    });
  }
}



