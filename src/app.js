import express from 'express';
import {engine} from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { Server } from 'socket.io';
import http from 'http';
import ProductManager from './productManager.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager("./src/products.json"); // Product manager para realtimeproducts

// Bootstrap, json, handlebars y routing
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use(express.static("public"));
app.use(express.json());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)

// Websockets
io.on("connection", (socket) => {
	console.log("Usuario conectado");

	socket.on("addProduct", async (productData) => {
		try {
			const addedProduct = await productManager.addProduct(productData);
			io.emit("addProductSuccess", addedProduct);
		} catch (error) {
			socket.emit("addProductError", {
				message: error.message || "Error al agregar el producto"
			});
			console.error("Error agregando producto");
		}
	})

	socket.on("deleteProduct", async(idToDelete) => {
		try {
			const products = await productManager.deleteProductById(idToDelete);
			let emptyProducts = false;
			if (!products.length) {
				emptyProducts = true
			}; 
			io.emit("productToDelete", {id: idToDelete, emptyProducts});
		} catch (error) {
			console.error("Error al eliminar producto");
		}
	})
});

server.listen(8080, () => {
	console.log("Servidor funcionando en el puerto 8080");
});