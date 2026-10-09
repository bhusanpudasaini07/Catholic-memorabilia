import React from "react";
import Button from "../button";
import { FaArrowRight } from "react-icons/fa";

const Banner = () => {
 

  return (
   <section
  className="hero min-h-[500px]"
  style={{
    backgroundImage: "url('/images/home-banner.png')",
  }}
>
  {/* <div className="hero-overlay bg-black/20"></div> */}

  <div className="container mx-auto">
    <div className="">
      <h1 className="text-5xl font-bold text-primary leading-snug ">
       Meaningful Catholic Gifts
        <br />
        Inspire By Faith
      </h1>

      <p className="py-6 text-lg text-secondary leading-snug">
        Discover meaningful Catholic treasures that inspire faith
        <br />
        and bring blessings to everyday life.
      </p>
      <div className="flex gap-3 mt-2">

      <Button size="md" type="primary" className="p-4 text-white">
       Explore the Collections
       <span className="ml-2"><FaArrowRight className="text-white" /></span>
      </Button>

     
      </div>
    </div>
  </div>
</section>
  );
};

export default Banner;
