class Service {
  fetchListData() {
    const promise = axios({
      url: "https://688b65992a52cabb9f519560.mockapi.io/api/Product",
      method: "GET",
    });
    return promise;
  }

  deleteProductApi(id) {
    const promise = axios({
      url: `https://688b65992a52cabb9f519560.mockapi.io/api/Product/${id}`,
      method: "DELETE",
    });
    return promise;
  }

  addProductApi(product) {
    const promise = axios({
      url: `https://688b65992a52cabb9f519560.mockapi.io/api/Product`,
      method: "POST",
      data: product,
    });
    return promise;
  }

  getProductByIdApi(id) {
    const promise = axios({
      url: `https://688b65992a52cabb9f519560.mockapi.io/api/Product/${id}`,
      method: "GET",
    });
    return promise;
  }

  updateProductApi(product) {
    const promise = axios({
      url: `https://688b65992a52cabb9f519560.mockapi.io/api/Product/${product.id}`,
      method: "PUT",
      data: product,
    });
    return promise;
  }
}

export default new Service();
