import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

function TestConnection() {
    const [status, setStatus] = useState('Checking connection...');
    const [sampleData, setSampleData] = useState(null);

    useEffect(() => {
        async function checkConnection() {
            try {
                const wordsRef = collection(db, 'words');
                const q = query(wordsRef, limit(1));
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setStatus('Connected but no data found');
                } else {
                    setStatus('Connected! Data found!');
                    setSampleData(snapshot.docs[0].data());
                }
            } catch (error) {
                setStatus('Connection error: ' + error.message);
            }
        }

        checkConnection();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Firebase Connection Test</h2>
            <p><strong>Status:</strong> {status}</p>
            {sampleData && (
                <div>
                    <h3>Sample Word Data:</h3>
                    <pre>{JSON.stringify(sampleData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default TestConnection 