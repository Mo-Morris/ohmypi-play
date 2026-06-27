import { describe, expect, test } from "bun:test";
import { filterFruits, listCategories } from "../src/catalog.js";

const fruits = [
	{ id: 1, category: "apple" },
	{ id: 2, category: "banana" },
	{ id: 3, category: "apple" },
];

describe("商品目录", () => {
	test("all 返回全部商品，具体分类只返回匹配商品", () => {
		expect(filterFruits(fruits, "all")).toEqual(fruits);
		expect(filterFruits(fruits, "apple").map((fruit) => fruit.id)).toEqual([1, 3]);
	});

	test("分类列表去重并保留首次出现顺序", () => {
		expect(listCategories(fruits)).toEqual(["apple", "banana"]);
	});
});
