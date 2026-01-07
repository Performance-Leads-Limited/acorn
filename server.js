const express = require('express');
const path = require('path');

const app = express();
// Use port 8080 or environment variable
const port = process.env.PORT || 8080;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve index.html (optional for SPA, good for static site)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Static Preview Server running at http://localhost:${port}`);
    console.log(`NOTE: This server is for local preview only. Host the 'public' folder on GitHub Pages.`);
});
