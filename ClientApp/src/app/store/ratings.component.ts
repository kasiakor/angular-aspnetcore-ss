import { Component, Input } from "@angular/core";
import { Product } from "../models/product.model";

@Component({
  selector: "store-ratings",
  templateUrl: "ratings.component.html"
})

export class RatingsComponent {
  //allows component to receive data from the template in which it is applied to
  @Input()
  product: Product;

  //generates an array of booleans
  //three starts will generate true, true, true, false, false
  get stars(): boolean[] {
    if (this.product != null && this.product.ratings != null) {
      let total = this.product.ratings.map(r => r.stars)
        .reduce((prev, curr) => prev + curr, 0);
      console.log("total rating:" + total);
      let count = Math.round(total / this.product.ratings.length);
      console.log("count: total/total.product.ratings.length" + count);
      return Array(5).fill(false).map((value, index) => {
        return index < count;
      });
    } else {
      return [];
    }
  }
}
