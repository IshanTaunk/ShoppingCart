import Container from "./components/Container";
import { TopBanner } from "./components/TopBanner";
import ProductsPage from "./products/page";

export default function Home() {
  return (
      <>
        <Container>
          <TopBanner/>
          <ProductsPage/>
        </Container>
      </>
  );
}
