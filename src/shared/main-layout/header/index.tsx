import Badge from "@/shared/components/badge";
import Button from "@/shared/components/button";
import Image from "next/image";
import SearchIcon from "@/shared/icons/common/SearchIcon";
import CaretDownIcon from "@/shared/icons/common/CaretDownIcon";
import BarsIcon from "@/shared/icons/common/BarsIcon";
import Drawer from "@/shared/components/drawer";
import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import HeartIcon from "@/shared/icons/common/HeartIcon";
import Link from "next/link";
import {  getCookie } from "cookies-next";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSuggestionResults } from "@/services/search.service";
import CartDropdown from "@/shared/components/cartDropdown";
import { useDebounce } from "@/hooks/useDebounce.hooks";
import { useCategoriesHooks } from "@/hooks/categories.hooks";
import ProfileDropmenu from "./profile-dropmenu";
import { getWishlists } from "@/services/wishlist.service";

const Header = () => {
  const router = useRouter();
  const { categories } = useCategoriesHooks();


  const token = getCookie('token');
  const loggedIn = getCookie('isLoggedIn');

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("product");
  const [logIn, setLogIn] = useState<boolean>(false);

  const debounceSearch = useDebounce(searchValue, 300) //Pass search value here and then this variable to the dependency below
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)




  const { data: favouriteList, isInitialLoading: loadingFavourite } = useQuery(
    ['wishlistProducts'],
    () => getWishlists(1, 10),
    
  );

  console.log("favouriteList==>", favouriteList);



  // const { data: favouriteList, isInitialLoading: loadingFavourite } = useQuery({
  //   queryKey: ["getAllWishlistProducts"],
  //   queryFn: async () => {
  //     if (token) {
  //       const response = await getAllWishlistProducts();
  //       return response;
  //     }
  //   },
  //   enabled: !!token
  // })



  //suggestion
  const {
    data: suggestData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["suggest", selectedType || "", debounceSearch],
    () =>
      getSuggestionResults(selectedType || "", searchValue || ""),
    {
      enabled: searchValue?.length > 0 ? true : false,
    }
  )

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handleScroll = (event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    const scrolledToBottom = scrollHeight - scrollTop === clientHeight;

    if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
      handleLoadMore();
    }
  };

  const handleTypeChange = (text: string) => {
    setSelectedType(text);
  };

  const handleInputChange = (event: any) => {
    setDropdownOpen(true)
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    const query = {
      type: selectedType,
      keyword: searchValue,
    };
    setDropdownOpen(false)
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const redirectDetailPage = (title: string) => {
    const query = {
      type: selectedType,
      keyword: title,
    };
    setSearchValue(title)
    setDropdownOpen(false)
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  }


  useEffect(() => {
    if (loggedIn !== undefined) {
      setLogIn(true)
    } else {
      setLogIn(false)
    }
  }, [loggedIn])


  return (
    <div className=" sticky  top-0 md:z-10 z-[99]">

      {/* search header */}
      <div className="px-2 py-4 border-b-[1px]  border-[#6071C60F] bg-white ">
        <div className="container flex items-center justify-between w-full gap-3 max-h-12 sm:max-h-24">
          {/* Logo */}
          <div className="relative ">
            <Link href={"/"} aria-label="home_blank">
              <Image className="max-w-[150px]" src={"/logos.png"} height={80} width={144} quality={100} alt="Logo"
                style={{ width: "auto", height: "auto" }}
                priority />
            </Link>
          </div>

          <div className="items-center justify-center flex-grow hidden gap-7 md:flex ms-auto">
            {/* Search */}

            <div className="border-[1px] border-[#E4E4E4] rounded-md h-[48px] !outline-offset-0 flex items-center justify-between gap-1 w-[60%]">
              <div className="relative w-full">
                <div className="flex items-center justify-between gap-1 ">
                  <input
                    type="text"
                    placeholder={`Search ${selectedType}`}
                    className="input input-ghost w-full max-w-xs !shadow-none !outline-none md:max-w-2xl"
                    value={searchValue}
                    onChange={handleInputChange}
                  />
                  <div className="divider divider-horizontal before:bg-[#E4E4E4] before:w-[1px] after:w-[1px] after:bg-[#E4E4E4] m-0 my-2"></div>
                  <div className={`dropdown`}>
                    <label
                      tabIndex={0}
                      className={` m-1 whitespace-nowrap text-[#555] text-sm font-medium flex gap-1 justify-center items-center`}
                    >
                      <span className="capitalize">{selectedType}</span>
                      <CaretDownIcon />
                    </label>
                    <ul
                      tabIndex={0}
                      className={`dropdown-content menu shadow p-0 bg-base-100 rounded-sm min-w-[110px] z-[60] `}
                    >
                      <li onClick={() => handleTypeChange("product")}>
                        <span>Product</span>
                      </li>
                      <li onClick={() => handleTypeChange("category")}>
                        <span>Category</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {dropdownOpen && searchValue?.length > 0 && (
                  <ul
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded top-full max-h-[335px] overflow-y-auto"
                    onScroll={handleScroll}
                  >
                    {suggestData && suggestData.pages && suggestData.pages.length > 0 ? (
                      suggestData.pages.map((group: any, index: number) => (
                        <React.Fragment key={index}>
                          {group?.map((prev: any, _i: number) => (
                            <li
                              key={_i}
                              className="p-2 cursor-pointer hover:bg-gray-100"
                            >
                              <div className="flex items-center cursor-pointer" onClick={() => redirectDetailPage(prev?.productName || prev?.categoryName)}>
                                <Image
                                  src={prev?.productImageUrl  || prev?.categoryImageUrl || '/images/no-image.png'}
                                  width={30}
                                  height={20}
                                  alt={`image-${_i}`}
                                  className="object-contain aspect-square"
                                />
                                <span className="ps-2">{prev.productName || prev.categoryName}</span>
                              </div>
                            </li>
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <li className="p-2">
                        <span className="text-gray-500">No results found</span>
                      </li>
                    )}
              
                   
                  </ul>
                )}
                
              </div>

              <button
                className="py-3 rounded-l-none btn btn-primary rounded-r-md"
                onClick={handleSearch}
                name="Search Icon"
              >
                <SearchIcon />
              </button>
            </div>

          </div>

          <div className="flex items-center gap-3">
            {/* Heart Button */}
            {
              token &&
              <Link href="/wishlist" aria-label="header-wishlist" className="relative hidden py-3 btn btn-circle md:flex">
                <HeartIcon className="text-black" />
                <Badge
                  className="badge-accent "
                  type="primary"
                  badgePosition="top-right"
                >
                  {/* {favouriteList ? favouriteList.data?.length : 0} */}
                </Badge>
              </Link>
            }
            {/* Cart */}
            <CartDropdown logIn={logIn} />



            {/* md:drawer */}
            <Drawer />
          </div>
        </div>
      </div>
      {/* Category header */}
      <div className={`border-b-[1px] md:sticky top-0 md:z-70 z-10 bg-white`}>
        <div className="container flex items-center justify-between">
          <div className="flex w-full gap-10 md:w-auto">
            <div className="dropdown dropdown-hover md:min-w-[15rem] min-w-full w-full">
              <label
                tabIndex={1}
                className="btn btn-primary rounded-sm font-bold text-white capitalize flex justify-between flex-nowrap whitespace-nowrap md:min-w-[15rem] !min-h-[3rem] min-w-full remove-focus"
              >
                <BarsIcon />
                All Categories <CaretDownIcon />
              </label>
              <ul
                tabIndex={1}
                className={`w-full p-0 shadow dropdown-content menu bg-base-100`}
              >
                {categories && categories?.items?.length > 0 && categories?.items?.slice(0, 9)?.map((item: any, index: number) => (
                  <li key={`menu-${index}`} className="py-1">
                    <Link
                      href={`/categories/${item.id}`}
                      className="py-2.5 px-5 dropdown-item hover:!pl-7"
                    >
                      {item.categoryName}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/categories" aria-label="header-categories" className="py-2.5 px-5 dropdown-item hover:!pl-7">
                    + More categories
                  </Link>
                </li>
              </ul>
            </div>
            <div className="items-center hidden gap-2 md:flex w-full">
              <Button
                type="ghost"
                className="!bg-white border-0 text-gray-550 font-bold uppercase"
                onClick={() => router.push("/")}
              >
                Home
              </Button>
              <Link href="/new-in" className="flex items-center">
                <Button
                  type="ghost"
                  className="!bg-white border-0 text-gray-550 font-bold uppercase whitespace-nowrap"
                >
                  New In
                </Button>
              </Link>

              <Link href="/offer">
                <Button
                  type="ghost"
                  className="!bg-white border-0 text-gray-550 font-bold uppercase"
                >
                  Sale
                </Button>
              </Link>
            </div>
          </div>
          {/* Move ProfileDropmenu to the far right */}
          <div className="flex items-center gap-2 ms-auto justify-end">
            <ProfileDropmenu logIn={logIn} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
