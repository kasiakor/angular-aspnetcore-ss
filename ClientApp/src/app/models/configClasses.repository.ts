export class Filter {
  category?: string;
  search?: string;

  reset() {
    this.category = this.search = null;
  }
}
