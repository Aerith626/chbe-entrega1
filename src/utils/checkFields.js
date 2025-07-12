// Función para revisar que todos los campos estén en el body de una solicitud
function checkFields(body, array) {
	return array.every(arrayField => body.hasOwnProperty(arrayField));
}

export default checkFields;