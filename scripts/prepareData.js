const fs = require('fs');
const path = require('path');

// Load your main dictionary file
const dictionaryPath = path.join(__dirname, '../src/data/dictionary.json');
const rawData = fs.readFileSync(dictionaryPath, 'utf8');
const dictionary = JSON.parse(rawData);

// Create output directory
const outputDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Create an index file with all words and minimal data
const index = dictionary.words.map(word => ({
    id: word.id || generateId(word.word),
    word: word.word,
    roman: word.roman
}));

fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(index)
);

// Split dictionary into alphabetical chunks
const alphabet = {};
dictionary.words.forEach(word => {
    // Use first character of roman (transliterated) form for organization
    const firstChar = word.roman.charAt(0).toLowerCase();
    if (!alphabet[firstChar]) {
        alphabet[firstChar] = [];
    }
    alphabet[firstChar].push(word);
});

// Write each letter's words to a separate file
Object.keys(alphabet).forEach(letter => {
    fs.writeFileSync(
        path.join(outputDir, `${letter}.json`),
        JSON.stringify(alphabet[letter])
    );
    console.log(`Created ${letter}.json with ${alphabet[letter].length} words`);
});

// Helper function to generate a consistent ID
function generateId(word) {
    return word.toLowerCase().replace(/\s+/g, '-');
}

console.log('Dictionary data preparation complete!'); 