
import AccountSidebarLayout from "@/shared/account-sidebar-layout";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React from "react";
import OrderTable from "@/features/My-Account/order-components/order-table";

const Order = () => {
  return (
    <>
      <Head>
        <title> | Orders</title>
      </Head>
      <h5 className="px-6 py-4 text-xl border-b border-solid border-gray-350">
        Orders
      </h5>
      <OrderTable />
    </>
  );
};

export default Order;

Order.getLayout = (page: any) => {
  return <MainLayout>
    <AccountSidebarLayout>{page}</AccountSidebarLayout>
  </MainLayout>;
};
