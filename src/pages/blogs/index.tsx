import MainLayout from "@/shared/main-layout";
import React, { useState } from "react";
import { NextPageWithLayout } from "../_app";
import BlogsCard from "@/shared/components/blogsCard";
import Pagination from "@/shared/components/pagination";
import BlogSidebar from "@/shared/components/blogsSidebar";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/services/blog.service";
import { IBlogItem } from "@/interface/blog.interface";
import EmptyPage from "@/components/emptyPage";
import Breadcrumb from "@/shared/components/breadcrumb";
import Head from "next/head";
import SkeletonBlogCard from "@/shared/components/skeleton/blog-card";
import { useRouter } from "next/router";
import { getPageData } from "@/services/page.service";

const Blogs: NextPageWithLayout = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const perPage = 4;

  const { data: blogs, isLoading, error } = useQuery(
    ["getBlogs"], async () =>
    await getBlogs()
      .then(response => {
        return response;
      })
  )

  const handlePageChange = (value: number) => {
    setPageNumber(value)
  }
  return (
    <div>
      <Head>
        <title>Blogs</title>
      </Head>
      <Breadcrumb />
      <div className="container  my-[60px]">
        <div className="grid grid-cols-12 md:gap-[30px]">
          <div className="order-last col-span-12 md:order-first md:col-span-3 right-sidebar">
            <BlogSidebar />
          </div>

          {blogs && blogs?.data?.length === 0 ? (
            <EmptyPage />
          ) : (
            <div className="col-span-12 md:col-span-9">
              {
                isLoading ? (
                  <div className="col-span-12 text-center md:col-span-9">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {[1, 2, 3, 4].map((index) => (
                        <SkeletonBlogCard
                          key={`app-skeleton-${index}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {blogs?.data.map((blog: IBlogItem, index: any) => (
                        <BlogsCard blog={blog} key={`app-blog-${index}`} />
                      ))}
                    </div>
                    <Pagination
                      totalPages={blogs?.meta?.pagination?.total_pages}
                      currentPage={blogs?.meta?.pagination?.current_page}
                      pageChange={handlePageChange}
                    />
                  </>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
Blogs.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
