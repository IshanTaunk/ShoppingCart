import { CartProductType } from "@/app/products/[productId]/ProductDetails";
import { createContext, ReactNode, useContext, useState } from "react";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
};

export const CartContext =
  createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}
export const CartContextProvider: React.FC<
  CartProviderProps
> = ({ children }) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<
    CartProductType[] | null
  >(null);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);

  const value: CartContextType = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts: cartProducts,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      'useCart must be used within a CartContextProvider',
    );
  }
  return context;
};