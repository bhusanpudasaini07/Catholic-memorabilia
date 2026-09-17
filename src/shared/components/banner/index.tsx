import React from "react";
import Button from "../button";

const Banner = () => {
 

  return (
   <section
  className="hero min-h-[500px]"
  style={{
    backgroundImage: "url('/images/banner.png')",
  }}
>
  <div className="hero-overlay bg-black/20"></div>

  <div className="hero-content text-center">
    <div className="max-w-2xl">
      <h1 className="text-5xl font-bold text-white">
        Faith in Every Moment.
        <br />
        Love in Every Detail.
      </h1>

      <p className="py-6 text-lg text-white">
        Discover meaningful Catholic treasures that inspire faith
        and bring blessings to everyday life.
      </p>
      <div className="flex justify-center gap-3">

      <Button size="md" type="primary" className="p-4">
        Shop Now
      </Button>

      <Button  size="md" type="info" className="p-4">
        Explore Collections
      </Button>
      </div>
    </div>
  </div>
</section>
  );
};

export default Banner;
