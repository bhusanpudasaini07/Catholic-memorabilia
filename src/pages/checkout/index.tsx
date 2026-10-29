import MainLayout from "@/shared/main-layout";
import { showToast, TOAST_TYPES } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { IPaymentMethod } from "@/interface/home.interface";
import { useRouter } from "next/router";
import ConfirmationModal from "@/shared/components/confirmation-modal";
import LoginForm from "@/features/Auth/login-form";
import { getCookie, setCookie } from "cookies-next";
import OrderNote from "@/features/Checkout/order-note";
import CheckoutDetail from "@/features/Checkout/checkout-detail";
import ButtonLoader from "@/shared/components/btn-loading";
import { NextPageWithLayout } from "../_app";
import { associateCart } from "@/services/cart.service";
import { useProfileHooks } from "@/hooks/profile.hooks";
import { FaCcApplePay, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import { createOrder } from "@/services/checkout.service";
import { useCartsHooks } from "@/hooks/cart.hooks";
import GuestForm from "./guestform/guestform";
import { SubmitHandler, useForm } from "react-hook-form";

const Checkout: NextPageWithLayout = () => {
  const { profile } = useProfileHooks();
  const { cartList } = useCartsHooks();
  const router = useRouter();
  const queryClient = useQueryClient();
  const loggedIn = getCookie('isLoggedIn');

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<any>({ mode: "onChange", shouldUnregister: false });

  // STEPPER STATE
  const [personalOpen, setPersonalOpen] = useState<boolean>(!loggedIn);
  const [addressOpen, setAddressOpen] = useState<boolean>(!!loggedIn);
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false);

  // MODAL STATE
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showLoginConfirmModal, setShowLoginConfirmModal] = useState<boolean>(false);
  const [showAssociateCartModal, setAssociateCartModal] = useState<boolean>(false);

  // DATA/FORM STATE
  const [personalInfoSubmitted, setPersonalInfoSubmitted] = useState<boolean>(false);
  const [addressFilled, setAddressFilled] = useState<boolean>(false)
  const [selectedShipping, setSelectedShipping] = useState<string>("standard");

  // Duplicate accidentally existed in original code, FIX: define only once, clear default
  const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod | null>(null);


  const [note, setNote] = useState<string>("");
  const [paymentCollapseOpen, setPaymentCollapseOpen] = useState<boolean>(false);


  // Modal open/toggle
  const openLoginModal = () => setShowLoginConfirmModal(true);
  const openLoginFormModal = () => {
    setShowLoginModal(true);
    setShowLoginConfirmModal(false);
  };
  const toggleLoginModal = () => setShowLoginModal(prev => !prev);

  // Fix: Associate Cart Modal
  const associateCartModal = async (value: string) => {
    const associateCartResponse: any = await associateCart(loggedIn, value);
    queryClient.invalidateQueries(['cartList']);
    queryClient.invalidateQueries(['getProfile']);
    router.push('/checkout');
    setAssociateCartModal(false);
  };

  const handleGuestFormSubmit: SubmitHandler<any> = () => {
    setPersonalInfoSubmitted(true);
    setPersonalOpen(false);
    setAddressFilled(true);
    setPaymentCollapseOpen(true);
    setPaymentOpen(true);
  };

  const handleNextButtonClick = () => {
    if (!profile?.addressLine1 || !profile?.suburb || !profile?.state || !profile?.postcode) {
      showToast(TOAST_TYPES.error, 'Please complete your profile shipping address first.');
      return;
    }
    setPaymentCollapseOpen(true);
    setAddressOpen(false);
    setPaymentOpen(true);
    setAddressFilled(true);
  };

  // Create Order mutation
  const oderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      checkoutSuccessfulRedirect();
      queryClient.invalidateQueries(['cartList']);
      if (!loggedIn) localStorage.removeItem('cart');
    },
    onError: () => {
      showToast(TOAST_TYPES.error, 'Failed to create order');
    },
  });

  // Place Order logic
  const handlePlaceOrder = async () => {
    if ((!loggedIn && (!personalInfoSubmitted || !(await trigger()))) ||
        (loggedIn && !addressFilled) || !paymentCollapseOpen || !selectedPayment || !selectedShipping || !cartList?.items?.length) {
      showToast(TOAST_TYPES.error, 'Please complete the checkout details and add an item to your cart.');
      return;
    }
    const guest = getValues();
    const customer = loggedIn ? profile : guest;
    const payload = {
      ...(loggedIn ? { userId: profile?.id } : {}),
      guestName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
      guestEmail: customer?.email,
      guestPhone: customer?.contactNumber,
      addressLine1: customer?.addressLine1,
      addressLine2: customer?.addressLine2,
      suburb: customer?.suburb,
      state: customer?.state,
      postcode: customer?.postcode,
      items: cartList.items.map((item: any) => ({
        productId: item.productId ?? item.product?.id,
        quantity: item.quantity,
      })),
    };
    oderMutation.mutate(payload);
  };

  // Redirect on success
  const checkoutSuccessfulRedirect = () => {
    goToCheckoutReviewPage(true);
    showToast(TOAST_TYPES.success, 'Checkout Successful.');
  };

  const goToCheckoutReviewPage = (success: boolean) => {
    router.push({
      pathname: '/checkout/review',
      query: { success: success.toString() },
    });
  };

  // Side effect to set addressOpen state based on login
  useEffect(() => {
    setAddressOpen(!!loggedIn);
    setPersonalOpen(!loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      setAddressFilled(false);
    }
  }, [profile]);

  // Editing guest details requires the customer to confirm them again.
  useEffect(() => {
    const subscription = watch(() => { setPersonalInfoSubmitted(false); setPaymentCollapseOpen(false); setAddressFilled(false); });
    return () => subscription.unsubscribe();
  }, [watch]);

  // --- MAIN RENDER ---
  return (
    <div className="my-16">
      <div className="container">
        <h3 className="mb-4 text-3xl font-bold">Your Order</h3>
        {
          !loggedIn &&
          <p>
            Already have an account?
            <a className="ml-3 cursor-pointer text-primary" onClick={openLoginModal}>Log in</a>
          </p>
        }

        {/* Login Confirmation Modal */}
        {showLoginConfirmModal && (
          <ConfirmationModal
            confirmHeading="Your previous cart items will be replaced with current cart items."
            modalType="delete_account_modal"
            btnName="Continue"
            showModal={showLoginConfirmModal}
            btnFunction={openLoginFormModal}
            cancelFuntion={() => setShowLoginConfirmModal(false)}
            isLoading={false}
          >
            <h5 className="mt-3 text-lg font-bold">Are you sure you want to login?</h5>
          </ConfirmationModal>
        )}
        {/* Login Modal */}
        {showLoginModal && (
          <>
            <input type="checkbox" id="new" className="modal-toggle" defaultChecked />
            <div className="modal">
              <div className="p-4 rounded-lg modal-box">
                <LoginForm closeModal={toggleLoginModal} setAssociateCartModal={setAssociateCartModal} />
              </div>
              <label
                className="modal-backdrop"
                htmlFor="new"
                onClick={() => setShowLoginModal(false)}
              ></label>
            </div>
          </>
        )}
        {/* Associate Cart Modal */}
        {showAssociateCartModal && (
          <ConfirmationModal
            confirmHeading="You already have items. Do you want to delete your previous items?"
            modalType="delete_account_modal"
            btnName="Merge"
            cancelBtnName="Remove"
            showModal={showAssociateCartModal}
            btnFunction={() => associateCartModal('false')}
            cancelFuntion={() => associateCartModal('true')}
            isLoading={false}
          />
        )}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            {/* Accordion Start */}
            <div>
              {/* Step 1: Personal Information for Guest */}
              {
                !loggedIn &&
                <div className="collapse collapse-arrow p-4 border-solid border-[1px] border-gray-1200 mb-[16px]">
                  <input
                    type="radio"
                    name="personal"
                    checked={personalOpen}
                    onClick={() => { setPersonalOpen(true); setAddressOpen(false); setPaymentOpen(false); }}
                    readOnly
                  />
                  <div className="flex items-center justify-between text-xl font-medium border-none collapse-title">
                    <div className="text-left col-10">
                      <h5 className="text-[16px] font-semibold">
                        1. Personal Information
                      </h5>
                    </div>
                    <div className="text-right col-2">
                      <span className="text-white text">
                        <TiTick
                          size={20}
                          className={`rounded-full ${personalInfoSubmitted ? 'bg-primary' : 'bg-gray-650'}`}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="collapse-content ">
                    <form onSubmit={handleSubmit(handleGuestFormSubmit)}>
                    <GuestForm 
                    register={register} 
                    errors={errors}
                     handleSubmit={handleSubmit} 
                     setValue={setValue}
                     getValues={getValues}
                     trigger={trigger}
                    />
                      <button
                          type="submit"
                          disabled={!isValid}
                          className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                        >
                          Next
                        </button>
                      </form>
                  </div>
                </div>
              }

              {/* Step 2: Shipping Address */}
              <div className={`collapse collapse-arrow p-4 border-solid border-[1px] border-orange-550 mb-[16px] ${!loggedIn ? "hidden" : ""}`}>
                <input
                  type="radio"
                  name="address"
                  checked={addressOpen}
                  onClick={() => { setAddressOpen(true); setPersonalOpen(false); setPaymentOpen(false); }}
                  readOnly
                />
                <div className="flex items-center justify-between text-xl font-medium border-none collapse-title">
                  <div className="text-left col-10">
                    <h5 className="text-[16px] font-semibold">
                      {" "}
                      2. Shipping Address{" "}
                    </h5>
                  </div>
                  <div className="text-right col-2">
                    <span className="text-white text">
                      <TiTick
                        size={20}
                        className={`rounded-full ${addressFilled ? 'bg-primary' : 'bg-gray-650'}`}
                      />
                    </span>
                  </div>
                </div>
                <div className="collapse-content">
                  {loggedIn ? (
                    <>
                      <div className="grid grid-cols-12 gap-5 p-4">
                        {profile && (
                          <div className="col-span-12">
                            <div className="card bg-slate-200 p-4 rounded-lg">
                              <div className="grid grid-cols-12 ">
                                <div className=" name col-span-6 flex items-center gap-2">
                                  <FaUser className="w-[13px] h-auto me-2" />
                                  <h5 className="text-[16px] font-semibold">
                                    {profile.firstName} {profile.lastName}
                                  </h5>
                                </div>
                                <div className="email col-span-6 flex items-center gap-2">
                                  <FaEnvelope className="w-[13px] h-auto me-2" />
                                  <p className="text-[14px] text-gray-650">
                                    {profile.email}
                                  </p>
                                </div>
                                <div className="phone col-span-6 flex items-center gap-2">
                                  <FaPhone className="w-[13px] h-auto me-2" />
                                  <p className="text-[14px] text-gray-650">
                                    {profile.contactNumber}
                                  </p>
                                </div>
                                <div className="address col-span-12 flex  gap-2">
                                  <FaMapMarkerAlt className="w-[13px] h-auto me-2" />
                                  <p className="text-[14px] text-gray-650">
                                    {profile.addressLine1}
                                    <br />
                                    {profile.suburb}, {profile.state} {profile.postcode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          className="bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                          onClick={handleNextButtonClick}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Step 3: Shipping Options */}
              <div className={`collapse collapse-arrow p-4 border-solid border-[1px] border-orange-550 mb-[16px] ${paymentCollapseOpen ? '' : 'pointer-events-none'}`}>
                <input
                  type="radio"
                  name="shipping_options"
                  checked={paymentCollapseOpen}
                  onClick={() => { setAddressOpen(false); setPersonalOpen(false); setPaymentOpen(false); setPaymentCollapseOpen(true); }}
                  readOnly
                />
                <div className="flex items-center justify-between text-xl font-medium border-none collapse-title">
                  <div className="text-left col-10">
                    <h5 className="text-[16px] font-semibold">
                      3. Choose your shipping options
                    </h5>
                  </div>
                  <div className="text-right col-2">
                    <span className="text-white text">
                      <TiTick
                        size={20}
                        className={`rounded-full ${selectedShipping ? 'bg-primary' : 'bg-gray-650'}`}
                      />
                    </span>
                  </div>
                </div>
                <div className="collapse-content">
                  <div className="bg-white">
                    <div className="flex flex-col gap-2">
                      {/* Standard Shipping Option */}
                      <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all duration-100 ${selectedShipping === "standard" ? "border-black shadow-[0_0_0_2px_#000]" : "border-gray-300"}`}
                        style={{
                          background: selectedShipping === "standard" ? "rgba(0,0,0,0.03)" : "white"
                        }}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={selectedShipping === "standard"}
                          onChange={() => setSelectedShipping("standard")}
                          className="mt-1 accent-black w-5 h-5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[16px]">Standard Shipping</span>
                          </div>
                          <div className="text-[15px] font-normal mt-1">
                            <span className="font-bold">AU$7.95&nbsp;</span>
                            <span className="text-gray-600 text-[13px] font-normal">(4-8 business days.)</span>
                          </div>
                        </div>
                      </label>






                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Options */}
              <div className={`collapse collapse-arrow p-4 border-solid border-[1px] border-orange-550 mb-[16px] ${paymentCollapseOpen ? '' : 'pointer-events-none'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOpen}
                  onClick={() => { setAddressOpen(false); setPersonalOpen(false); setPaymentOpen(true); setPaymentCollapseOpen(true); }}
                  readOnly
                />
                <div className="flex items-center justify-between text-xl font-medium border-none collapse-title">
                  <div className="text-left col-10">
                    <h5 className="text-[16px] font-semibold">
                      4. Choose your payment method
                    </h5>
                  </div>
                  <div className="text-right col-2">
                    <span className="text-white text">
                      <TiTick
                        size={20}
                        className={`rounded-full ${selectedPayment?.title ? 'bg-primary' : 'bg-gray-650'}`}
                      />
                    </span>
                  </div>
                </div>
                <div className="collapse-content">
                  <div className="flex flex-col gap-4">
                    {/* Cash On Delivery */}
                    <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all duration-100 ${selectedPayment?.title === "Cash on Delivery" ? "border-black shadow-[0_0_0_2px_#000]" : "border-gray-300"}`}
                      onClick={() => setSelectedPayment({ title: "Cash on Delivery", id: 1 })}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={selectedPayment?.title === "Cash on Delivery"}
                        onChange={() => setSelectedPayment({ title: "Cash on Delivery", id: 1 })}
                        className="mt-1 accent-black w-5 h-5"
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <BsCash className="text-2xl" />
                          <span className="font-bold text-[16px]">Cash on Delivery</span>
                        </div>
                      </div>
                    </label>



                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-3xl font-bold">Order Note</h3>
              <OrderNote
                note={note}
                setNote={setNote}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <CheckoutDetail selectedPayment={selectedPayment} />
            <div className="mt-[25px]">
              {
                <button
                  disabled={oderMutation.isLoading || !paymentCollapseOpen || !selectedPayment || !cartList?.items?.length || (!loggedIn && (!personalInfoSubmitted || !isValid)) || (!!loggedIn && !addressFilled)}
                  className="flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none font-bold text-base-100 py-[18px] px-[20px] uppercase rounded-full cursor-pointer bg-primary w-full hover:bg-darkBlack"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                  {
                    oderMutation.isLoading &&
                    <ButtonLoader className="!block" />
                  }
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
Checkout.getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};
