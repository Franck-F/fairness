const fetch = require('node-fetch');

async function testApi() {
    try {
        console.log('Fetching /api/audits...');
        const res = await fetch('http://localhost:3000/api/audits');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testApi();
