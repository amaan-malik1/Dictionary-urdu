import React, { useEffect, useState } from 'react';
import { verifySetup } from '../utils/verifySetup';

function SystemCheck() {
    const [status, setStatus] = useState({ checking: true });

    useEffect(() => {
        const checkSystem = async () => {
            const result = await verifySetup();
            setStatus(result);
        };

        checkSystem();
    }, []);

    if (status.checking) {
        return <div>Checking system...</div>;
    }

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="font-bold mb-2">System Status</h3>
            {Object.entries(status.checks).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                    <span className={value ? 'text-green-500' : 'text-red-500'}>
                        {value ? '✓' : '✗'}
                    </span>
                    <span className="capitalize">{key}</span>
                </div>
            ))}
        </div>
    );
}

export default SystemCheck; 