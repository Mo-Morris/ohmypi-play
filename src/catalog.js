export function filterFruits(items, category) {
	if (category === "all") {
		return items;
	}

	return items.filter((fruit) => fruit.category === category);
}

export function listCategories(items) {
	return [...new Set(items.map((fruit) => fruit.category))];
}
