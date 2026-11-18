'use server';

import { cookies } from 'next/headers';
import {
	cartCreate,
	cartLinesAdd,
	cartLinesUpdate,
	cartLinesRemove,
	getCart,
} from '@/utils/shopify/cart/cartQueries';

const CART_COOKIE = 'cj_cart_id';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

// Every action returns { cart, error }. The client never sees userErrors raw.
const ok = (cart) => ({ cart, error: null });
const fail = (error) => ({ cart: null, error });

async function readCartId() {
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

async function clearCartId() {
	const store = await cookies();
	store.delete(CART_COOKIE);
}

const firstError = (userErrors) => userErrors?.[0]?.message || null;

// Current cart, or { cart: null } if none / expired.
export async function getCartAction() {
	try {
		const cartId = await readCartId();
		if (!cartId) return ok(null);

		const cart = await getCart(cartId);
		if (!cart) {
			await clearCartId();
			return ok(null);
		}
		return ok(cart);
	} catch (err) {
		console.error('getCartAction failed:', err);
		return fail('Could not load your cart.');
	}
}

/**
 * lines: [{ variantId, quantity?, attributes?: [{ key, value }] }]
 * Takes an array so Phase 7 can add a build's two lines in one call.
 */
export async function addToCartAction(lines) {
	try {
		const input = (lines || []).map((l) => ({
			merchandiseId: l.variantId,
			quantity: l.quantity || 1,
			...(l.attributes?.length && { attributes: l.attributes }),
		}));
		if (!input.length || input.some((l) => !l.merchandiseId)) {
			return fail('Missing product variant.');
		}

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
	} catch (err) {
		console.error('addToCartAction failed:', err);
		return fail('Could not add to cart.');
	}
}

// quantity 0 removes the line.
export async function updateCartLineAction(lineId, quantity) {
	try {
		const cartId = await readCartId();
		if (!cartId) return fail('No cart.');

		const res =
			quantity > 0
				? await cartLinesUpdate(cartId, [{ id: lineId, quantity }])
				: await cartLinesRemove(cartId, [lineId]);

		if (!res.cart) return fail(firstError(res.userErrors) || 'Could not update cart.');
		return ok(res.cart);
	} catch (err) {
		console.error('updateCartLineAction failed:', err);
		return fail('Could not update cart.');
	}
}

export async function removeCartLinesAction(lineIds) {
	try {
		const cartId = await readCartId();
		if (!cartId) return fail('No cart.');

		const res = await cartLinesRemove(cartId, lineIds);
		if (!res.cart) return fail(firstError(res.userErrors) || 'Could not update cart.');
		return ok(res.cart);
	} catch (err) {
		console.error('removeCartLinesAction failed:', err);
		return fail('Could not update cart.');
	}
}
