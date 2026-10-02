const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// სანდო ინსტანციები
const instances = [
    "https://pipedapi.kavin.rocks",
    "https://api.piped.projectsegfau.lt",
    "https://pipedapi.adminforge.de"
];

// ძიების ენდპოინტი
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing query" });

    for (const instance of instances) {
        try {
            const response = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=videos`);
            if (response.status === 200) {
                const data = await response.json();
                return res.json(data);
            }
        } catch (e) {}
    }
    res.status(500).json({ error: "Failed to fetch search results" });
});

// ნაკადის (Stream) ენდპოინტი
app.get('/stream/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    for (const instance of instances) {
        try {
            const response = await fetch(`${instance}/streams/${videoId}`);
            if (response.status === 200) {
                const data = await response.json();
                return res.json(data);
            }
        } catch (e) {}
    }
    res.status(500).json({ error: "Failed to fetch stream" });
});

app.listen(PORT, () => {
    console.log(`YouPlay Server running on port ${PORT}`);
});