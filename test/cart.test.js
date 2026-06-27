import { describe, expect, test } from "bun:test";
import { addItem, calculateTotal, countItems, removeItem } from "../src/cart.js";

const fruits = [
	{ id: 1, price: 8.8 },
	{ id: 2, price: 4.5 },
];

describe("购物车", () => {
	test("增加商品后更新总数量和金额", () => {
		const cart = addItem(addItem({}, 1), 2);

		expect(countItems(cart)).toBe(2);
		expect(calculateTotal(cart, fruits)).toBe(13.3);
	});

	test("最后一件商品被移除后不保留零数量条目", () => {
		const cart = removeItem({ 1: 1 }, 1);

		expect(cart).toEqual({});
	});
});
