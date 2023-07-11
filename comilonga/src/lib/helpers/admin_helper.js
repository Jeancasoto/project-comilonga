import { getDoc, getDocs ,doc, collection, onSnapshot} from 'firebase/firestore';
import { db, storage } from '$lib/firebase';


export const retrieveDoc = new Promise ((resolve, reject) =>{

});

export const getGenerals = async () => {
    const docRef = doc(db, "generales", "BBe55sjijYHQONSVjrqY");
    const docSnap = await getDoc(docRef);
    return docSnap.data();    
}; 

// export const getGenerals = new Promise ((resolve, reject, ) => {
//     const unsub = onSnapshot(doc(db, "generales", "BBe55sjijYHQONSVjrqY"), (doc) => {
//         resolve(doc.data());
//     });
// }); 
 
   
