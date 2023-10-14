// @ts-nocheck
import { db, storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { getDocs, collection, query } from 'firebase/firestore';

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
