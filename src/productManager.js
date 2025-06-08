import {v4 as uuidv4} from 'uuid';
import FileManager from './fileManager.js';


class ProductManager {
	constructor(pathToFile) {
		this.filePath = pathToFile;
	}

	// Generar id autoincremental
	generateNewId(products) {
		if (products.length > 0) {
			return products[products.length - 1].id + 1;
		} else {
			return 1;
		}
	}

	// Agregar producto nuevo
	async addProduct(newProduct) {
		try {
			const products = await FileManager.readFile(this.filePath);

			const newId = this.generateNewId(products);
			// Generar id y código
			const product = {id: newId, code: uuidv4(), ...newProduct};
			products.push(product);

			await FileManager.writeToFile(this.filePath, products);
			return products;
		} catch (error) {
			throw new Error("Error al agregar el producto " + error.message);
		}
	}

	// Mostrar productos productos
	async getProducts() {
		try {
			const products = await FileManager.readFile(this.filePath);
			return products;
		} catch (error) {
			throw new Error("Error al obtener productos");
		}
	}

	// Mostrar producto por ID
	async getProductById(productId) {
		try {
			const products = await FileManager.readFile(this.filePath);

			const productById = products.find(product => product.id === parseInt(productId));
			if (!productById) throw new Error("Producto con id " + productId + " no encontrado" );
			return productById;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Eliminar producto por ID
	async deleteProductById(productId) {
		try {
			const products = await FileManager.readFile(this.filePath);

			const productIndex = products.findIndex(product => product.id === parseInt(productId));
			if(productIndex === -1) throw new Error("No se encontró el producto con id " + productId);
			products.splice(productIndex, 1);

			await FileManager.writeToFile(this.filePath, products);
			return products;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Actualizar producto por ID
	async updateProductById(productId, updatedProduct) {
		try {
			const products = await FileManager.readFile(this.filePath);

			const productIndex = products.findIndex(product => product.id === parseInt(productId));
			if(productIndex === -1) throw new Error("No se encontró el producto con id " + productId);
			products[productIndex] = {...products[productIndex], ...updatedProduct};

			await FileManager.writeToFile(this.filePath, products);
			return products;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default ProductManager;