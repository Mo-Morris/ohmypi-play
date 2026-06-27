export function addItem(cart, fruitId) {
	return { ...cart, [fruitId]: (cart[fruitId] ?? 0) + 1 };
}

export function removeItem(cart, fruitId) {
	const nextCart = { ...cart };
	const nextQuantity = (nextCart[fruitId] ?? 0) - 1;

	if (nextQuantity > 0) {
		nextCart[fruitId] = nextQuantity;
	} else {
		delete nextCart[fruitId];
	}

	return nextCart;
}

export function countItems(cart) {
	return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

export function calculateTotal(cart, items) {
	return Object.entries(cart).reduce((total, [fruitId, quantity]) => {
		const fruit = items.find((item) => item.id === Number(fruitId));
		return total + (fruit?.price ?? 0) * quantity;
	}, 0);
}
