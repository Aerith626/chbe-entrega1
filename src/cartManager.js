import FileManager from './fileManager.js';

class CartManager {
	constructor(pathToFile) {
		this.filePath = pathToFile;
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
			const carts = await FileManager.readFile(this.filePath);
			
			const cartId = this.generateCartId(carts);
			carts.push({id: cartId, products: []});
			await FileManager.writeToFile(this.filePath, carts)
			return carts;
		} catch (error) {
			throw new Error("Error al crear carrito: " + error.message);
		}
	}

	// Revisar products en carrito con id específico
	async getCartProductsById(cartId) {
		try {
			const carts = await FileManager.readFile(this.filePath);

			const cartProduct = carts.find(cart => cart.id === parseInt(cartId));
			if (!cartProduct) throw new Error("Carrito con id " + cartId + " no encontrado");
			return cartProduct.products;
		} catch (error) {
			throw new Error("Error al obtener productos del carrito: " + error.message);
		}
	}

	// Agregar productos a carro con id
	async addProductByCartId(cartId, productId, productBody) {
		try {
			const carts = await FileManager.readFile(this.filePath);

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
			await FileManager.writeToFile(this.filePath, carts)
			return carts;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Extra: Eliminar carrito
	async deleteCartById(cartId) {
		try {
			const carts = await FileManager.readFile(this.filePath);

			const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
			if (cartIndex === -1) throw new Error("Carrito con id " + cartId + " no encontrado");
			carts.splice(cartIndex, 1);

			await FileManager.writeToFile(this.filePath, carts);
			return carts;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default CartManager;