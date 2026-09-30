import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../_app";


const ProductsPage: NextPageWithLayout = () => {
  return (
    <>
     <p>Product page</p>
    </>
  );
};

export default ProductsPage;
ProductsPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
