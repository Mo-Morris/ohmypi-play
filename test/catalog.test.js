import { describe, expect, test } from "bun:test";
import { filterFruits, listCategories } from "../src/catalog.js";

const fruits = [
	{ id: 1, category: "apple", origin: "陕西·洛川" },
	{ id: 2, category: "banana", origin: "海南·三亚" },
	{ id: 3, category: "apple", origin: "山东·烟台" },
];

describe("商品目录", () => {
	test("all 返回全部商品，具体分类只返回匹配商品", () => {
		expect(filterFruits(fruits, "all")).toEqual(fruits);
		expect(filterFruits(fruits, "apple").map((fruit) => fruit.id)).toEqual([1, 3]);
	});

	test("分类列表去重并保留首次出现顺序", () => {
		expect(listCategories(fruits)).toEqual(["apple", "banana"]);
	});

	test("产地搜索与品类筛选同时生效", () => {
		expect(filterFruits(fruits, "all", "海南").map((fruit) => fruit.id)).toEqual([2]);
		expect(filterFruits(fruits, "apple", "山东").map((fruit) => fruit.id)).toEqual([3]);
	});
});
