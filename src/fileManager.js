import fs from 'fs';

// Clase para leer y escribir en archivos
class FileManager{
	static async readFile(path) {
		try {
			const fileData = await fs.promises.readFile(path, "utf-8");
			return JSON.parse(fileData);
		} catch (error) {
			// En caso de que el archivo esté vacío o no exista retornar array vacío, según google
			if (error.code === "ENOENT") return [];
			throw new Error("Error leyendo el archivo: " + error.message);
		}
	}

	static async writeToFile(path, data) {
		try {
			await fs.promises.writeFile(path, JSON.stringify(data, null, 2), "utf-8");
		} catch (error) {
			throw new Error("Error escribiendo en el archivo: " + error.message);
		}
	}
}

export default FileManager;