import { signUp } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegister } from "../../../interface/register.interface";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import ButtonLoader from "@/shared/components/btn-loading";
import {
  handleKeyDownAlphabet,
  handleKeyDownNumber,
} from "@/shared/utils/form-validation-utils";



const AU_STATES = [
  { label: "Australian Capital Territory", value: "ACT" },
  { label: "New South Wales", value: "NSW" },
  { label: "Northern Territory", value: "NT" },
  { label: "Queensland", value: "QLD" },
  { label: "South Australia", value: "SA" },
  { label: "Tasmania", value: "TAS" },
  { label: "Victoria", value: "VIC" },
  { label: "Western Australia", value: "WA" },
];

interface AddressSuggestion {
  label: string;
  addressLine1: string;
  suburb: string;
  state: string;
  postcode: string;
}


const useAddressAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 4) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          q: query,
          format: "jsonv2",
          addressdetails: "1",
          countrycodes: "au",
          limit: "5",
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        );
        const data = await res.json();

        const mapped: AddressSuggestion[] = data.map((item: any) => {
          const addr = item.address || {};
          const streetParts = [addr.house_number, addr.road]
            .filter(Boolean)
            .join(" ");
          const suburb =
            addr.suburb || addr.city || addr.town || addr.village || "";
          const stateName = addr.state || "";
          const stateAbbr =
            AU_STATES.find(
              (s) => s.label.toLowerCase() === String(stateName).toLowerCase(),
            )?.value || "";

          return {
            label: item.display_name,
            addressLine1: streetParts || item.display_name.split(",")[0],
            suburb,
            state: stateAbbr,
            postcode: addr.postcode || "",
          };
        });

        setSuggestions(mapped);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    clearSuggestions: () => setSuggestions([]),
  };
};

const RegisterForm = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, "User Created Successfully.");
      router.push("/login");
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      errors.map((err: any) => {
        showToast(TOAST_TYPES.error, err.detail);
      });
    },
  });

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    trigger,
  } = useForm<IRegister>();

  const registerSubmit: SubmitHandler<IRegister> = (data: any) => {
    mutation.mutate(data);
  };

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
    <form onSubmit={handleSubmit(registerSubmit)} autoComplete="off">
      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          placeholder="Enter Your First Name"
          {...register("firstName", {
            required: "First name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Only alphabetical characters are allowed",
            },
          })}
          maxLength={20}
          onKeyUp={() => trigger("firstName")}
          onKeyDown={handleKeyDownAlphabet}
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.firstName ? "border-error" : "border-gray-350"}`}
        />
        {errors.firstName && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          placeholder="Enter Your Middle Name"
          {...register("middleName", {
            required: "Middle name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Only alphabetical characters are allowed",
            },
          })}
          maxLength={20}
          onKeyUp={() => trigger("middleName")}
          onKeyDown={handleKeyDownAlphabet}
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.middleName ? "border-error" : "border-gray-350"}`}
        />
        {errors.middleName && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.middleName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          {...register("lastName", {
            required: "Last name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Only alphabetical characters are allowed",
            },
          })}
          placeholder="Enter Your Last Name"
          onKeyUp={() => trigger("lastName")}
          maxLength={20}
          onKeyDown={() => {
            handleKeyDownAlphabet;
          }}
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.lastName ? "border-error" : "border-gray-350"}`}
        />
        {errors.lastName && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.lastName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          {...register("contactNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^\+614\d{8}$/,
              message: "Enter a valid Australian mobile number",
            },
          })}
          onKeyUp={() => trigger("contactNumber")}
          maxLength={12}
          inputMode="tel"
          placeholder="+61412345678"
          onKeyDown={handleKeyDownNumber}
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.contactNumber ? "border-error" : "border-gray-350"}`}
        />
        {errors.contactNumber && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.contactNumber.message}
          </p>
        )}
      </div>
      <div className="flex flex-col mb-[20px]">
        <input
          type="text"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          onKeyUp={() => trigger("email")}
          placeholder="Enter Your Email"
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.email ? "border-error" : "border-gray-350"}`}
        />
        {errors.email && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col mb-[20px]">
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 7,
              message: "Password must have at least 8 characters.",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
            },
          })}
          onKeyUp={() => trigger("password")}
          className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.password ? "border-error" : "border-gray-350"}`}
        />
        {errors.password && (
          <p className="text-error text-xs leading-[24px] mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ---------- Address Section ---------- */}
      <div className="mb-[10px]">
        <p className="text-sm font-semibold text-gray-650 mb-2">Address</p>
      </div>

      {/* Address search / autocomplete */}
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
            onChange={() => trigger("state")}
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
      {/* ---------- End Address Section ---------- */}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="submit-btn"
          disabled={mutation.isLoading}
        >
          Sign Up
          {mutation.isLoading && <ButtonLoader />}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
