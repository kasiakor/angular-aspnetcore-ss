//To define a class as a service in Angular, use the @Injectable() decorator to provide the metadata that allows Angular to inject it into a component as a dependency.
//Dependency Injection(DI) is a core concept of Angular 2 + and allows a class receive dependencies from another class. Most of the time in Angular, dependency injection is done by injecting a service class into a component or module class.
import { Injectable } from "@angular/core";
import { Repository } from "./models/repository";
import { Product } from "./models/product.model";


@Injectable()
export class ExternalService {
  constructor(private repository: Repository) {
    //window object provides access to js runtime's global scope
    //Blazor will use this global property to locate angular functionality
      window["angular_searchProducts"] = this.doSearch.bind(this);
  }
  doSearch(searchTerm: string): Product[] {
    let lowerTerm = searchTerm.toLowerCase();
    return this.repository.products.filter(p => p.name.toLowerCase().includes(lowerTerm) || p.description.toLowerCase().includes(lowerTerm));
  }
}
