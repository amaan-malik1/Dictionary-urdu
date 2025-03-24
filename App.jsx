import { getPerformance } from 'firebase/performance';
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        // Make sure perf is properly initialized before using trace
        const performanceMonitoring = getPerformance();
        if (performanceMonitoring) {
            try {
                const trace = performanceMonitoring.trace('app_start');
                trace.start();
                // Your code here
                trace.stop();
            } catch (error) {
                console.error('Performance monitoring error:', error);
            }
        }
    }, []);

    // Rest of your component
} 
