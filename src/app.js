import express from 'express';
import ProductManager from './productManager.js';
import CartsManager from './cartManager.js';

const app = express();
app.use(express.json());
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartsManager("./src/carts.json");


// Función para revisar que todos los campos estén en el body de una solicitud
function checkProductFields(body, array) {
	return array.every(arrayField => body.hasOwnProperty(arrayField));
}

// Endpoints
app.get("/", (req, res) => {
	res.json({message: "Servidor funcionando en el puerto 8080"});
})

// Obtener productos
app.get("/api/products", async (req, res) => {
	try {
		const products = await productManager.getProducts();
		res.status(200).json({status: "success", products });
	} catch (error) {
		res.status(500).status(200).json({status: "error", message: "Error obteniendo los productos" });
	}
});

// Obtener un producto por id
app.get("/api/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const product = await productManager.getProductById(pid);
		res.status(200).json({status: "success", product});
	} catch (error) {
		res.status(500).status(200).json({status: "error", message: "Error al obtener el producto: " + error.message });
	}
});

// Eliminar un producto por id
app.delete("/api/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;		
		const products = await productManager.deleteProductById(pid);
		res.status(200).json({status: "success", products});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al eliminar el producto: " + error.message });
	}
});

// Agregar un producto
app.post("/api/products/", async (req, res) => {
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
		if (!checkProductFields(newProduct, requiredFields)) {
			return(res.status(400).json({status: "error", message: "Faltan campos requeridos"}))
		}
		const products = await productManager.addProduct(newProduct);
		res.status(200).json({status: "success", products})
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al agregar el producto" });
	}
});

// Actualizar los datos de un producto por id
app.put("/api/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const updatedProduct = req.body;
		const products = await productManager.updateProductById(pid, updatedProduct);
		res.status(200).json({status: "success", products})
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al editar el producto: " + error.message });
	}
})

// Cart
// Obtener productos del carrito con id = :cid
app.get("/api/carts/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const products = await cartManager.getCartProductsById(cid);
		res.status(200).json({status: "success", products});
	} catch (error) {
		res.status(500).json({status: "error", message: error.message });
	}
});

// Agregar un carrito
app.post("/api/carts", async (req, res) => {
	try {
		const carts = await cartManager.addCart();
		res.status(200).json({status: "success", carts});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al agregar carro: " + error.message });
	}
});

// Agregar un producto de id = :pid al carrito de id = :cid
app.post("/api/carts/:cid/products/:pid", async (req, res) => {
	try {
		const requiredField = ["quantity"];
		const pid = req.params.pid;
		const cid = req.params.cid;
		const newProduct = req.body;
		if (!checkProductFields(newProduct, requiredField)) {
			return(res.status(400).json({status: "error", message: "Es necesario ingresar la cantidad de productos a agregar"}))
		}
		const cartProducts = await cartManager.addProductByCartId(cid, pid, newProduct);
		res.status(200).json({status: "success", cartProducts});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al agregar producto: " + error.message});
	}
});

// Extra: Eliminar carrito por id
app.delete("/api/carts/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const carts = await cartManager.deleteCartById(cid);
		res.status(200).json({status: "success", carts});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al eliminar carrito: " + error.message});
	}
});

app.listen(8080, () => {
	console.log("Servidor funcionando en el puerto 8080");
});