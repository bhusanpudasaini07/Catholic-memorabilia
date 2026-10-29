import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import Image from 'next/image';

export interface IEmptyPage {
  type?: string | string[];
}

const EmptyPage = ({ type }: IEmptyPage) => {
  return (
    <div className="pt-0">
      <div className="container">
        <div>
          <Image
            src="/images/search-empty.svg"
            alt=""
            className="flex mx-auto img-fluid"
            width={330} height={330}
          />
          <div className="text-center">
            <h2 className="text-lg font-medium capitalize">No {type || 'Products'} Found</h2>
            <p> Thank you for using 
               {/* I am the Gardener.  */}
               We will be in contact with more details shortly.</p>
          </div>
          <div className="mt-10 text-center">
            <Link href="/" className="bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full transition-all delay-100 duration-150 hover:bg-slate-850" aria-label="continue-shopping" >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
};

export default EmptyPage;
