import React, { useEffect, useState } from 'react';
import { systemCheck } from '../../utils/systemCheck';

function SystemStatus() {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const verifySystem = async () => {
            const result = await systemCheck();
            setStatus(result);
        };

        verifySystem();
    }, []);

    if (!status) return null;

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg max-w-md">
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

export default SystemStatus; 