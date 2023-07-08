import { storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

export const getFileDownloadURL = async (path = '') => {
	if (path === '') return '';
	const url = await getDownloadURL(ref(storage, path));
	return url;
};
