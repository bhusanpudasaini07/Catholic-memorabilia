import Badge from "@/shared/components/badge";
import Button from "@/shared/components/button";
import Image from "next/image";
import SearchIcon from "@/shared/icons/common/SearchIcon";
import CaretDownIcon from "@/shared/icons/common/CaretDownIcon";
import BarsIcon from "@/shared/icons/common/BarsIcon";
import Drawer from "@/shared/components/drawer";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getConfig,
  getCategoriesList,
} from "@/services/home.service";
import OfferIcon from "@/shared/icons/common/OfferIcon";
import HeartIcon from "@/shared/icons/common/HeartIcon";
import Link from "next/link";
import { getProfile } from "@/services/profile.service";
import { deleteCookie, getCookie } from "cookies-next";
import { FaChevronDown, FaUser } from "react-icons/fa";
import {
  getToken,
} from "@/shared/utils/cookies-utils/cookies.utils";
import { logout } from "@/services/auth.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import React, { useEffect, useState } from "react";
import ConfirmationModal from "@/shared/components/confirmation-modal";
import { useRouter } from "next/router";
import { getSuggestionResults } from "@/services/search.service";
import CartDropdown from "@/shared/components/cartDropdown";
import { BsCaretDownFill } from "react-icons/bs";
import { useDebounce } from "@/hooks/useDebounce.hooks";
import { ICartItem } from "@/interface/cart.interface";
import { getCartData } from "@/services/cart.service";
import { useCart } from "@/store/cart";
import { setAuthorizationHeader } from "@/axios/axiosInstance";

