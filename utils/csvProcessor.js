const fs = require('fs');
const csv = require('csv-parser');

function setNestedValue(obj, key, value) {
    const keys = key.split('.');
    let current = obj;

    keys.forEach((k, i) => {
        if (i === keys.length - 1) {
            current[k] = value;
        } else {
            if (!current[k]) current[k] = {};
            current = current[k];
        }
    });

    return obj;
}

async function parseCSVStream(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const user = {};
                const address = {};
                const additional_info = {};

                for (let rawKey in row) {
                    const key = rawKey.trim();
                    const value = row[rawKey].trim();

                    if (key.startsWith('name.')) {
                        setNestedValue(user, key, value);
                    } else if (key.startsWith('address.')) {
                        setNestedValue(address, key.replace('address.', ''), value);
                    } else if (key === 'age') {
                        user.age = parseInt(value, 10);
                    } else {
                        setNestedValue(additional_info, key, value);
                    }
                }

                results.push({
                    name: `${user.name?.firstName || ''} ${user.name?.lastName || ''}`.trim(),
                    age: user.age,
                    address,
                    additional_info,
                });
            })              
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

module.exports = { parseCSVStream };
