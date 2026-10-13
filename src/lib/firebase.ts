import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connectivity validation helper as mandated by firebase-integration skill
export async function validateFirebaseConnection() {
  try {
    await getDocFromServer(doc(firestore, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is operating in offline mode.');
    }
    return false;
  }
}

export default app;
