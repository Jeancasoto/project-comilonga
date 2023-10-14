export function extractErrors(err) {
	return err.inner.reduce((acc, err) => {
		return { ...acc, [err.path]: err.message };
	}, {});
}

function buildProductBlock(products) {
	return products
		.map((prod) => {
			return `${prod.quantity}x ${prod.title}. ${prod.notes ? `Notas: ${prod.notes}` : ''}\n`;
		})
		.join('');
}
export function whatsappMessageTemplate(nombre, numero, notas, tipoDePedido, products) {
	return encodeURIComponent(
		`Hola Me llamo ${nombre}.\nPueden contactarme al ${numero}.\n\nQuisiera Ordenar ${
			tipoDePedido === 'llevar' ? 'para llevar' : 'para comer en el local'
		}:\n${buildProductBlock(products)}${
			notas ? `Notas a la cocina: ${notas}.\n` : '\n'
		}Muchas Gracias.`
	);
}
