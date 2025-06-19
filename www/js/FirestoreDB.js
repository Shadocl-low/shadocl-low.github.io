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

    async enablePersistence() {
        try {
            await this.db.enablePersistence({
                synchronizeTabs: true // For multi-tab sync
            });
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

    async registerVisitor() {
        try {
            // 1. Get visitor IP
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const { ip } = await ipResponse.json();

            // 2. Check if visitor exists
            const visitorDoc = await this.getDoc('saloonVisitors', ip);

            if (visitorDoc) {
                return {
                    index: visitorDoc.index,
                    note: visitorDoc.note
                };
            }

            // 3. Get current visitor count for index
            const snapshot = await this.db.collection('saloonVisitors').get();
            const visitorIndex = snapshot.size + 1;

            // 4. Assign piano note (13 notes cycle)
            const notes = ['A4', 'A#4', 'C4', 'F4', 'F#4', 'C5', 'G4', 'C#4', 'D#4'];
            const assignedNote = notes[(visitorIndex - 1) % notes.length];

            // 5. Create visitor record
            await this.updateDoc('saloonVisitors', ip, {
                ip,
                index: visitorIndex,
                note: assignedNote,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            return {
                index: visitorIndex-1,
                note: assignedNote
            };

        } catch (error) {
            console.error("Visitor registration failed:", error);
            // Fallback values
            return {
                index: 0,
                note: 'C4'
            };
        }
    }

    async getMelodySequence() {
        const doc = await this.getDoc('saloon', 'pianoMelody');
        return doc?.sequence || [];
    }

    listenToMelody(callback) {
        return this.listenToDoc('saloon', 'pianoMelody', (doc) => {
            callback(doc?.sequence || []);
        });
    }
}

// Singleton instance
const firestoreDB = new FirestoreDB();
Object.freeze(FirestoreDB);