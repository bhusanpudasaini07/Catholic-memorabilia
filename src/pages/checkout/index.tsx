import { IDeliveryAddress } from "@/interface/delivery-address.interface";
import { getDeliverAddress} from "@/services/delivery-address.service";
import MainLayout from "@/shared/main-layout";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { showToast, TOAST_TYPES } from "@/shared/utils/toast-utils/toast.utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { getConfig } from "@/services/home.service";
import { IPaymentMethod} from "@/interface/home.interface";
import { checkout } from "@/services/checkout.service";
import { PaymentMethod } from "@/shared/enum";
import { useRouter } from "next/router";
import ConfirmationModal from "@/shared/components/confirmation-modal";
import LoginForm from "@/features/Auth/login-form";
import { IRegister } from "@/interface/register.interface";
import { registerGuestUser } from "@/services/auth.service";
import { setCookie } from "cookies-next";
import PersonalInformation from "@/features/Checkout/personal-information";
import OrderNote from "@/features/Checkout/order-note";
import CheckoutDetail from "@/features/Checkout/checkout-detail";
import CheckoutPayment from "@/features/Checkout/checkout-payment";
import GuestUserAddress from "@/features/Checkout/checkout-address/guest-user-address";
import DeliveryAddressModal from "@/shared/components/delivery-address-modal";
import Address from "@/features/Address";
import ButtonLoader from "@/shared/components/btn-loading";
import { NextPageWithLayout } from "../_app";
import { associateCart, getCartProduct } from "@/services/cart.service";
import { ICartData } from "@/interface/cart.interface";

