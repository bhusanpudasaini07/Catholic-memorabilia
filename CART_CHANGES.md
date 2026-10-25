# Cart changes

- Logged-in users (existing token cookie): use the existing /carts API endpoints.
- Guests: store cart items under localStorage key `cart`; no cart API calls.
- Product cards, product detail pages and the quick-view modal pass product details for guest display. Product details are excluded from API payloads.
- Cart page and header use the same React Query cart cache. Mutations refresh both.
- Guests can change quantities, remove items and clear the cart. Totals are recalculated.
- Guest and account carts remain separate; automatic merging on login is not included.

Changed files: src/services/cart.service.ts, src/services/guest-cart.ts (new), src/interface/cart.interface.ts, src/hooks/cart.hooks.tsx, src/shared/components/card/index.tsx, src/shared/components/product-detail-modal/index.tsx, src/shared/components/cartDropdown/index.tsx, src/features/Cart/cart-table-row/index.tsx, src/features/Auth/login-form/index.tsx, src/shared/main-layout/header/index.tsx, src/shared/main-layout/header/exapmle.tsx, src/pages/cart/index.tsx, src/pages/products/[slug].tsx.

Validation: isolated service tests passed for guest add/repeat/update/remove/clear/totals, authenticated endpoint routing and payload, guest/account isolation, invalid quantities, malformed JSON and unavailable storage. A full Next.js build and live API verification were not run because project dependencies and the running backend are unavailable in this workspace.

Run with your usual dependency installation and `pnpm dev`. Verify a guest add and refresh, then login and verify POST /carts/items in browser Network tools. Keep server-side authentication and price validation on the backend.

## Discount calculation

Guest carts apply discountPercentage only when hasDiscount is true, matching the product cards. Percentages are limited to 0–100. Unit prices are rounded to cents before multiplying by quantity. Each saved item includes originalUnitPrice, discountPercentage, unitPrice (discounted), subTotal, discountAmount and totalPrice. The saved cart includes subTotal (before discount), discountAmount, totalAmount (after discount) and totalItems. Quantity changes recalculate and persist all totals. Existing local carts recalculate from their saved product details when read. Account API payloads still contain productId and quantity, without client-calculated prices. Guest and account carts remain separate.
