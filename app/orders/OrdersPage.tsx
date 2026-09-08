import getOrdersByUserId from '../actions/getOrdersByUSerId';
import NullData from '../components/NullData';
import { SafeUser } from '../types';
import OrdersClient from './OrdersClient';

interface OrdersPageProps {
  currentUser: SafeUser | null;
}

const OrdersPage: React.FC<OrdersPageProps> = async ({
  currentUser,
}) => {
  if (currentUser) {
    const orders = await getOrdersByUserId(currentUser.id);
    if (!orders || orders.length === 0) {
      return <NullData title="No orders yet" />;
    }

    if (orders) {
      return <OrdersClient orders={orders} />;
    }
  }
  return null;
};

export default OrdersPage;