const Checkout: NextPageWithLayout = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showLoginConfirmModal, setShowLoginConfirmModal] = useState<boolean>(false);
  const [checkoutGuestUserData, setCheckoutGuestUserData] = useState<IRegister | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [personalOpen, setPersonalOpen] = useState<boolean>(true)
  const [addressOpen, setAddressOpen] = useState<boolean>(false)
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false)
  const [placeBtnDisable, setPlaceBtnDisable] = useState<boolean>(false)
  const [note, setNote] = useState<string>("");
  const token = getToken()
  //Get Config Data
  const { data: config, isInitialLoading } = useQuery({
    queryKey: ["getConfig"],
    queryFn: getConfig,
  });

  const setGuestUserData = (data: IRegister | null) => {
    setCheckoutGuestUserData(data);
  };

  const { data: cartData } = useQuery<ICartData>(['getCartList'], getCartProduct);
  const queryClient = useQueryClient();

  const [personalInfoSubmitted, setPersonalInfoSubmitted] = useState<boolean>(false);
  const [showAssociateCartModal, setAssociateCartModal] = useState<boolean>(false);
  const [addressFilled, setAddressFilled] = useState<boolean>(false)
  const [addressCollapseDisabled, setAddressCollapseDisabled] = useState<boolean>(true);
  const [addressFormValidated, setAddressFormValidated] = useState<boolean>(false);
  const [paymentCollapseOpen, setPaymentCollapseOpen] = useState<boolean>(false);

  const handleAddressSubmitGuest = (e: any) => {
    e.preventDefault();
    if (guestformData.lat === 0 || guestformData.lng === 0) {
      showToast(TOAST_TYPES.error, 'Please select a location');
      return;
    }
    setAddressFormValidated(true);
    if (guestformData.lat && guestformData.lng && guestformData.title) {
      setAddressFormValidated(false);
    } else {

      setAddressFormValidated(false);
    }

  };

  const handleNextButtonClick = () => {
    setPaymentCollapseOpen(true);
    setAddressFilled(true)
    setAddressOpen(false)
    setPaymentOpen(true)
  };

  const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod | null>(null);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  const [formData, setFormData] = useState<IDeliveryAddress>({
    address: '',
    mobile_number: '',
    name: '',
    default: false,
    lat: 0,
    lng: 0,
    title: ''
  });

  const [guestformData, setGuestFormData] = useState<IDeliveryAddress>({
    address: '',
    mobile_number: '',
    name: '',
    default: false,
    lat: 0,
    lng: 0,
    title: '',
    id: 0
  });

  //Open Login Modal

  const openLoginModal = () => {
    setShowLoginConfirmModal(true);
  };

  const openLoginFormModal = () => {
    setShowLoginModal(true);
    setShowLoginConfirmModal(false);
  };

  const associateCartModal = async(value: string) => {
    const associateCartResponse:any = await associateCart(token, value);
    if(associateCartResponse){
      queryClient.invalidateQueries(['getCart'])
      queryClient.invalidateQueries(['getCartList'])
      queryClient.invalidateQueries(['getProfile'])
      router.push('/checkout');
      setAssociateCartModal(false);
    } else{
      setAssociateCartModal(false);
    }
  };

  // Function to toggle the login modal
  const toggleLoginModal = () => {
    setShowLoginModal((prev) => !prev);
  };


  const { data: deliveryAddressData, refetch: getDeliveryAddress } = useQuery({
    queryKey: ["getDeliverAddress", token],
    queryFn: getDeliverAddress,
    enabled: !!token
  });

  


  // Checkout Place order
  const handlePlaceOrder = async () => {
    setPlaceBtnDisable(true)
    if (token) {
      const selectedDeliveryAddressId = selectedDeliveryAddress;
      const selectedPaymentMethodId = selectedPayment?.id;
      checkout(selectedDeliveryAddressId, selectedPaymentMethodId, note)
        .then((res) => {
          switch (selectedPayment?.title) {
            case PaymentMethod.CASH_ON_DELIVERY:
              checkoutSuccessfulRedirect();
              break;
          }
          setPlaceBtnDisable(false)
        })
        .catch((error) => {
          showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message)
        });
    } else {
      if (checkoutGuestUserData) {
        const completeGuestUserData = {
          ...guestformData,
          ...checkoutGuestUserData,
        };
        try {
          const guestUserRegisterResponse = await registerGuestUser(completeGuestUserData, false);
          const selectedPaymentMethodId = selectedPayment?.id;
          setCookie('token', guestUserRegisterResponse?.data?.accessToken);
          setCookie('isLoggedIn', true)
          setPlaceBtnDisable(false)
          checkout(guestUserRegisterResponse?.data?.deliveryAddress?.data?.id, selectedPaymentMethodId, note)
            .then((res) => {
              switch (selectedPayment?.title) {
                case PaymentMethod.CASH_ON_DELIVERY:
                  checkoutSuccessfulRedirect();
                  break;
              }
            })
            .catch((error) => {
              // Handle error
              showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message)
            });
        } catch (error: any) {
          showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message)
        }
      }
    }

  };

  const checkoutSuccessfulRedirect = () => {
    goToCheckoutReviewPage(true);
    showToast(TOAST_TYPES.success, 'Checkout Successful.');
  };

  const goToCheckoutReviewPage = (success: any) => {
    router.push({
      pathname: '/checkout/review',
      query: { success: success.toString() },
    });
  };

  useEffect(() => {
    const defaultPayment = config?.data?.paymentMethods?.find((payment: IPaymentMethod) => payment.isDefault);
    if (defaultPayment) {
      setSelectedPayment(defaultPayment);
    }

    const defaultAddress = deliveryAddressData?.find((address: any) => address.isDefault);
    if (defaultAddress) {
      setSelectedDeliveryAddress(defaultAddress.id);
    }
  }, [config?.data?.paymentMethods, deliveryAddressData]);


  useEffect(() => {
    if (token) {
      setAddressOpen(true);
    }
  }, [token])
  return (
    <div>
      <div className="mt-[60px] mb-[40px]">
        <div className="container">
          <h3 className="mb-4 text-3xl font-bold">Your Order</h3>
          {
            !token &&
            <p>
              Already have an account?
              <a className="ml-3 cursor-pointer text-primary" onClick={openLoginModal}>Log in</a>
            </p>

          }
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
          {showLoginModal && (
            <>
              <input type="checkbox" id="new" className="modal-toggle" defaultChecked />
              <div className="modal">
                <div className="p-4 rounded-lg modal-box">
                  <LoginForm closeModal={toggleLoginModal} setAssociateCartModal={setAssociateCartModal}/>
                </div>
                <label
                  className="modal-backdrop"
                  htmlFor="new"
                  onClick={() => setShowLoginModal(false)}
                ></label>
              </div>

            </>
          )}
            {showAssociateCartModal && (
            <>
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

            </>
          )}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7">
              {/* Accordion Start */}
              <div>
                {
                  !token &&
                  <div className="collapse collapse-arrow p-4 border-solid border-[1px] border-gray-1200 mb-[16px]">
                    <input
                      type="radio"
                      name="address"
                      defaultChecked={personalOpen}
                      onClick={() => { setAddressOpen(false); setPaymentOpen(false) }}
                      readOnly />
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
                      <PersonalInformation
                        addressCollapseDisabled={addressCollapseDisabled}
                        setAddressCollapseDisabled={setAddressCollapseDisabled}
                        personalInfoSubmitted={personalInfoSubmitted}
                        setPersonalInfoSubmitted={setPersonalInfoSubmitted}
                        guestUserData={checkoutGuestUserData}
                        setGuestUserData={setGuestUserData}
                        setPersonalOpen={setPersonalOpen}
                        setAddressOpen={setAddressOpen}
                      />
                    </div>
                  </div>
                }

                <div className={`collapse collapse-arrow p-4 border-solid border-[1px] border-orange-550 mb-[16px] ${(!token && addressCollapseDisabled) ? 'pointer-events-none' : ''}`}>
                  <input
                    type="radio"
                    name="address"
                    onClick={() => { setAddressOpen(true); setPersonalOpen(false); setPaymentOpen(false) }}
                    checked={addressOpen}
                    readOnly />
                  <div className="flex items-center justify-between text-xl font-medium border-none collapse-title">
                    <div className="text-left col-10">
                      {token ? (
                        <h5 className="text-[16px] font-semibold">
                          {" "}
                          1. Address{" "}
                        </h5>
                      ) : (
                        <h5 className="text-[16px] font-semibold">
                          {" "}
                          2. Address{" "}
                        </h5>
                      )}
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
                    {token ? (
                      <>
                        <div className="grid grid-cols-12 gap-5 p-4">


                          {showModal && (
                            <>
                              <DeliveryAddressModal
                                formData={formData}
                                setFormData={setFormData}
                                setShowModal={setShowModal}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                              />
                            </>
                          )}
                          <Address
                            formData={formData}
                            setFormData={setFormData}
                            setShowModal={setShowModal}
                            showModal={showModal}
                            setIsEditing={setIsEditing} />

                        </div>
                        <div className="text-right">
                          <button
                            type="submit"
                            className="bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                            onClick={handleNextButtonClick}
                          >
                            Next
                          </button>
                        </div>
                      </>
                    ) : (
                      // Guest User Address Section
                      <div>

                        <form className="py-4" onSubmit={handleAddressSubmitGuest}>
                          <GuestUserAddress guestformData={guestformData} setGuestFormData={setGuestFormData} />
                        </form>
                        <div className="text-right">
                          <button
                            type="submit"
                            disabled={guestformData.title === ''}
                            className=" disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                            onClick={handleNextButtonClick}
                          >
                            Next
                            {
                              addressFormValidated &&
                              <ButtonLoader />
                            }
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Address Section */}
                  </div>
                </div>

                <div className={`collapse collapse-arrow p-4 border-solid border-[1px] border-orange-550 mb-[16px] ${paymentCollapseOpen ? '' : 'pointer-events-none'}`}>
                  <input
                    type="radio"
                    name="address"
                    checked={paymentOpen}
                    onClick={() => { setAddressOpen(false); setPersonalOpen(false); setPaymentOpen(true) }}
                    readOnly />
                  <div className="flex items-center justify-between text-xl font-medium border-none collapse-title">
                    <div className="text-left col-10">
                      {token ? (
                        <h5 className="text-[16px] font-semibold">
                          {" "}
                          2. Payment Method{" "}
                        </h5>
                      ) : (
                        <h5 className="text-[16px] font-semibold">
                          {" "}
                          3. Payment Method{" "}
                        </h5>
                      )}
                    </div>
                    <div className="text-right col-2">
                      <span className="text-white text">
                        <TiTick
                          size={20}
                          className="rounded-full bg-gray-650"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="collapse-content">
                    <CheckoutPayment selectedPayment={selectedPayment} handlePaymentChange={setSelectedPayment} />
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
                <button
                  disabled={placeBtnDisable}
                  className="flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-pointer-not-allowed disabled:pointer-events-none font-bold text-base-100 py-[18px] px-[20px] uppercase rounded-full cursor-pointer bg-primary w-full hover:bg-darkBlack"
                  onClick={() => handlePlaceOrder()}>
                  Place Order
                  {
                    placeBtnDisable &&
                    <ButtonLoader className="!block" />
                  }
                </button>
              </div>
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


