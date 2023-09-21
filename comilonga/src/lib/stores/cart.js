import { writable } from 'svelte/store';

export const cart = writable([] /* initial cart */);

export function addItem(item) {
	cart.update((currentCart) => {
		return [...currentCart, item];
	});
}

export function removeItem(idx) {
	cart.update((currentCart) => {
		// remove item at index triggering reactivity
		return [...currentCart.slice(0, idx), ...currentCart.slice(idx + 1)];
	});
}
