const express = require('express');
const path = require('path');

const app = express();
// Use port 8080 or environment variable
const port = process.env.PORT || 8080;

// Serve static files from 'docs' directory (GitHub Pages standard)
app.use(express.static(path.join(__dirname, 'docs')));

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(port, () => {
    console.log(`Static Preview Server running at http://localhost:${port}`);
    console.log(`NOTE: This server is for local preview only. Host the 'public' folder on GitHub Pages.`);
});
