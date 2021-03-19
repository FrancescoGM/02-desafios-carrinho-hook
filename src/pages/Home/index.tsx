import { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";
import { getProducts } from "../../services/product";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const product = await getProducts();
      const productsFormatted: ProductFormatted[] = product.map((product) => ({
        priceFormatted: formatPrice(product.price),
        ...product,
      }));
      setProducts(productsFormatted);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cart.find((item) => item.id === product.id)?.amount || 0}
              {/* {cartItemsAmount[product.id] || 0} */}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
