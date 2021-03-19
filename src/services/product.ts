import { ProductProps, Stock } from "../models/Product";
import { api } from "./api";

export async function getStock(id: number): Promise<Stock> {
  return new Promise((resolve, reject) => {
    api
      .get(`/stock/${id}`)
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
}
export async function getProducts(): Promise<ProductProps[]> {
  return new Promise((resolve, reject) => {
    api
      .get(`/products`)
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
}
export async function getProduct(id: number): Promise<ProductProps> {
  return new Promise((resolve, reject) => {
    api
      .get(`/products/${id}`)
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
}
