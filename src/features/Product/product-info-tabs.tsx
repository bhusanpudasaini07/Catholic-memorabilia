import { useProfileHooks } from "@/hooks/profile.hooks";
import {
  addProductReview,
  deleteProductReview,
  getProductReviews,
  updateProductReview,
} from "@/services/product.service";
import ButtonLoader from "@/shared/components/btn-loading";
import { showToast, TOAST_TYPES } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

type ProductTab = "description" | "reviews";

interface ReviewUser {
  id: number;
  firstName?: string;
  lastName?: string;
}

interface ProductReview {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  userId: number;
  user?: ReviewUser;
}

interface ProductReviewSummary {
  totalReviews?: number;
  averageRating?: number;
  reviews?: ProductReview[];
}

interface ProductInfoTabsProps {
  productId?: number;
  description: string;
}

const StarRating = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange?: (rating: number) => void;
  label: string;
}) => {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      className="flex items-center gap-1"
      role={onChange ? "radiogroup" : "img"}
      aria-label={label}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= shown;
        const starClass = `text-[18px] ${filled ? "text-primary" : "text-gray-300"}`;
        if (!onChange) {
          return <FaStar key={star} className={starClass} aria-hidden />;
        }
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            className="p-0.5 leading-none"
          >
            <FaStar className={starClass} />
          </button>
        );
      })}
    </div>
  );
};

const reviewerName = (review: ProductReview) => {
  const name = `${review.user?.firstName ?? ""} ${review.user?.lastName ?? ""}`.trim();
  return name || "Customer";
};

const errorMessage = (error: any) => {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message[0];
  if (typeof message === "string" && message) return message;
  return "Something went wrong. Please try again.";
};

