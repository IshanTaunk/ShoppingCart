import { Order, User } from "@prisma/client";

interface OrdersClientProps {
  orders: ExtendedOrder[];
}
type ExtendedOrder = Order & {
  user: User;
};

const OrdersClient: React.FC<OrdersClientProps> = ({
  orders,
}) => {
    return (
    <div className="max-w-[1150px] m-auto text-xl"></div>);
}
export default OrdersClient;