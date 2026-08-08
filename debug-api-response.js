// Debug script to see the actual API response structure
import fetch from 'node-fetch';

async function debugApiResponse() {
    try {
        const response = await fetch('http://localhost:5000/api/trains/realtime/12301');
        const data = await response.json();
        
        console.log('Full API Response:');
        console.log(JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugApiResponse();