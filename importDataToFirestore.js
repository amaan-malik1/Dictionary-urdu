// Import necessary Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json'); // Download from Firebase console

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEcujN_SfTF7YgaQAZcHlq0SUqXxMB-9Q",
    authDomain: "learnurdu-18e49.firebaseapp.com",
    projectId: "learnurdu-18e49",
    storageBucket: "learnurdu-18e49.firebasestorage.app",
    messagingSenderId: "293890203517",
    appId: "1:293890203517:web:cf96bc65e1544c5f92b614",
    measurementId: "G-8SZLBENGWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const adminDb = admin.firestore();

// Add this function to sleep between batches
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function importData() {
    try {
        // Read the JSON file
        const filePath = path.join(__dirname, 'src', 'data', 'dictionary.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);

        if (!data.words || !Array.isArray(data.words)) {
            console.error('Invalid data format. Expected an object with a "words" array.');
            return;
        }

        const words = data.words;
        console.log(`Found ${words.length} words to import`);

        // Use batched writes for better performance
        // Firestore has a limit of 500 operations per batch
        const batchSize = 400;
        let successCount = 0;
        let errorCount = 0;

        // Set a daily limit to avoid quota issues
        const dailyLimit = 15000; // Stay below the 20,000 free tier limit
        let totalImported = 0;

        for (let i = 0; i < words.length; i += batchSize) {
            // Check if we're approaching the daily limit
            if (totalImported >= dailyLimit) {
                console.log(`Daily import limit reached (${totalImported}). Please run the script again tomorrow.`);
                break;
            }

            const batch = writeBatch(db);
            const wordsBatch = words.slice(i, i + batchSize);

            console.log(`Processing batch ${i / batchSize + 1}/${Math.ceil(words.length / batchSize)}`);

            for (const word of wordsBatch) {
                // Prepare word data with processed fields
                const wordData = {
                    word: word.word.toLowerCase(),
                    roman: word.roman.toLowerCase(),
                    definitions: word.definitions || [],
                    examples: word.examples || [],
                    categories: word.categories || [],
                    pronunciation: word.pronunciation || '',
                    createdAt: new Date().toISOString(),
                    // Add searchTerms array for better searching
                    searchTerms: [
                        word.word.toLowerCase(),
                        word.roman.toLowerCase(),
                        ...(word.categories || []).map(c => c.toLowerCase())
                    ]
                };

                // Create document reference with auto-generated ID
                const wordRef = doc(collection(db, 'words'));

                // Add to batch
                batch.set(wordRef, wordData);
            }

            try {
                // Add a delay between batches to prevent overloading
                await sleep(2000); // 2 second delay between batches

                await batch.commit();
                successCount += wordsBatch.length;
                totalImported += wordsBatch.length;
                console.log(`Batch ${i / batchSize + 1} successfully imported (${totalImported}/${dailyLimit} today)`);
            } catch (error) {
                console.error(`Error importing batch ${i / batchSize + 1}:`, error);

                // If quota exceeded, wait longer before retrying
                if (error.code === 'resource-exhausted') {
                    console.log('Quota exceeded. Waiting for 1 minute before continuing...');
                    await sleep(60000); // Wait 1 minute
                    i -= batchSize; // Retry this batch
                } else {
                    errorCount += wordsBatch.length;
                }
            }
        }

        // Save progress to a file so you can resume tomorrow
        fs.writeFileSync('import-progress.json', JSON.stringify({
            lastImportedIndex: Math.min(i, words.length),
            totalWords: words.length,
            date: new Date().toISOString()
        }));

        console.log(`Import complete. Successfully imported ${successCount} words. Failed: ${errorCount}`);
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

// Run the import
importData()
    .then(() => console.log('Import script completed'))
    .catch(err => console.error('Import script failed:', err)); 