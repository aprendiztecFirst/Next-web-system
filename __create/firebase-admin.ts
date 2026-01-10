import admin from 'firebase-admin';

if (!admin.apps.length) {
  try { // Added try block
    console.log('Firebase admin initializing for project:', process.env.FIREBASE_PROJECT_ID);
    console.log('Firebase Client Email present:', !!process.env.FIREBASE_CLIENT_EMAIL);
    console.log('Firebase Private Key present:', !!process.env.FIREBASE_PRIVATE_KEY);

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase admin initialized successfully for project:', process.env.FIREBASE_PROJECT_ID);
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const db = admin.firestore();
export default admin;
