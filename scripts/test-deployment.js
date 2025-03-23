const axios = require('axios');

async function testDeployment(deploymentUrl) {
    try {
        // Test homepage
        const home = await axios.get(deploymentUrl);
        console.log('Homepage:', home.status === 200 ? 'OK' : 'Failed');

        // Test word lookup
        const word = await axios.get(`${deploymentUrl}/word/test`);
        console.log('Word Lookup:', word.status === 200 ? 'OK' : 'Failed');

        // Test suggestions API
        const suggestions = await axios.get(`${deploymentUrl}/api/suggestions?q=te`);
        console.log('Suggestions:', suggestions.status === 200 ? 'OK' : 'Failed');

    } catch (error) {
        console.error('Deployment Test Failed:', error);
    }
} 