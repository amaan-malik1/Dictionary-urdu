const fs = require('fs');
const path = require('path');

const requiredFiles = [
    ['public/index.html', 'HTML entry point'],
    ['public/manifest.json', 'Web app manifest'],
    ['src/index.js', 'Application entry point'],
    ['src/App.jsx', 'Root component'],
    ['firebase.json', 'Firebase configuration'],
    ['firestore.rules', 'Firestore security rules']
];

const requiredDependencies = [
    'react',
    'react-dom',
    'react-router-dom',
    'firebase',
    'framer-motion'
];

function verifyProject() {
    console.log('🔍 Starting project verification...\n');
    let hasErrors = false;

    // Check required files
    console.log('Checking required files:');
    requiredFiles.forEach(([file, description]) => {
        if (!fs.existsSync(path.join(process.cwd(), file))) {
            console.error(`❌ Missing ${description}: ${file}`);
            hasErrors = true;
        } else {
            console.log(`✅ Found ${description}: ${file}`);
        }
    });

    // Check package.json
    console.log('\nChecking package.json...');
    try {
        const package = require(path.join(process.cwd(), 'package.json'));

        // Check dependencies
        console.log('\nChecking dependencies:');
        requiredDependencies.forEach(dep => {
            if (!package.dependencies[dep]) {
                console.error(`❌ Missing dependency: ${dep}`);
                hasErrors = true;
            } else {
                console.log(`✅ Found dependency: ${dep}`);
            }
        });

        // Check scripts
        const requiredScripts = ['start', 'build', 'deploy'];
        console.log('\nChecking scripts:');
        requiredScripts.forEach(script => {
            if (!package.scripts[script]) {
                console.error(`❌ Missing script: ${script}`);
                hasErrors = true;
            } else {
                console.log(`✅ Found script: ${script}`);
            }
        });
    } catch (error) {
        console.error('❌ Error reading package.json:', error);
        hasErrors = true;
    }

    return !hasErrors;
}

// Run verification
const isValid = verifyProject();

if (isValid) {
    console.log('\n✅ Project verification passed! Ready to deploy.');
    process.exit(0);
} else {
    console.error('\n❌ Project verification failed! Please fix the issues above.');
    process.exit(1);
} 