// @ts-nocheck
import { db, storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { getDocs, collection, query, collectionGroup, where } from 'firebase/firestore';

export const getFileDownloadURL = async (path = '') => {
	if (path === '') return '';
	const url = await getDownloadURL(ref(storage, path));
	return url;
};

export const getGeneralsDoc = async () => {
	const docs = await getDocs(query(collection(db, 'generales')));
	let current_doc = {};
	docs.forEach((doc) => {
		current_doc = doc;
	});
	return { ...current_doc.data(), id: current_doc.id };
};

export async function fetchAllProducts() {
	const collectionRef = collectionGroup(db, 'productos');
	const querySnap = await getDocs(collectionRef);
	const productsDocs = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	return await Promise.all(
		productsDocs.map(async (product) => {
			const url = await getFileDownloadURL(product.imagen);
			return { ...product, imageSRC: url };
		})
	);
}

export async function fetchVisibleProducts() {
	const collectionRef = query(collectionGroup(db, 'productos'), where('is_visible', '==', true));
	const querySnap = await getDocs(collectionRef);
	const productsDocs = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	return await Promise.all(
		productsDocs.map(async (product) => {
			const url = await getFileDownloadURL(product.imagen);
			return { ...product, imageSRC: url };
		})
	);
}

export async function fetchAllCategories() {
	const collectionRef = collectionGroup(db, 'categorias');
	const querySnap = await getDocs(collectionRef);
	return querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function fetchVisibleCategories() {
	const collectionRef = query(collectionGroup(db, 'categorias'), where('is_visible', '==', true));
	const querySnap = await getDocs(collectionRef);
	return querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function fetchAllMessages() {
	const collectionRef = collectionGroup(db, 'mensajes_enviados');
	const querySnap = await getDocs(collectionRef);
	return querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
