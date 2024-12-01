const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an Express application
const app = express();
const PORT = 3000;

// Get the absolute path of your project directory
const PROJECT_ROOT = __dirname;

// Serve static files from multiple directories
app.use('/css', express.static(path.join(PROJECT_ROOT, 'css')));
app.use('/js', express.static(path.join(PROJECT_ROOT, 'js')));
app.use('/images', express.static(path.join(PROJECT_ROOT, 'images')));
app.use('/data', express.static(path.join(PROJECT_ROOT, 'data')));

// Middleware to parse JSON bodies
app.use(express.json());

// Home route with correct file name
app.get('/', (req, res) => {
    const homeFilePath = path.join(PROJECT_ROOT, 'studysync.html');
    
    console.log('Attempting to serve home page from:', homeFilePath);
    
    // Check if file exists before sending
    if (fs.existsSync(homeFilePath)) {
        res.sendFile(homeFilePath);
    } else {
        console.error('Home page file not found:', homeFilePath);
        res.status(404).send('Home page not found');
    }
});

// Dynamic route for other HTML files with comprehensive error handling
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const possibleFiles = [
        `${page}.html`,
        `${page}`,
        `${page}.studysync.html`,
        'studysync.html',
        'reviewpage.html',
        'price.html',
        'login.html',
        'login2.html'
    ];
    
    // Try multiple possible file names
    for (let filename of possibleFiles) {
        const filePath = path.join(PROJECT_ROOT, filename);
        
        console.log(`Checking file path: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
            console.log(`Serving file: ${filePath}`);
            return res.sendFile(filePath);
        }
    }
    
    // If no file found
    console.error(`No file found for page: ${page}`);
    res.status(404).send(`Page "${page}" not found`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).send('Something went wrong');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Project Root:', PROJECT_ROOT);
    console.log('Static file directories:');
    console.log('- /css     → CSS folder');
    console.log('- /js      → JavaScript folder');
    console.log('- /images  → Images folder');
    console.log('- /data    → JSON data folder');
});