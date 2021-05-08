import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Filter, Pagination } from "./configClasses.repository";
import { Supplier } from "./supplier.model";
import { Observable } from "rxjs";
import { Order, OrderConfirmation } from "./order.model";

const productsUrl = "/api/products";
const sessionUrl = "/api/session";
const ordersUrl = "/api/orders";

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
  orders: Order[] = [];

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
  //getProducts() { - replaced with promise to change app state trogered by blazor
  //A promise is a placeholder for a future value./angular uses observables
  getProducts(): Promise<productMetadata> {
    let url = `${productsUrl}?related=${this.filter.related}`;
    if (this.filter.category) {
      url += `&category=${this.filter.category}`;
    }
    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }
    url += "&metadata=true";
    //this.http.get<productMetadata>(url).subscribe(md => {
    return this.http.get<productMetadata>(url)
      .toPromise<productMetadata>()
      .then(md => {
        this.products = md.data;
        this.categories = md.categories;
        return md;
      });
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

  //result is discarded but http.Client doesnt send request untill subscribe method is called
  storeSessionData<T>(dataType: string, data: T) {
    return this.http.post(`${sessionUrl}/${dataType}`, data)
      .subscribe(response => { });
  }

  getSessionData<T>(dataType: string): Observable<T> {
    return this.http.get<T>(`${sessionUrl}/${dataType}`);
  }

  //orders
  getOrders() {
    this.http.get<Order[]>(ordersUrl)
      .subscribe(data => this.orders = data);
  }

  createOrder(order: Order) {
    this.http.post<OrderConfirmation>(ordersUrl, {
      name: order.name,
      address: order.address,
      payment: order.payment,
      products: order.products
    }).subscribe(data => {
      order.orderConfirmation = data
      order.cart.clear();
      order.clear();
    });
  }

  //http post request to update the order and then http get request to update the data
  //order admin component
  shipOrder(order: Order) {
    this.http.post(`${ordersUrl}/${order.orderId}`, {})
      .subscribe(() => this.getOrders())
  }
}



