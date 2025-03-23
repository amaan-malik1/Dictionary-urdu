const { exec } = require('child_process');
const { verifyProduction } = require('./verify-production');

async function deploy() {
    try {
        console.log('🚀 Starting deployment process...');

        // Build the project
        console.log('\n📦 Building project...');
        await execCommand('npm run build');

        // Verify production setup
        console.log('\n🔍 Verifying production setup...');
        const isVerified = await verifyProduction();
        if (!isVerified) {
            throw new Error('Production verification failed');
        }

        // Deploy to Firebase
        console.log('\n🚀 Deploying to Firebase...');
        await execCommand('firebase deploy');

        console.log('\n✅ Deployment successful!');
    } catch (error) {
        console.error('\n❌ Deployment failed:', error);
        process.exit(1);
    }
}

function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                reject(error);
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
}

deploy(); 