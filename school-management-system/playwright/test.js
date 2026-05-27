const https = require('https');

const urls = [
    'https://marketplace.visualstudio.com',
    'https://ms-playwright.gallerycdn.vsassets.io',
    'https://vsassets.io',
    'https://api.github.com' // comparison
];

function testConnection(url) {
    console.log(`\nTesting: ${url}`);

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Node.js Connection Test'
        },
        timeout: 5000
    };

    const req = https.request(url, options, (res) => {
        console.log(`Status: ${res.statusCode}`);

        res.on('data', () => {});
        res.on('end', () => {
            console.log(`Completed: ${url}`);
        });
    });

    req.on('error', (err) => {
        console.log(`Error connecting to ${url}`);
        console.log(err.message);
    });

    req.on('timeout', () => {
        console.log(`Timeout connecting to ${url}`);
        req.destroy();
    });

    req.end();
}

urls.forEach(testConnection);
