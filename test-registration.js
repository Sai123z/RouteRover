// Simple test script to verify registration is working
import fetch from 'node-fetch';

async function testRegistration() {
    try {
        console.log('Testing user registration...');
        
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Registration successful!');
            console.log('Response:', data);
        } else {
            console.log('❌ Registration failed:');
            console.log('Status:', response.status);
            console.log('Response:', data);
        }
    } catch (error) {
        console.error('❌ Error testing registration:', error.message);
    }
}

async function testLogin() {
    try {
        console.log('\nTesting user login...');
        
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Login successful!');
            console.log('Response:', data);
        } else {
            console.log('❌ Login failed:');
            console.log('Status:', response.status);
            console.log('Response:', data);
        }
    } catch (error) {
        console.error('❌ Error testing login:', error.message);
    }
}

// Run tests
testRegistration().then(() => {
    setTimeout(testLogin, 1000); // Wait 1 second before testing login
});