class ProductList {
  constructor() {
    this.arr = [];
  }

  addProduct(id) {
    this.arr.push(id);
  }

  searchTypeProduct(searchName) {
    let productSearch = [];
    if (searchName === "") {
      productSearch = [...this.arr];
    } else {
      console.log(this.arr);
      for (let i = 0; i < this.arr.length; i++) {
        const product = this.arr[i];
        console.log("data", product);
        const keyword = searchName.toLowerCase();
        const productNameLower = product.name.toLowerCase();

        if (productNameLower.indexOf(keyword) > -1) {
          productSearch.push(product);
        }
      }
    }
    return productSearch;
  }

  filterProduct(type) {
    let productFiltered = [];
    if (type === "lowPrice") {
      const lowToHigh = [...this.arr].sort((a, b) => a.price - b.price);
      console.log(lowToHigh);
      productFiltered = [...lowToHigh];
    } else if (type === "highPrice") {
      const highToLow = [...this.arr].sort((a, b) => b.price - a.price);
      console.log(highToLow);
      productFiltered = [...highToLow];
    } else {
      productFiltered = [...this.arr];
    }

    return productFiltered;
  }
}

export default ProductList;
