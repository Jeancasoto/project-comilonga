import { getDocs, collection, onSnapshot} from 'firebase/firestore';
import { db, storage } from '$lib/firebase';


export const getGenerals = async () => {
    const generals_doc = (collection(db, "generales"))
    let data = {
        quienes_somos: '',
        mision: '',
        vision: '',
    }
    const unsubscribe = onSnapshot(generals_doc, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let aux = doc.data();
            data['quienes_somos'] = aux['quienes_somos']
        });
        console.log(data);
        return data;
    });
};
