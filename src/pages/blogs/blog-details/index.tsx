
import { NextPageWithLayout } from "@/pages/_app";
import BlogSidebar from "@/shared/components/blogsSidebar";
import Breadcrumb from "@/shared/components/breadcrumb";
import CalendarIcon from "@/shared/icons/common/CalendarIcon";
import Usersvg from "@/shared/icons/common/UserSvg";
import { banner } from "@/shared/lib/image-config";
import MainLayout from "@/shared/main-layout";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogDetails: NextPageWithLayout = () => {
  return (
    <div>
      <Breadcrumb />
      <div className="container  my-[60px]">
        <div className="grid grid-cols-12 md:gap-[30px]">
          <div className="order-last col-span-12 md:order-first md:col-span-3 right-sidebar">
            <BlogSidebar />
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="mb-8">
              <Image
                src={banner.two}
                width={2000}
                height={2000}
                alt="banner image"
                className="w-full"
              />
            </div>
            <div>
              <p className="mb-3">Enjoy healthy succulents!</p>
              <Link
                href={``}
                className="block mb-3 text-2xl font-semibold truncate card-title hover:text-primary"
              >
                Basic Care Tips for Succulents: Do’s and Don’ts
              </Link>
              <div className="flex items-center gap-2 mb-8">
                <Link
                  href={``}
                  className="flex items-center gap-1 pr-2 text-sm border-r border-black border-solid group hover:text-primary "
                >
                  <Usersvg className="text-black hover:fill-blue-500" />
                  Usha Tamang
                </Link>
                <Link
                  href={``}
                  className="flex items-center gap-1 text-sm group hover:text-primary"
                >
                  <CalendarIcon className="text-black hover:fill-blue-500" />
                  22 June, 2023
                </Link>
              </div>
              <div className="blog-content">
                <p>
                  Who doesn `&apos;`t love succulents? Certainly, we all do!
                  Today let `&apos;`s learn the Do `&apos;`s and Donts of caring
                  for succulents in order to keep them happy and healthy.
                </p>
                <h4>Sunlight</h4>
                <h5>DO `&apos;`s:</h5>
                <ol>
                  <li>
                    Succulents are happy when they receive 4 to 6 hours of
                    morning light. Succulents love bright and direct light!
                  </li>
                  <li>
                    Do keep your succulents in bright spots near windows where
                    they can receive enough light.
                  </li>
                  <li>
                    Newly planted succulents should be kept in a shaded spot and
                    gradually introduced to direct sunlight.
                  </li>
                  <li>
                    Expose sun-loving succulents like Jade plant, Moonstone, and
                    Echeveria to more light to bring out their vibrant shades of
                    red-pink.
                  </li>
                </ol>
                <h5>Don `&apos;`ts:</h5>
                <ul>
                  <li>
                    Dont expose your succulents to the sun all day, avoid the
                    scorching sun. Too much heat can burn succulent leaves and
                    cause pale patches. In this case, shift your succulent to a
                    less hot and shaded spot.
                  </li>
                  <li>
                    Dont keep succulents in a dark space. Lack of sunlight can
                    make your succulent lanky and spread out, widening the gap
                    between the leaves.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;

BlogDetails.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
