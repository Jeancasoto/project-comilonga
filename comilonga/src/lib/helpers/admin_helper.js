import { getDoc, getDocs ,doc, collection, query} from 'firebase/firestore';
import { db, storage } from '$lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';


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

export const getFileDownloadURL = async (path = '') => {
	
    try {
        if (path === '') return '';
        const url = await getDownloadURL(ref(storage, path));
        return url;
    } catch (error) {
        const url = await getDownloadURL(ref(storage, 'error/not_found.jpeg'));
        return url;;
    }
};

// export const getGenerals = new Promise ((resolve, reject, ) => {
//     const unsub = onSnapshot(doc(db, "generales", "BBe55sjijYHQONSVjrqY"), (doc) => {
//         resolve(doc.data());
//     });
// }); 
 
   
