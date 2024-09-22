const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // for handling file uploads
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));

// Utility function to check base64 validity using Buffer
function isValidBase64(str) {
    try {
        // Attempt to create a buffer from the base64 string
        Buffer.from(str, 'base64');
        return true;
    } catch (e) {
        return false;
    }
}

// POST /bfhl Route
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Extracting numbers and alphabets from the data array
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const lowercaseAlphabets = alphabets.filter(item => /^[a-z]$/.test(item));
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    // File handling logic
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKB = 0;

    if (file_b64 && isValidBase64(file_b64)) {
        fileValid = true;
        const fileBuffer = Buffer.from(file_b64, 'base64');
        fileSizeKB = fileBuffer.length / 1024;
        fileMimeType = 'application/octet-stream'; // General binary file MIME type
    }

    // Construct response
    const response = {
        is_success: true,
        user_id: "john_doe_17091999",  // Replace with your user id logic
        email: "john@xyz.com",
        roll_number: "ABCD123",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB
    };

    res.status(200).json(response);
});

// GET /bfhl Route
app.get('/bfhl', (req, res) => {
    const response = {
        operation_code: 1
    };
    res.status(200).json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
