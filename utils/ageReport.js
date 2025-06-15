const pool = require('../db');

async function generateAgeReport() {
    const res = await pool.query('SELECT age FROM users');
    const ages = res.rows.map(row => row.age);

    const report = {
        '< 20': 0,
        '20-40': 0,
        '40-60': 0,
        '> 60': 0,
    };

    for (const age of ages) {
        if (age < 20) report['< 20']++;
        else if (age <= 40) report['20-40']++;
        else if (age <= 60) report['40-60']++;
        else report['> 60']++;
    }

    const total = ages.length;
    if (total === 0) {
        console.log('No data available for age distribution.');
        return;
    }

    // Convert counts to percentages
    console.log('\n📊 Age Group % Distribution');
    for (const range in report) {
        const percent = ((report[range] / total) * 100).toFixed(2);
        console.log(`${range.padEnd(6)} → ${percent}%`);
    }
}

module.exports = { generateAgeReport };
