// Server-only cart plumbing shared by the cart actions and the builder action.
// Not a 'use server' file on purpose: nothing here is callable from the browser.
import { cookies } from 'next/headers';
import { cartCreate, cartLinesAdd } from '@/utils/shopify/cart/cartQueries';

const CART_COOKIE = 'cj_cart_id';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export const ok = (cart) => ({ cart, error: null });
export const fail = (error) => ({ cart: null, error });
export const firstError = (userErrors) => userErrors?.[0]?.message || null;

export async function readCartId() {
	const store = await cookies();
	return store.get(CART_COOKIE)?.value || null;
}

async function writeCartId(cartId) {
	const store = await cookies();
	store.set(CART_COOKIE, cartId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: CART_COOKIE_MAX_AGE,
	});
}

export async function clearCartId() {
	const store = await cookies();
	store.delete(CART_COOKIE);
}

/**
 * input: CartLineInput[] ({ merchandiseId, quantity, attributes? }).
 * Adds to the cookie's cart, or starts a new cart if there is none, or it expired.
 * Returns { cart, error }.
 */
export async function addLinesToCart(input) {
	const cartId = await readCartId();

	if (cartId) {
		const res = await cartLinesAdd(cartId, input);
		if (res.cart) return ok(res.cart);
		// Cart expired or was checked out: fall through and start a new one.
		if (res.userErrors?.length && !/cart/i.test(res.userErrors[0].message)) {
			return fail(firstError(res.userErrors));
		}
	}

	const res = await cartCreate(input);
	if (!res.cart) return fail(firstError(res.userErrors) || 'Could not create cart.');
	await writeCartId(res.cart.id);
	return ok(res.cart);
}
