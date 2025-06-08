import express from 'express';
import ProductManager from './productManager.js';
import CartsManager from './cartManager.js';

const app = express();
app.use(express.json());
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartsManager("./src/carts.json");

// Endpoints
app.get("/", (req, res) => {
	res.json({message: "Servidor funcionando en el puerto 8080"});
})

// Productos
app.get("/api/products", async (req, res) => {
	try {
		const products = await productManager.getProducts();
		res.status(200).json({status: "success", products });
	} catch (error) {
		res.status(500).status(200).json({status: "error", message: "Error obteniendo los productos" });
	}
});

app.get("/api/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const product = await productManager.getProductById(pid);
		res.status(200).json({status: "success", product});
	} catch (error) {
		res.status(500).status(200).json({status: "error", message: "Error obteniendo el producto" });
	}
});

app.delete("/api/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;		
		const products = await productManager.deleteProductById(pid);
		res.status(200).json({status: "success", products});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al eliminar el producto" });
	}
});

const requiredFields = [
	"title",
	"description",
	"price",
	"status",
	"stock",
	"category",
	"thumbnails"
];
function checkProductFields(body) {
	return requiredFields.every(field => body.hasOwnProperty(field));
}

app.post("/api/products/", async (req, res) => {
	try {
		const newProduct = req.body;
		if (!checkProductFields(newProduct)) {
			return(res.status(400).json({status: "error", message: "Faltan campos requeridos"}))
		}
		const products = await productManager.addProduct(newProduct);
		res.status(200).json({status: "success", products})
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al agregar el producto" });
	}
});

app.put("/api/products/:pid", async (req, res) => {
	
	try {
		const pid = req.params.pid;
		const updatedProduct = req.body;
		const products = await productManager.updateProductById(pid, updatedProduct);
		res.status(200).json({status: "success", products})
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al editar el producto" });
	}
})

// Cart
app.get("/api/carts/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const products = await cartManager.getCartProductsById(cid);
		res.status(200).json({status: "success", products});
	} catch (error) {
		res.status(500).json({status: "error", message: error.message });
	}
});

app.post("/api/carts", async (req, res) => {
	try {
		const carts = await cartManager.addCart();
		res.status(200).json({status: "success", carts});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al agregar carro: " + error.message });
	}
});

app.post("/api/carts/:cid/products/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const cid = req.params.cid;
		const newProduct = req.body;
		const cartProducts = await cartManager.addProductByCartId(cid, pid, newProduct);
		res.status(200).json({status: "success", cartProducts});
	} catch (error) {
		res.status(500).json({status: "error", message: "Error al agregar producto: " + error.message});
	}
});

app.listen(8080, () => {
	console.log("Servidor funcionando en el puerto 8080");
});