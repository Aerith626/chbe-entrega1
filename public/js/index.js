const socket = io();

// Agregar productos
const addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const formData = new FormData(addProductForm);
	const productData = {};

	formData.forEach((value, key) => {
		if (["price", "stock"].includes(key)) {
			productData[key] = parseInt(value);
		} else {
			productData[key] = value;
		}
	});

	const price = parseInt(productData.price);
	const stock = parseInt(productData.stock);

	if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
		alert("Precio y stock deben ser números válidos y mayores o iguales a 0.");
		return;
	}

	socket.emit("addProduct", productData);
});

// Lista de productos
document.addEventListener("DOMContentLoaded", ()=> {
	const noProductsAlert = document.getElementById("noProductsAlert");
	const productContainer = document.getElementById("productContainer");

	// Crear #productList si no existe
	if (productContainer) {
		let productList = document.getElementById("productList");

		if (!productList) {
			productList = document.createElement("div");
			productList.id = "productList";
			productList.classList.add("row", "gy-4");
			productContainer.appendChild(productList);
		}
	}
});

socket.on("addProductSuccess", (addedProduct) => {
	noProductsAlert.style.display = "none"; // Ocultar alerta de que no hay productos

	const productDiv = document.createElement("div");
	productDiv.classList.add("col-md-6", "col-lg-4");
	productDiv.id = "product-" + addedProduct.id;
	productDiv.innerHTML = `
		<div class="card h-100">
			<div class="card-body">
				<div class="d-flex align-items-center justify-content-between">
					<small class="text-uppercase text-body-tertiary fw-semibold">${addedProduct.category}</small>
					<small class="text-body-tertiary">${addedProduct.stock != 0 ?  addedProduct.stock : 'Sin stock'}</small>
				</div>
				<h4 class="card-title text-body-secondary">${addedProduct.title}</h4>
				<p class="card-text mb-1">${addedProduct.description}</p>
				<div class="d-flex justify-content-between align-items-center">
					<span class="fs-3 text-body-secondary fw-semibold">$${addedProduct.price != 0 ? addedProduct.price : 'Gratis'}</span>
					<button class="btn btn-danger btn-sm btn-delete" data-del="${addedProduct.id}">Eliminar</button>
				</div>
			</div>
		</div>
	`;
	productList.appendChild(productDiv);
	const productDeleteBtn = document.querySelector(`[data-del="${addedProduct.id}"]`);
	addDeleteListener(productDeleteBtn);
})

// Eliminar productos
function addDeleteListener(item) {
	item.addEventListener("click", (e) => {
		const idToDelete = parseInt(e.target.getAttribute("data-del"));
		socket.emit("deleteProduct", idToDelete);
	})
}

const btnDelete = document.querySelectorAll(".btn-delete");
btnDelete.forEach((btn) => {
	addDeleteListener(btn);
})

socket.on("productToDelete", ({id, emptyProducts}) => {
	productToDelete = document.getElementById("product-" + id);
	if (productToDelete) productToDelete.remove();
	if (emptyProducts) noProductsAlert.style.display = "block"; 
});

