'use server';

import {
	cartLinesUpdate,
	cartLinesRemove,
	getCart,
} from '@/utils/shopify/cart/cartQueries';
import {
	ok,
	fail,
	firstError,
	readCartId,
	clearCartId,
	addLinesToCart,
} from '@/lib/cart/cartServer';

// Every action returns { cart, error }. The client never sees userErrors raw.

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
 * Takes an array so several lines can be added in one call.
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

		return await addLinesToCart(input);
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

// Sets several lines to the same quantity in one call (a custom build's base and options lines
// move together). quantity 0 removes them.
export async function updateCartLinesAction(lineIds, quantity) {
	try {
		const cartId = await readCartId();
		if (!cartId) return fail('No cart.');
		if (!Array.isArray(lineIds) || !lineIds.length) return fail('Missing cart line.');

		const res =
			quantity > 0
				? await cartLinesUpdate(
						cartId,
						lineIds.map((id) => ({ id, quantity })),
					)
				: await cartLinesRemove(cartId, lineIds);

		if (!res.cart) return fail(firstError(res.userErrors) || 'Could not update cart.');
		return ok(res.cart);
	} catch (err) {
		console.error('updateCartLinesAction failed:', err);
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
