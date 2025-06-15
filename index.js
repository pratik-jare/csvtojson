const express = require('express');
const multer = require('multer');
const pool = require('./db');
const { parseCSVStream } = require('./utils/csvProcessor');
require('dotenv').config();
const { generateAgeReport } = require('./utils/ageReport');


const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
      
        const filePath = req.file.path;
        const users = await parseCSVStream(filePath);

        for (const user of users) {
            await pool.query(
                `INSERT INTO users (name, age, address, additional_info)
           VALUES ($1, $2, $3, $4)`,
                [
                    user.name,
                    Number(user.age),
                    JSON.stringify(user.address),
                    JSON.stringify(user.additional_info),
                ]
            );
        }

        await generateAgeReport();

        res.json({ message: 'CSV uploaded and saved to DB', inserted: users.length });
    } catch (err) {
        console.error('❌ Error uploading CSV:', err);
        res.status(500).send('Upload failed');
    }
});

// app.get('/report', async (req, res) => {
//     await generateAgeReport();
// })

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});



