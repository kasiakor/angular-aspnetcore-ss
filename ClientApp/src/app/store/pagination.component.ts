import { Component } from "@angular/core";
import { NavigationService } from "../models/navigation.service";

@Component({
  selector: "store-pagination",
  templateUrl: "pagination.component.html"
})

export class PaginationComponent {
  constructor(public navigation: NavigationService) { }

  get pages(): number[] {
    if (this.navigation.productCount > 0) {
      console.log("pages:" + this.navigation.productCount
        / this.navigation.productsPerPage);
      console.log("Math ceil pages:" + Math.ceil(this.navigation.productCount
        / this.navigation.productsPerPage));
      console.log("Array:" + Array(Math.ceil(this.navigation.productCount
        / this.navigation.productsPerPage))
        .fill(0).map((x, i) => i + 1));
      return Array(Math.ceil(this.navigation.productCount
        / this.navigation.productsPerPage))
        .fill(0).map((x, i) => i + 1);
    } else {
      return [];
    }
  }

}
