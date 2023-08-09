const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url || [];

    const fetchNumbers = async (url) => {
        try {
            const response = await axios.get(url, { timeout: 500 });
            if (response.status === 200) {
                return response.data.numbers || [];
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}: ${error.message}`);
        }
        return [];
    };

    const mergedNumbers = [];
    const fetchPromises = urls.map(url => fetchNumbers(url));
    
    try {
        const fetchedNumbersArrays = await Promise.all(fetchPromises);
        fetchedNumbersArrays.forEach(numbers => {
            mergedNumbers.push(...numbers);
        });
        const uniqueSortedNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);
        res.json({ numbers: uniqueSortedNumbers });
    } catch (error) {
        console.error(`Error while fetching numbers: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
