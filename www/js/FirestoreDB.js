export default class FirestoreDB {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyAXXZqmBDbhZiopf73HCwnIH1PM3PnxWiY",
                authDomain: "saloonvisitors.firebaseapp.com",
                projectId: "saloonvisitors",
                storageBucket: "saloonvisitors.appspot.com",
                messagingSenderId: "374582370155",
                appId: "1:374582370155:web:c94dcf5981fa1138c3362e"
            });

            this.auth = firebase.auth();
            this.db = firebase.firestore();
            this.enablePersistence();
        } else {
            this.auth = firebase.auth();
            this.db = firebase.firestore();
        }
    }

    async signInAnonymously() {
        try {
            await this.auth.signInAnonymously();
            console.log("Signed in anonymously");
        } catch (err) {
            console.error("Anonymous auth failed:", err);
        }
    }

    async enablePersistence() {
        try {
            await this.db.enablePersistence({
                synchronizeTabs: true // For multi-tab sync
            });
            console.log("Persistence enabled");
        } catch (err) {
            console.warn("Persistence failed (likely unsupported browser):", err);
        }
    }

    // Generic document fetcher
    async getDoc(collection, docId) {
        try {
            const doc = await this.db.collection(collection).doc(docId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error("Firestore get error:", error);
            return null;
        }
    }

    // Real-time listener
    listenToDoc(collection, docId, callback) {
        return this.db.collection(collection)
            .doc(docId)
            .onSnapshot((doc) => {
                callback(doc.exists ? doc.data() : null);
            });
    }

    // Update document
    async updateDoc(collection, docId, data) {
        try {
            await this.db.collection(collection)
                .doc(docId)
                .set(data, { merge: true });
            return true;
        } catch (error) {
            console.error("Firestore update error:", error);
            return false;
        }
    }

    // Add to array field
    async addToArray(collection, docId, field, value) {
        try {
            await this.db.collection(collection)
                .doc(docId)
                .update({
                    [field]: firebase.firestore.FieldValue.arrayUnion(value)
                });
            return true;
        } catch (error) {
            console.error("Firestore array update error:", error);
            return false;
        }
    }
}

// Singleton instance
const firestoreDB = new FirestoreDB();
Object.freeze(FirestoreDB);

// Usage examples:
// 1. Get document
// firestoreDB.getDoc("saloon", "pianoMelody").then(data => ...);

// 2. Real-time updates
// firestoreDB.listenToDoc("saloon", "visitors", (data) => ...);

// 3. Update document
// firestoreDB.updateDoc("saloon", "puzzleState", { solved: true });

// 4. Add to array
// firestoreDB.addToArray("saloon", "pianoMelody", "currentSequence", "C4");