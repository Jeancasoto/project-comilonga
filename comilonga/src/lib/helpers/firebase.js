import { db,storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { getDoc, getDocs ,doc, collection, query} from 'firebase/firestore';


export const getFileDownloadURL = async (path = '') => {
	if (path === '') return '';
	const url = await getDownloadURL(ref(storage, path));
	return url;
};

export const getGenerals = async (generals_doc_id) => {
    const docRef = doc(db, "generales", generals_doc_id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();    
}; 


export const getGeneralDocId = async () => {
    const docs = await getDocs(query(collection(db, "generales")));
    let current_doc;
    docs.forEach((doc) => {
        current_doc = doc
    })
    return current_doc.id;
}; 
