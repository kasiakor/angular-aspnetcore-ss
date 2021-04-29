//To define a class as a service in Angular, use the @Injectable() decorator to provide the metadata that allows Angular to inject it into a component as a dependency.
//Dependency Injection(DI) is a core concept of Angular 2 + and allows a class receive dependencies from another class. Most of the time in Angular, dependency injection is done by injecting a service class into a component or module class.
import { Injectable, NgZone } from "@angular/core";
import { Repository } from "./models/repository";
import { Product } from "./models/product.model";


@Injectable()
export class ExternalService {
  constructor(private repository: Repository, private zone: NgZone) {
    //window object provides access to js runtime's global scope
    //Blazor will use this global property to locate angular functionality
      window["angular_searchProducts"] = this.doSearch.bind(this);
  }
  async doSearch(searchTerm: string): Promise<Product[]> {
    //zone - reentering angular zone from the task that was executed outside angular zone
    //search term is received from blazor passed to repository and getProducts is called
    //data received by repository will update repository but no angular app as the changed was triggered by blazor
    //use ngzone object to resolve the update in angular, when ngzone.run function is executed angular runs update cycle
    return this.zone.run(async () => {
      this.repository.filter.search = searchTerm;
      return (await this.repository.getProducts()).data;
    })
  }
}
