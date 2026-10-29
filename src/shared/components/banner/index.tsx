import React from "react";
import Button from "../button";
import { FaArrowRight } from "react-icons/fa";
import { getBanner } from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";

const Banner = () => {
  const scrollToBundles = () => {
    document.getElementById("bundles")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const { data: banner } = useQuery({
    queryKey: ["banner"],
    queryFn: () => getBanner(),
  });

  const imageUrl = banner?.[0]?.imageUrl || "/images/home-banner.png";

  return (
    <section
      className="hero min-h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    >
      <div className="container mx-auto">
        <div>
          <h1 className="text-5xl font-bold text-primary leading-snug">
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
            <Button
              size="md"
              type="primary"
              className="p-4 text-white"
              onClick={scrollToBundles}
            >
              Explore Bundles
              <span className="ml-2">
                <FaArrowRight className="text-white" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
