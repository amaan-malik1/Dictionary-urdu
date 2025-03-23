// Add this file to help verify deployment
export const runDeploymentChecks = async () => {
    const checks = {
        auth: false,
        wordFetch: false,
        suggestions: false,
        database: false
    };

    try {
        // Check authentication
        const auth = getAuth();
        checks.auth = auth !== null;

        // Check word fetching
        const testWord = await getWordDetails('test');
        checks.wordFetch = testWord !== null;

        // Check suggestions
        const suggestions = await getWordSuggestions('te');
        checks.suggestions = Array.isArray(suggestions);

        // Check database connection
        const db = getFirestore();
        checks.database = db !== null;

        console.log('Deployment Checks:', checks);
        return checks;
    } catch (error) {
        console.error('Deployment Check Error:', error);
        return checks;
    }
}; 