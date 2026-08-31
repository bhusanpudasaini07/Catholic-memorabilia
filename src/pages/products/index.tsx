import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../_app";
import Input from "postcss/lib/input";
import Image from 'next/image';

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
