import { shopifyFetch } from '@/utils/shopify/shopifyFetch';
import { CART_FRAGMENT } from './cartFragment';

const ERRORS = `userErrors { field message }`;

const CART_CREATE = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      ${ERRORS}
    }
  }
`;

const CART_LINES_ADD = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      ${ERRORS}
    }
  }
`;

const CART_LINES_UPDATE = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      ${ERRORS}
    }
  }
`;

const CART_LINES_REMOVE = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      ${ERRORS}
    }
  }
`;

const GET_CART = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

const run = (query, variables) =>
	shopifyFetch({ query, variables, cache: 'no-store' });

// Each helper returns { cart, userErrors }. cart is null if Shopify rejects it.
export async function cartCreate(lines = []) {
	const data = await run(CART_CREATE, { lines });
	return data.cartCreate;
}

export async function cartLinesAdd(cartId, lines) {
	const data = await run(CART_LINES_ADD, { cartId, lines });
	return data.cartLinesAdd;
}

export async function cartLinesUpdate(cartId, lines) {
	const data = await run(CART_LINES_UPDATE, { cartId, lines });
	return data.cartLinesUpdate;
}

export async function cartLinesRemove(cartId, lineIds) {
	const data = await run(CART_LINES_REMOVE, { cartId, lineIds });
	return data.cartLinesRemove;
}

// Returns null when the cart is gone (expired or already checked out).
export async function getCart(cartId) {
	const data = await run(GET_CART, { cartId });
	return data.cart;
}
