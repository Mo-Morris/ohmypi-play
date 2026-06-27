import { addItem, calculateTotal, countItems, removeItem } from "./cart.js";
import { filterFruits, listCategories } from "./catalog.js";
import { categoryNames, fruits } from "./fruits.js";
import { formatMoney } from "./money.js";

const elements = {
	cartCount: document.querySelector("#cartCount"),
	cartList: document.querySelector("#cartList"),
	cartPanel: document.querySelector("#cartPanel"),
	cartPanelTotal: document.querySelector("#cartPanelTotal"),
	cartTotal: document.querySelector("#cartTotal"),
	checkoutButton: document.querySelector("#checkoutButton"),
	closeCartButton: document.querySelector("#closeCartButton"),
	filterBar: document.querySelector("#filterBar"),
	overlay: document.querySelector("#overlay"),
	productGrid: document.querySelector("#productGrid"),
	toast: document.querySelector("#toast"),
	viewCartButton: document.querySelector("#viewCartButton"),
};

let activeCategory = "all";
let cart = {};

function createCategoryButtons() {
	for (const category of listCategories(fruits)) {
		const button = document.createElement("button");
		button.className = "filter-btn";
		button.type = "button";
		button.dataset.category = category;
		button.textContent = categoryNames[category] ?? category;
		elements.filterBar.append(button);
	}
}

function renderProducts() {
	const visibleFruits = filterFruits(fruits, activeCategory);
	elements.productGrid.innerHTML = visibleFruits
		.map(
			(fruit) => `
				<article class="card" data-fruit-id="${fruit.id}">
					<div class="image-wrap">
						<img src="${fruit.image}" alt="${fruit.name}" loading="lazy" />
					</div>
					<div class="card-info">
						<h2>${fruit.name}</h2>
						<p class="origin">${fruit.englishName} · ${fruit.origin}</p>
						<div class="card-bottom">
							<div class="price">${formatMoney(fruit.price)} <span class="unit">/ ${fruit.unit}</span></div>
							<button class="buy-button" type="button" data-add-fruit="${fruit.id}">加入购物车</button>
						</div>
					</div>
				</article>
			`,
		)
		.join("");
}

function renderCart() {
	const entries = Object.entries(cart);
	const total = calculateTotal(cart, fruits);

	elements.cartCount.textContent = String(countItems(cart));
	elements.cartTotal.textContent = formatMoney(total);
	elements.cartPanelTotal.textContent = formatMoney(total);

	if (entries.length === 0) {
		elements.cartList.innerHTML = '<p class="empty-state">购物车还是空的</p>';
		return;
	}

	elements.cartList.innerHTML = entries
		.map(([fruitId, quantity]) => {
			const fruit = fruits.find((item) => item.id === Number(fruitId));
			if (!fruit) return "";

			return `
				<div class="cart-item">
					<img src="${fruit.image}" alt="" />
					<div>
						<p class="item-name">${fruit.name}</p>
						<p class="item-price">${formatMoney(fruit.price)}</p>
					</div>
					<div class="quantity-control">
						<button type="button" data-remove-fruit="${fruit.id}" aria-label="减少${fruit.name}">−</button>
						<span>${quantity}</span>
						<button type="button" data-add-fruit="${fruit.id}" aria-label="增加${fruit.name}">+</button>
					</div>
					<strong class="subtotal">${formatMoney(fruit.price * quantity)}</strong>
				</div>
			`;
		})
		.join("");
}

function setCartOpen(open) {
	elements.cartPanel.classList.toggle("open", open);
	elements.overlay.classList.toggle("show", open);
	elements.cartPanel.setAttribute("aria-hidden", String(!open));
}

function showToast(message) {
	elements.toast.textContent = message;
	elements.toast.classList.add("show");
	setTimeout(() => elements.toast.classList.remove("show"), 2_000);
}

elements.filterBar.addEventListener("click", (event) => {
	const button = event.target.closest("[data-category]");
	if (!button) return;

	activeCategory = button.dataset.category;
	for (const candidate of elements.filterBar.querySelectorAll("[data-category]")) {
		candidate.classList.toggle("active", candidate === button);
	}
	renderProducts();
});

document.addEventListener("click", (event) => {
	const addButton = event.target.closest("[data-add-fruit]");
	if (addButton) {
		cart = addItem(cart, Number(addButton.dataset.addFruit));
		renderCart();
		showToast("已加入购物车");
		return;
	}

	const removeButton = event.target.closest("[data-remove-fruit]");
	if (removeButton) {
		cart = removeItem(cart, Number(removeButton.dataset.removeFruit));
		renderCart();
	}
});

elements.viewCartButton.addEventListener("click", () => setCartOpen(true));
elements.closeCartButton.addEventListener("click", () => setCartOpen(false));
elements.overlay.addEventListener("click", () => setCartOpen(false));
elements.checkoutButton.addEventListener("click", () => {
	const total = calculateTotal(cart, fruits);
	if (total === 0) {
		showToast("购物车是空的");
		return;
	}

	showToast(`结算成功：${formatMoney(total)}`);
	cart = {};
	renderCart();
});

createCategoryButtons();
renderProducts();
renderCart();
