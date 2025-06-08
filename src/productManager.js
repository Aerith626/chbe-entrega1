import fs from "fs";

class ProductManager {
	constructor(pathFile) {
		this.filePath = pathFile;
	}

	generateNewId(products) {
		if (products.length > 0) {
			return products[products.length - 1].id + 1;
		} else {
			return 1;
		}
	}

	async addProduct(newProduct) {
		try {
			const fileData = await fs.promises.readFile(this.filePath, "utf-8");
			const products = JSON.parse(fileData);
	
			const newId = this.generateNewId(products);
			const product = {id: newId, ...newProduct};
			products.push(product);
	
			// Guardar info en archivo
			// null = replacer/filtrar keys y values - 2 = indentación
			await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2), "utf-8");
			return products;
		} catch (error) {
			throw new Error("Error al agregar el producto " + error.message);
		}
	}

	async getProducts() {
		try {
			const fileData = await fs.promises.readFile(this.filePath, "utf-8");
			const products = JSON.parse(fileData);
			return products;
		} catch (error) {
			throw new Error("Error al obtener productos");
		}
	}

	async getProductById(productId) {
		try {
			const fileData = await fs.promises.readFile(this.filePath, "utf-8");
			const products = JSON.parse(fileData);
			const productById = products.find(product => product.id === parseInt(productId));
			if (!productById) throw new Error("Producto con id " + productId + " no encontrado" );
			return productById;
		} catch (error) {
			throw new Error("Error al obtener el producto:" + error.message);
		}
	}

	async deleteProductById(productId) {
		try {
			const fileData = await fs.promises.readFile(this.filePath, "utf-8");
			const products = JSON.parse(fileData);
			const productIndex = products.findIndex(product => product.id === parseInt(productId));

			if(productIndex === -1) throw new Error("No se encontró el producto con id " + productId);
			products.splice(productIndex, 1);

			await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2), "utf-8");
			return products;
		} catch (error) {
			throw new Error(`Error al eliminar el producto: ${error.message}`);
		}
	}

	async updateProductById(productId, updatedProduct) {
		try {
			const fileData = await fs.promises.readFile(this.filePath, "utf-8");
			const products = JSON.parse(fileData);
			const productIndex = products.findIndex(product => product.id === parseInt(productId));
			if(productIndex === -1) throw new Error("No se encontró el producto con id " + productId);
			
			products[productIndex] = {...products[productIndex], ...updatedProduct};
			await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2), "utf-8");
			return products;
		} catch (error) {
			throw new Error(`Error al actualizar el producto: ${error.message}`);
		}
	}
}

export default ProductManager;