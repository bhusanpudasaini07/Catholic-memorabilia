import { handleKeyDownAlphabet } from "@/shared/utils/form-validation-utils";
import React from "react";

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isExpiryValid = (value: string) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month, 0, 23, 59, 59);
  return expiry >= now;
};

const CreditCardForm = ({
  register,
  errors,
  trigger,
}: {
  register: any;
  errors: any;
  trigger: any;
}) => {
  const cardNumberField = register("cardNumber", {
    required: "Card number is required",
  });

  const expiryField = register("expiry", {
    required: "Expiry date is required",
    validate: (value: string) =>
      isExpiryValid(value) || "Enter a valid expiry date (MM/YY)",
  });

  const cvvField = register("cvv", {
    required: "CVV is required",
    pattern: {
      value: /^\d{3,4}$/,
      message: "Enter a 3 or 4 digit CVV",
    },
  });

  return (
    <div className="mt-3 rounded border border-gray-300 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-gray-650">Card details</p>

      <div className="mb-[20px] flex flex-col">
        <input
          type="text"
          placeholder="Name on card"
          autoComplete="cc-name"
          {...register("cardholderName", {
            required: "Name on card is required",
            validate: (value: string) =>
              !!value?.trim() || "Name on card is required",
            pattern: {
              value: /^[A-Za-z][A-Za-z\s'.-]*$/,
              message: "Enter the name as it appears on the card",
            },
          })}
          onKeyUp={() => trigger("cardholderName")}
          onKeyDown={handleKeyDownAlphabet}
          className={`h-[45px] w-full border px-3.5 text-sm text-gray-650 outline-0 ${errors.cardholderName ? "border-error" : "border-[#ced4da]"}`}
        />
        {errors.cardholderName && (
          <p className="mt-1 text-xs leading-[24px] text-error">
            {errors.cardholderName.message}
          </p>
        )}
      </div>

      <div className="mb-[20px] flex flex-col">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="Card number"
          maxLength={23}
          {...cardNumberField}
          onChange={(e) => {
            e.target.value = formatCardNumber(e.target.value);
            cardNumberField.onChange(e);
          }}
          onKeyUp={() => trigger("cardNumber")}
          className={`h-[45px] w-full border px-3.5 text-sm text-gray-650 outline-0 ${errors.cardNumber ? "border-error" : "border-[#ced4da]"}`}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-xs leading-[24px] text-error">
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            maxLength={5}
            {...expiryField}
            onChange={(e) => {
              e.target.value = formatExpiry(e.target.value);
              expiryField.onChange(e);
            }}
            onKeyUp={() => trigger("expiry")}
            className={`h-[45px] w-full border px-3.5 text-sm text-gray-650 outline-0 ${errors.expiry ? "border-error" : "border-[#ced4da]"}`}
          />
          {errors.expiry && (
            <p className="mt-1 text-xs leading-[24px] text-error">
              {errors.expiry.message}
            </p>
          )}
        </div>

        <div className="flex w-[140px] flex-col">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="CVV"
            maxLength={4}
            {...cvvField}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
              cvvField.onChange(e);
            }}
            onKeyUp={() => trigger("cvv")}
            className={`h-[45px] w-full border px-3.5 text-sm text-gray-650 outline-0 ${errors.cvv ? "border-error" : "border-[#ced4da]"}`}
          />
          {errors.cvv && (
            <p className="mt-1 text-xs leading-[24px] text-error">
              {errors.cvv.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
