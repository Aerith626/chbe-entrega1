import express from 'express';
import ProductManager from '../productManager.js';
import checkFields from '../utils/checkFields.js';

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

// Obtener productos
productsRouter.get("/", async (req, res) => {
	try {
		const products = await productManager.getProducts();
		res.status(200).json({ status: "success", products });
	} catch (error) {
		res.status(500).status(200).json({ status: "error", message: "Error obteniendo los productos" });
	}
});

// Obtener un producto por id
productsRouter.get("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const product = await productManager.getProductById(pid);
		res.status(200).json({ status: "success", product });
	} catch (error) {
		res.status(500).status(200).json({ status: "error", message: "Error al obtener el producto: " + error.message });
	}
});

// Eliminar un producto por id
productsRouter.delete("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const products = await productManager.deleteProductById(pid);
		res.status(200).json({ status: "success", products });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al eliminar el producto: " + error.message });
	}
});

// Agregar un producto
productsRouter.post("/", async (req, res) => {
	try {
		const requiredFields = [
			"title",
			"description",
			"price",
			"status",
			"stock",
			"category",
			"thumbnails"
		];
		const newProduct = req.body;
		if (!checkFields(newProduct, requiredFields)) {
			return (res.status(400).json({ status: "error", message: "Faltan campos requeridos" }))
		}
		const products = await productManager.addProduct(newProduct);
		res.status(200).json({ status: "success", products })
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al agregar el producto" });
	}
});

// Actualizar los datos de un producto por id
productsRouter.put("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const updatedProduct = req.body;
		const products = await productManager.updateProductById(pid, updatedProduct);
		res.status(200).json({ status: "success", products })
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al editar el producto: " + error.message });
	}
})

export default productsRouter;