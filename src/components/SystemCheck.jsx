import React, { useState, useEffect } from 'react';
import { verifySetup } from '../utils/verifySetup';

function SystemCheck() {
  const [checks, setChecks] = useState({
    database: false,
    hasData: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runChecks = async () => {
      try {
        setLoading(true);
        const results = await verifySetup();
        
        if (results && typeof results === 'object') {
          setChecks({
            database: results.success || false,
            hasData: results.hasData || false
          });
        } else {
          console.error('Verification results not in expected format:', results);
          setError('Verification results not in expected format');
        }
      } catch (err) {
        console.error('System check error:', err);
        setError(err.message || 'System check failed');
      } finally {
        setLoading(false);
      }
    };

    runChecks();
  }, []);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 p-3 rounded-lg shadow-md opacity-75">
        <p className="text-sm">Running system checks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 p-3 rounded-lg shadow-md opacity-75">
        <p className="text-sm">Error: {error}</p>
      </div>
    );
  }

  // Simple rendering without Object.entries
  return (
    <div className="fixed bottom-4 right-4 bg-gray-100 p-3 rounded-lg shadow-md opacity-75">
      <h3 className="text-xs font-bold mb-2">System Status</h3>
      <ul className="text-xs">
        <li>Database: {checks.database ? '✅' : '❌'}</li>
        <li>Has Data: {checks.hasData ? '✅' : '❌'}</li>
      </ul>
    </div>
  );
}

export default SystemCheck; 