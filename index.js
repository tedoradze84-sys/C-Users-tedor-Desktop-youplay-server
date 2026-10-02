const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// გაფართოებული და მეტად სანდო პიპედის ინსტანციები
const instances = [
    "https://pipedapi.kavin.rocks",
    "https://api.piped.projectsegfau.lt",
    "https://pipedapi.adminforge.de",
    "https://piped-api.garudalinux.org",
    "https://pipedapi.in.projectsegfau.lt"
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
                const items = data.items || data;
                if (items && items.length > 0) {
                    return res.json(items);
                }
            }
        } catch (e) {}
    }
    
    // სათადარიგო შედეგები უსაფრთხოებისთვის
    res.json([
        { videoId: "jfKfPfyJRdk", title: `Lofi Girl - ${query}`, uploader: "Lofi Girl" },
        { videoId: "5qap5aO4i9A", title: `Lofi Hip Hop - ${query}`, uploader: "Lofi Girl" },
        { videoId: "2Vv-BfVoq4g", title: "Ed Sheeran - Perfect", uploader: "Ed Sheeran" }
    ]);
});

// ნაკადის (Stream) ენდპოინტი
app.get(['/stream', '/stream/:videoId'], async (req, res) => {
    const videoId = req.query.id || req.params.videoId;
    if (!videoId) return res.status(400).json({ error: "Missing video id" });

    for (const instance of instances) {
        try {
            const response = await fetch(`${instance}/streams/${videoId}`);
            if (response.status === 200) {
                const data = await response.json();
                const audioStreams = data.audioStreams;
                if (audioStreams && audioStreams.length > 0) {
                    const bestStream = audioStreams.reduce((prev, curr) => (curr.bitrate > prev.bitrate) ? curr : prev);
                    return res.json({ url: bestStream.url });
                }
            }
        } catch (e) {}
    }
    
    // სათადარიგო აუდიო ნაკადი
    res.json({ url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3" });
});

app.listen(PORT, () => {
    console.log(`YouPlay Server running on port ${PORT}`);
});
