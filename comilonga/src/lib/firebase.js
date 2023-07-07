import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
	PUBLIC_API_KEY,
	PUBLIC_AUTH_DOMAIN,
	PUBLIC_PROJECT_ID,
	PUBLIC_STORAGE_BUCKET,
	PUBLIC_MESSAGING_SENDER_ID,
	PUBLIC_APP_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_API_KEY,
	authDomain: PUBLIC_AUTH_DOMAIN,
	projectId: PUBLIC_PROJECT_ID,
	storageBucket: PUBLIC_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_MESSAGING_SENDER_ID,
	appId: PUBLIC_APP_ID
};

let app = initializeApp(firebaseConfig, 'CLIENT');
const auth = getAuth(app);
let db = getFirestore(app);
export { auth, db };
