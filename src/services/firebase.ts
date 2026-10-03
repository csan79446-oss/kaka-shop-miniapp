import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Vendor, Product, Order, ChatMessage } from '../types';
import {
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';

// Suppress verbose backend polling warnings from flooding console
setLogLevel('error');

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Target provisioned database ID with robust long-polling for iframe/sandbox environments
let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreDb = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db: Firestore = firestoreDb;

// Check connection to Firestore as mandated by skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 4000)
    );
    await Promise.race([
      getDocFromServer(doc(db, '_connection_test', 'status')),
      timeoutPromise,
    ]);
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && (err.message.includes('offline') || err.message.includes('timeout'))) {
      console.warn('Firebase operating in local cache / offline mode.');
      return false;
    }
    return true;
  }
}

// Collections references
export const COLLECTIONS = {
  VENDORS: 'vendors',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CHAT_MESSAGES: 'chat_messages',
} as const;

/**
 * Seed initial data to Firestore if collection is empty
 */
export async function seedFirestoreIfEmpty() {
  try {
    const vendorsSnap = await getDocs(collection(db, COLLECTIONS.VENDORS));
    if (vendorsSnap.empty) {
      console.log('Seeding initial vendors to Firebase Cloud Firestore...');
      for (const v of INITIAL_VENDORS) {
        await setDoc(doc(db, COLLECTIONS.VENDORS, v.id), v, { merge: true });
      }
    }

    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log('Seeding initial products to Firebase Cloud Firestore...');
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, COLLECTIONS.PRODUCTS, p.id), p, { merge: true });
      }
    }

    const ordersSnap = await getDocs(collection(db, COLLECTIONS.ORDERS));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders to Firebase Cloud Firestore...');
      for (const o of INITIAL_ORDERS) {
        await setDoc(doc(db, COLLECTIONS.ORDERS, o.id), o, { merge: true });
      }
    }
  } catch (error) {
    console.warn('Initial cloud seed skipped or already populated:', error);
  }
}

/**
 * Save Vendor to Firestore
 */
export async function syncVendorToCloud(vendor: Vendor) {
  try {
    await setDoc(doc(db, COLLECTIONS.VENDORS, vendor.id), vendor, { merge: true });
  } catch (err) {
    console.warn('Error syncing vendor to cloud:', err);
  }
}

/**
 * Save Product to Firestore
 */
export async function syncProductToCloud(product: Product) {
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product, { merge: true });
  } catch (err) {
    console.warn('Error syncing product to cloud:', err);
  }
}

/**
 * Save Order to Firestore (Real-time live checkout)
 */
export async function syncOrderToCloud(order: Order) {
  try {
    await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order, { merge: true });
  } catch (err) {
    console.warn('Error syncing order to cloud:', err);
  }
}

/**
 * Save Chat Message to Firestore
 */
export async function syncChatToCloud(chat: ChatMessage) {
  try {
    await setDoc(doc(db, COLLECTIONS.CHAT_MESSAGES, chat.id), chat, { merge: true });
  } catch (err) {
    console.warn('Error syncing chat to cloud:', err);
  }
}