const ProductInfoTabs = ({ productId, description }: ProductInfoTabsProps) => {
  const queryClient = useQueryClient();
  const loggedIn = Boolean(getCookie("isLoggedIn"));
  const { profile } = useProfileHooks();
  const [activeTab, setActiveTab] = useState<ProductTab>("description");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<{ comment?: string; rating?: string }>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: Boolean(productId),
  });

  const summary: ProductReviewSummary = data?.reviews ? data : data?.data ?? {};
  const reviews = Array.isArray(summary.reviews) ? summary.reviews : [];
  const average = Number(summary.averageRating ?? 0);
  const totalReviews = summary.totalReviews ?? reviews.length;
  const myReview = reviews.find((review) => review.userId === profile?.id);

  useEffect(() => {
    setRating(0);
    setComment("");
    setErrors({});
  }, [productId]);

  useEffect(() => {
    if (!myReview) return;
    setRating(myReview.rating);
    setComment(myReview.comment ?? "");
  }, [myReview?.id, myReview?.rating, myReview?.comment]);

  const refreshReviews = () => {
    queryClient.invalidateQueries(["productReviews", productId]);
  };

  const addMutation = useMutation({
    mutationFn: (review: { rating: number; comment: string }) => addProductReview(productId, review),
    onSuccess: () => {
      showToast(TOAST_TYPES.success, "Thanks for your review.");
      refreshReviews();
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, errorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (review: { rating: number; comment: string }) =>
      updateProductReview(productId, myReview?.id, review),
    onSuccess: () => {
      showToast(TOAST_TYPES.success, "Your review was updated.");
      refreshReviews();
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, errorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProductReview(productId, myReview?.id),
    onSuccess: () => {
      setRating(0);
      setComment("");
      showToast(TOAST_TYPES.success, "Your review was deleted.");
      refreshReviews();
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, errorMessage(error));
    },
  });

  const isSaving = addMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: { comment?: string; rating?: string } = {};
    if (!rating) nextErrors.rating = "Select a star rating.";
    if (!comment.trim()) nextErrors.comment = "Write a short comment.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !productId) return;

    const payload = { rating, comment: comment.trim() };
    if (myReview) {
      updateMutation.mutate(payload);
      return;
    }
    addMutation.mutate(payload);
  };

  const tabs: { id: ProductTab; label: string }[] = [
    { id: "description", label: "Product Description" },
    { id: "reviews", label: totalReviews ? `Reviews (${totalReviews})` : "Reviews" },
  ];

  return (
    <div className="mb-[60px]">
      <div className="container">
        <div className="flex justify-center gap-10 border-b border-gray-200" role="tablist">
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`relative uppercase pb-3 text-lg font-bold text-center ${selected ? "text-slate-850" : "text-gray-650"}`}
              >
                {tab.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-[-1px] h-[2px] bg-primary transition-all duration-300 ${selected ? "w-full" : "w-0"}`}
                />
              </button>
            );
          })}
        </div>

        {activeTab === "description" ? (
          <div role="tabpanel" className="px-8 py-10 text-base leading-6 text-left bg-white border border-t-0 border-gray-200">
            {description ? (
              <div className="text-justify description__text" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-gray-650">This product has no description yet.</p>
            )}
          </div>
        ) : (
          <div role="tabpanel" className="px-6 py-8 bg-white border border-t-0 border-gray-200 md:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                  <p className="text-4xl font-bold text-slate-850">{average ? average.toFixed(1) : "0.0"}</p>
                  <div>
                    <StarRating value={Math.round(average)} label={`${average.toFixed(1)} out of 5 stars`} />
                    <p className="mt-1 text-sm text-gray-650">
                      {totalReviews === 1 ? "Based on 1 review" : `Based on ${totalReviews} reviews`}
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <p className="text-gray-650">Loading reviews...</p>
                ) : isError ? (
                  <p className="text-gray-650">Reviews could not be loaded.</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-650">No reviews yet. Be the first to rate this product.</p>
                ) : (
                  <ul className="flex flex-col gap-6">
                    {reviews.map((review) => {
                      const name = reviewerName(review);
                      const isMine = review.userId === profile?.id;
                      return (
                        <li key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-10 h-10 font-bold rounded-full shrink-0 bg-orange-150 text-primary">
                              {name.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <p className="font-semibold text-slate-850">{name}</p>
                                {isMine && <p className="text-xs font-semibold text-primary">You</p>}
                                <p className="text-xs text-gray-650">
                                  {new Date(review.createdAt).toLocaleDateString("en-AU", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="mt-1">
                                <StarRating value={review.rating} label={`${review.rating} out of 5 stars`} />
                              </div>
                              {review.comment && (
                                <p className="mt-2 text-sm leading-6 text-gray-550">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {loggedIn ? (
                <form onSubmit={handleSubmit} className="lg:col-span-5 h-fit bg-slate-150 p-6 rounded-lg">
                  <h3 className="mb-1 text-lg font-bold text-slate-850">
                    {myReview ? "Update your review" : "Write a review"}
                  </h3>
                  {profile?.firstName && (
                    <p className="mb-4 text-sm text-gray-650">
                      Posting as {`${profile.firstName} ${profile.lastName ?? ""}`.trim()}
                    </p>
                  )}
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold text-slate-850">Your rating</p>
                    <StarRating
                      value={rating}
                      onChange={(next) => {
                        setRating(next);
                        setErrors((current) => ({ ...current, rating: undefined }));
                      }}
                      label="Choose a star rating"
                    />
                    {errors.rating && <p className="mt-1 text-xs text-error">{errors.rating}</p>}
                  </div>
                  <label className="block mb-5">
                    <span className="block mb-2 text-sm font-semibold text-slate-850">Comment</span>
                    <textarea
                      value={comment}
                      maxLength={500}
                      rows={4}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Share what you thought of this product"
                      className={`px-3.5 py-3 text-gray-650 w-full outline-0 text-sm border bg-white resize-none ${errors.comment ? "border-error" : "border-[#ced4da]"}`}
                    />
                    {errors.comment && <p className="mt-1 text-xs text-error">{errors.comment}</p>}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850 disabled:opacity-70"
                    >
                      {isSaving && !deleteMutation.isLoading ? (
                        <ButtonLoader />
                      ) : myReview ? (
                        "Update review"
                      ) : (
                        "Submit review"
                      )}
                    </button>
                    {myReview && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => deleteMutation.mutate()}
                        className="font-bold text-sm uppercase text-error disabled:opacity-70"
                      >
                        Delete review
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="lg:col-span-5 h-fit bg-slate-150 p-6 rounded-lg">
                  <h3 className="mb-2 text-lg font-bold text-slate-850">Write a review</h3>
                  <p className="mb-4 text-sm text-gray-650">Sign in to rate this product and leave a comment.</p>
                  <Link
                    href="/login"
                    className="inline-block bg-primary text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfoTabs;
