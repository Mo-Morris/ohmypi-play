export function filterFruits(items, category, query = "") {
	const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

	return items.filter((fruit) => {
		const matchesCategory = category === "all" || fruit.category === category;
		const matchesOrigin = normalizedQuery === "" || fruit.origin.toLocaleLowerCase("zh-CN").includes(normalizedQuery);
		return matchesCategory && matchesOrigin;
	});
}

export function listCategories(items) {
	return [...new Set(items.map((fruit) => fruit.category))];
}
