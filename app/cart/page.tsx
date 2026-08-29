import Container from '../components/Container';
import CartClient from './CartClient';
export const dynamic = 'force-dynamic';

const Cart = async () => {
  return (
    <div className="pt-8">
      <Container>
        <CartClient/>
      </Container>
    </div>
  );
};

export default Cart;
