import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { getProduct, getStock } from "../services/product";
import { Product } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const existCart = cart.find(({ id }) => id === productId);
      const stock = await getStock(productId);

      if (existCart) {
        if (stock.amount > existCart.amount) {
          const newCart = { ...existCart, amount: existCart.amount + 1 };
          const newCarts = cart.map((oldCart) =>
            oldCart.id !== productId ? oldCart : newCart
          );
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCarts));
          setCart(newCarts);
        } else toast.error("Quantidade solicitada fora de estoque");
      } else {
        if (stock.amount > 0) {
          const product = await getProduct(productId);
          const newCarts = [...cart, { amount: 1, ...product }];
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCarts));
          setCart(newCarts);
        }
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const existProduct = cart.find(({ id }) => id === productId);
      if (!existProduct) throw new Error("");
      const newCarts = cart.filter(({ id }) => id !== productId);
      setCart(newCarts);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCarts));
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const product = cart.find(({ id }) => id === productId);
      if (!product) throw new Error("");
      const stock = await getStock(productId);

      if (amount > 0) {
        if (amount <= stock.amount) {
          product.amount = amount;
          const newCarts = cart.map((cart) =>
            cart.id === productId ? product : cart
          );
          localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCarts));
          setCart(newCarts);
        } else toast.error("Quantidade solicitada fora de estoque");
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
