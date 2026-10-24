import { TopBanner } from "./components/TopBanner";
import ProductsPage from "./products/page";

export default function Home() {
  return (
      <>
        <div className="w-full min-w-0 max-w-[1920px] md:px-8">
          <TopBanner/>
          <ProductsPage/>
        </div>
      </>
  );
}
