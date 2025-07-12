import express from 'express';
import CartManager from '../cartManager.js';
import checkFields from '../utils/checkFields.js';

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/carts.json");

// Obtener productos del carrito con id = :cid
cartsRouter.get("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const products = await cartManager.getCartProductsById(cid);
		res.status(200).json({ status: "success", products });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// Agregar un carrito
cartsRouter.post("/", async (req, res) => {
	try {
		const carts = await cartManager.addCart();
		res.status(200).json({ status: "success", carts });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al agregar carro: " + error.message });
	}
});

// Agregar un producto de id = :pid al carrito de id = :cid
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const requiredField = ["quantity"];
		const pid = req.params.pid;
		const cid = req.params.cid;
		const newProduct = req.body;
		if (!checkFields(newProduct, requiredField)) {
			return (res.status(400).json({ status: "error", message: "Es necesario ingresar la cantidad de productos a agregar" }))
		}
		const cartProducts = await cartManager.addProductByCartId(cid, pid, newProduct);
		res.status(200).json({ status: "success", cartProducts });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al agregar producto: " + error.message });
	}
});

// Extra: Eliminar carrito por id
cartsRouter.delete("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const carts = await cartManager.deleteCartById(cid);
		res.status(200).json({ status: "success", carts });
	} catch (error) {
		res.status(500).json({ status: "error", message: "Error al eliminar carrito: " + error.message });
	}
});

export default cartsRouter;