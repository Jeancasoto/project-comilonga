import { getDocs, collection} from 'firebase/firestore';
import { db, storage } from '$lib/firebase';


export const getGenerals = async () => {
    const querySnapshot = await getDocs(collection(db, "generales"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    });
};
