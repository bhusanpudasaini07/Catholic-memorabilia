import { CartEmpty } from "@/shared/lib/image-config";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const EmptyCart = () => {
  return (
    <div className="container">
      <div className="max-w-[520px] mx-auto text-center py-12">
        <div className="">
          <Image
            className="object-contain w-64 mx-auto md:w-80"
            src={CartEmpty}
            width={350}
            height={350}
            alt="empty-cart"
          />
        </div>
        <h1 className="mb-4 text-xl font-medium md:text-2xl xl:text-3xl lg:mb-6">
          Your shopping cart is currently empty
        </h1>
        <p className="mb-4 text-md lg:text-lg">
          Thank you for using I am the Gardener. It looks like you haven&apos;t
          added any item.
        </p>
        <Link
          href='/'
          className="inline-block px-6 py-3 btn-primary rounded-3xl"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;