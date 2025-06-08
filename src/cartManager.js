import fs from 'fs';

// Cart Manager debe estar vacío al hacer el post
class CartsManager {
	constructor(pathToFile) {
		this.filePath = pathToFile;
	}

	// Función para leer carts.json
	async readCarts() {
		try {
			const fileData = await fs.promises.readFile(this.filePath, "utf-8");
			return JSON.parse(fileData);
		} catch (error) {
			// En caso de que el archivo esté vacío o no exista
			if (error.code === "ENOENT") return [];
			throw new Error("Error leyendo el archivo: " + error.message);
		}
	}

	// Función para escribir en carts.json
	async writeCarts(data) {
		try {
			await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
		} catch (error) {
			throw new Error("Error escribiendo en el archivo: " + error.message);
		}
	}

	// Generar id autoincremental
	generateCartId(carts) {
		if (carts.length > 0) {
			return carts[carts.length - 1].id + 1;
		} else {
			return 1;
		}	
	}

	// Agregar carrito
	async addCart() {
		try {
			const carts = await this.readCarts();
			const cartId = this.generateCartId(carts);
			carts.push({id: cartId, products: []});
			this.writeCarts(carts);
			return carts;
		} catch (error) {
			throw new Error("Error al crear carrito: " + error.message);
		}
	}

	// Revisar products en carrito con id específico
	async getCartProductsById(cartId) {
		try {
			const carts = await this.readCarts();
			const cartProductIndex = carts.find(cart => cart.id === parseInt(cartId));
			if (!cartProductIndex) throw new Error("Carrito con id " + cartId + " no encontrado");
			return cartProductIndex.products;
		} catch (error) {
			throw new Error("Error al obtener productos del carrito: " + error.message);
		}
	}

	// Agregar productos a carro con id
	async addProductByCartId(cartId, productId, productBody) {
		try {
			const carts = await this.readCarts();
			const parsedProductId = parseInt(productId);
			const parsedQuantity = parseInt(productBody.quantity);
			const cartById = carts.find(cart => cart.id === parseInt(cartId));
			if (!cartById) throw new Error("Carrito con id " + cartId + " no encontrado");
			const cartProducts = cartById.products;

			const productByIdIndex = cartProducts.findIndex(product => parseInt(product.id) === parsedProductId);
			if (productByIdIndex === -1) {
				cartProducts.push({id: parsedProductId, quantity: parsedQuantity});
			} else {
				cartProducts[productByIdIndex].quantity += parsedQuantity;
			}
			this.writeCarts(carts);
			return carts;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default CartsManager;