const Header = () => {
  const router = useRouter();
  const { pathname } = router

  const token = getToken();
  const loggedIn = getCookie('isLoggedIn');
  const { setCoupon, coupon } = useCart();
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("product");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [logIn, setLogIn] = useState<boolean>(false);

  const debounceSearch = useDebounce(searchValue, 300) //Pass search value here and then this variable to the dependency below
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)


  const { data: cart } = useQuery<ICartItem>(['getCart', logIn], () => getCartData({ coupon }));

  const { data: config, isInitialLoading } = useQuery({
    queryKey: ["getConfig"],
    queryFn: getConfig,
  });

  // const { data: home } = useQuery<IHome>({
  //   queryKey: ["getHomeData"],
  //   queryFn: getHomeData,
  // });

  const { data: categories } = useQuery({
    queryKey: ["getCategoriesList"],
    queryFn: getCategoriesList,

  });

  const { data: profile } = useQuery({
    queryKey: ["getProfile", token],
    queryFn: getProfile,
    enabled: !!token,
  });

  const { data: favouriteList }: any = useQuery(["wishlistProducts", token], {
    enabled: !!token
  })


  // const { data: favouriteList, isInitialLoading: loadingFavourite } = useQuery(
  //   ['getAllWishlistProducts', token],
  //   getAllWishlistProducts,
  //   {
  //     enabled: !!token, // Only enable the query if the token is available
  //     retry: false, // Disable automatic retries on query failure
  //     staleTime: 60000, // Set a time (in milliseconds) before the data is considered stale and a refetch is needed
  //   }
  // );



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


  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      deleteCookie("token");
      deleteCookie("isLoggedIn");
      deleteCookie("cart_number");
      await setAuthorizationHeader();
      queryClient.invalidateQueries(['getCart']);
      queryClient.invalidateQueries(['getCartList']);
      showToast(TOAST_TYPES.success, "Logged out successfully");
      router.push('/')
      setShowModal(false);
    },
  });

  const logoutHandler = () => {
    logoutMutation.mutate();
    router.push('/');
  };

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
      enabled: searchValue.length > 0 ? true : false,
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

  //setting input value to empty when page changed
  useEffect(() => {
    if (!pathname.includes('/search')) {
      setSearchValue('')
    }
  }, [pathname])


  useEffect(() => {
    if (window && localStorage && localStorage.getItem("coupon") || coupon) {
      setCoupon(localStorage.getItem('coupon') as string || coupon)
    }
  }, [window, localStorage, coupon])

  useEffect(() => {
    if (loggedIn !== undefined) {
      setLogIn(true)
    } else {
      setLogIn(false)
    }
  }, [loggedIn])

  return (
    <>
      <header>
        {/* location header */}
        <div className="z-10 bg-primary">
          <div className="container mx-auto">
            <div className="navbar bg-primary min-h-[48px] text-[12px] flex-wrap flex-col sm:flex-row px-2">
              <div className="flex-1 align-items-center">
                
                <p className="font-semibold text-white">Welcome to Catholic Memorabilia </p>
                
              </div>
              <div className="flex-none">
                <FaUser className="w-[13px] h-auto text-white me-2" />
                {token && profile ? (
                  <div className="dropdown dropdown-hover dropdown-end">
                    <label
                      tabIndex={0}
                      className="text-xs text-white py-1 m-1 px-0 capitalize bg-transparent border-0 hover:bg-transparent hover:transform hover:scale-[1.1] btn"
                    >
                      {profile?.data?.firstName}
                      <FaChevronDown />
                    </label>
                    <ul
                      tabIndex={0}
                      className="w-full min-w-[160px] py-2 px-3.5 shadow dropdown-content menu bg-base-100 top-[30px] z-[100]"
                    >
                      <li className="mx-5">
                        <Link
                          href={"/account/profile"}
                          className="text-xs text-gray-850 focus:bg-none focus:text-primary py-3 px-0 text-center font-semibold dropdown-item hover:transform hover:scale-[1.05] hover:!px-0 focus:!bg-transparent"
                        >
                          My Account
                        </Link>
                      </li>
                      <li className="mx-5 ">
                        <Link
                          href={"/checkout"}
                          className="text-xs text-gray-850 focus:bg-none focus:text-primary py-3 px-0 text-center font-semibold dropdown-item hover:transform hover:scale-[1.05] hover:!px-0 focus:!bg-transparent"
                        >
                          Checkout
                        </Link>
                      </li>
                      <li className="mx-5 ">
                        <button
                          onClick={() => setShowModal(!showModal)}
                          className="!border-b-0 dropdown-item font-semibold text-xs text-gray-850 focus:bg-none focus:text-primary py-3 px-0 text-center hover:transform hover:scale-[1.05] hover:!px-0"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                    {showModal && (
                      <ConfirmationModal
                        confirmHeading="Are you sure you want to logout?"
                        modalType="logout_modal"
                        btnName="Logout"
                        showModal={showModal}
                        btnFunction={logoutHandler}
                        cancelFuntion={() => setShowModal(false)}
                        isLoading={logoutMutation.isLoading}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex">
                    <Link
                      href={"/login"}
                      className="btn btn-link capitalize text-[12px] text-slate-50 no-underline h-auto min-h-fit p-0 hover:no-underline hover:transform hover:scale-[1.1]"
                    >
                      Login
                    </Link>
                    <div className="divider divider-horizontal before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0"></div>
                    <Link
                      href={"/register"}
                      className="btn btn-link capitalize text-[12px] text-slate-50 no-underline h-auto min-h-fit p-0 hover:no-underline hover:transform hover:scale-[1.1]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* search header */}
      <div className="px-2 py-4 border-b-[1px]  border-[#6071C60F] bg-white sticky md:static top-0 md:z-10 z-40 ">
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
                {dropdownOpen && searchValue.length > 0 && (
                  <ul
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded top-full max-h-[335px] overflow-y-auto"
                    onScroll={handleScroll}
                  >
                    {suggestData &&
                      suggestData.pages?.map((group: any, index: number) => (
                        <React.Fragment key={index}>
                          {group?.data?.map((prev: any, _i: number) => (
                            <li
                              key={_i}
                              className="p-2 cursor-pointer hover:bg-gray-100"
                            >
                              <div className="flex items-center cursor-pointer" onClick={() => redirectDetailPage(prev?.title)}>
                                <Image
                                  src={prev?.image}
                                  width={30}
                                  height={20}
                                  alt={`image-${_i}`}
                                  className="object-contain aspect-square"
                                />
                                <span className="ps-2">{prev.title}</span>
                              </div>
                            </li>
                          ))}
                        </React.Fragment>
                      ))}
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

            {/* Why Plant Button */}
            {/* <Link href="/page/why-plants" aria-label="why-plantss-2">
              <button className="btn btn-primary capitalize btn-outline !min-h-12 font-bold text-base gap-0">
                <FlowerIcon /> <p className="hidden lg:block">Why Plants</p>
              </button>
            </Link> */}
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
                  {favouriteList ? favouriteList.data?.length : 0}
                </Badge>
              </Link>
            }
            {/* Cart */}
            <CartDropdown />

            {/* md:drawer */}
            <Drawer />
          </div>
        </div>
      </div>
      {/* Category header */}
      <div className={`border-b-[1px]  md:sticky top-0 md:z-70 z-10 bg-white `}>
        <div className="container flex items-center justify-between">
          <div className="flex w-full gap-10 md:w-auto">
            <div className="dropdown dropdown-hover  md:min-w-[15rem] min-w-full">
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
                {categories?.data
                  ?.slice(0, 9)
                  .map((item: any, index: number) => (
                    <li key={`menu-${index}`} className="py-1">
                      <Link
                        href={`/categories/${item.slug}`}
                        className="py-2.5 px-5 dropdown-item hover:!pl-7"
                      >
                        {item.name}
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
            <div className="items-center hidden gap-2 md:flex">
              <Button
                type="ghost"
                className="!bg-white border-0 text-gray-550 font-bold uppercase"
                onClick={() => router.push("/")}
              >
                Home
              </Button>
              <div className="rounded-none dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="m-1 font-bold bg-transparent border-0 cursor-pointer btn text-gray-550 hover:bg-transparent hover:text-primary"
                >
                  OUR SERVICE{" "}
                  <span>
                    <BsCaretDownFill />
                  </span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu  px-0 pt-2.5 pb-0 shadow bg-base-100 w-[252px]"
                >
                  <li>
                    <Link
                      href="/page/plant-consultation"
                      className="rounded-none text-gray-750 border-b-gray-150 border-solid border-b-[1px]  text-sm  capitalize font-medium hover:bg-transparent hover:text-primary hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Plant Consultation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page/gift-a-plant"
                      className="rounded-none text-gray-750 text-sm  capitalize font-medium hover:bg-transparent hover:text-primary hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Gift a plant
                    </Link>
                  </li>
                </ul>
              </div>
              {/* <Link href="/page/our-outlets" aria-label="our-outlets" className="!bg-white border-0 text-gray-550 font-bold text-sm">  OUTLET</Link> */}
              {/* <Button
                  type="ghost"
                  className="!bg-white border-0 text-gray-550 font-bold"
                >
                  OUTLET
                </Button> */}

              <div className="dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="m-1 font-bold bg-transparent border-0 cursor-pointer btn text-gray-550 hover:bg-transparent hover:text-primary"
                >
                  ABOUT US{" "}
                  <span>
                    <BsCaretDownFill />
                  </span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu pt-2.5 pb-0 shadow bg-base-100 w-[252px]"
                >
                  <li>
                    <Link
                      href="/page/tree-installation"
                      className="rounded-none text-gray-750 hover:bg-transparent hover:text-primary border-b-gray-150 border-solid border-b-[1px]  text-sm  capitalize font-medium hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Tree Installation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page/about-us"
                      className="rounded-none text-gray-750 hover:bg-transparent hover:text-primary border-b-gray-150 border-solid border-b-[1px]  text-sm  capitalize font-medium hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page/our-values"
                      className="rounded-none text-gray-750 hover:bg-transparent hover:text-primary border-b-gray-150 border-solid border-b-[1px]  text-sm  capitalize font-medium hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Values That Make Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page/working-at-i-am-the-gardener"
                      className="rounded-none text-gray-750 hover:bg-transparent hover:text-primary border-b-gray-150 border-solid border-b-[1px]  text-sm  capitalize font-medium hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Working At I Am The Gardner
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/page/csr-projects"
                      className="rounded-none text-gray-750 text-sm  capitalize font-medium hover:bg-transparent hover:text-primary hover:pl-[20px] transition-all duration-200 ease-linear outline-none"
                    >
                      Our CSR Project
                    </Link>
                  </li>
                </ul>
              </div>
              <Link href="/blogs" aria-label="header-blogs">
                <Button
                  type="ghost"
                  className="!bg-white border-0 text-gray-550 font-bold uppercase"
                >
                  BLOGS
                </Button>
              </Link>
            </div>
          </div>
          <Link href="/offer" aria-label="header-offer">
            <button className="btn btn-ghost !bg-white !border-0 text-gray-550 gap-1 font-bold hidden md:flex">
              <OfferIcon className="text-accent" />
              OFFER
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
