import { AddressSuggestion, AU_STATES, useAddressAutocomplete } from '@/features/Auth/register-form';
import { handleKeyDownNumber } from '@/shared/utils/form-validation-utils';
import React, { useState } from 'react'

const ShipingForm = ({ register, errors, setValue, trigger }: { register: any, errors: any, setValue: any, trigger: any }) => {
  const {
    query,
    setQuery,
    suggestions,
    loading: addressLoading,
    clearSuggestions,
  } = useAddressAutocomplete();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelectSuggestion = (s: AddressSuggestion) => {
    setValue("addressLine1", s.addressLine1, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("suburb", s.suburb, { shouldValidate: true, shouldDirty: true });
    setValue("state", s.state, { shouldValidate: true, shouldDirty: true });
    setValue("postcode", s.postcode, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setQuery(s.label);
    setShowSuggestions(false);
    clearSuggestions();
  };

  return (
    <>
      <div className="mb-[10px]">
        <p className="text-sm font-semibold text-gray-650 mb-2">Shipping Address</p>
      </div>

      <div className="flex flex-col mb-[20px] relative">
        <input
          type="text"
          placeholder="Start typing your address (e.g. 12 Smith St, Adelaide)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border border-gray-350"
        />
        {addressLoading && (
          <p className="text-xs text-gray-400 mt-1">Searching addresses…</p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-[45px] left-0 w-full bg-white border border-gray-350 z-10 max-h-[220px] overflow-y-auto shadow-md">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onMouseDown={() => handleSelectSuggestion(s)}
                className="px-3.5 py-2 text-sm text-gray-650 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                {s.label}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Search above to auto-fill the fields below, or enter your address
          manually.
        </p>
      </div>

      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          placeholder="Street Address"
          {...register("addressLine1", {
            required: "Street address is required",
            validate: (value: string) => !!value?.trim() || "Street address is required",
          })}
          onKeyUp={() => trigger("addressLine1")}
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.addressLine1 ? "border-error" : "border-gray-350"}`}
        />
        {errors.addressLine1 && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.addressLine1.message}
          </p>
        )}
      </div>

      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          placeholder="Apartment, Unit, Suite (optional)"
          {...register("addressLine2")}
          className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border border-gray-350"
        />
      </div>

      <div className="flex gap-3 mb-[20px]">
        <div className="flex flex-col flex-1">
          <input
            type="text"
            placeholder="Suburb"
            {...register("suburb", {
              required: "Suburb is required",
              validate: (value: string) => !!value?.trim() || "Suburb is required",
            })}
            onKeyUp={() => trigger("suburb")}
            className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.suburb ? "border-error" : "border-gray-350"}`}
          />
          {errors.suburb && (
            <p className="text-error text-xs leading-[24px] mt-1">
              {errors.suburb.message}
            </p>
          )}
        </div>

        <div className="flex flex-col w-[160px]">
          <select
            {...register("state", {
              required: "State is required",
            })}
            defaultValue=""
            className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border bg-white ${errors.state ? "border-error" : "border-gray-350"}`}
          >
            <option value="" disabled>
              State
            </option>
            {AU_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-error text-xs leading-[24px] mt-1">
              {errors.state.message}
            </p>
          )}
        </div>

        <div className="flex flex-col w-[120px]">
          <input
            type="text"
            placeholder="Postcode"
            {...register("postcode", {
              required: "Postcode is required",
              pattern: {
                value: /^\d{4}$/,
                message: "Enter a valid 4-digit postcode",
              },
            })}
            onKeyUp={() => trigger("postcode")}
            maxLength={4}
            inputMode="numeric"
            onKeyDown={handleKeyDownNumber}
            className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.postcode ? "border-error" : "border-gray-350"}`}
          />
          {errors.postcode && (
            <p className="text-error text-xs leading-[24px] mt-1">
              {errors.postcode.message}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default ShipingForm
