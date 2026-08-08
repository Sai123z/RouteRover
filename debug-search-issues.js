// Debug script to test the exact search issues
import fetch from 'node-fetch';

async function debugSearchIssues() {
    try {
        console.log('🔍 Debugging Search Issues...\n');
        
        // Test 1: Search by station (Belagavi to Pune - should return no results)
        console.log('1️⃣ Testing search: Belagavi to Pune');
        const search1Response = await fetch('http://localhost:5000/api/trains?from=Belagavi&to=Pune&searchOption=SEARCH%20by%20station');
        const search1Data = await search1Response.json();
        
        console.log('Response status:', search1Response.status);
        console.log('Response data:', JSON.stringify(search1Data, null, 2));
        
        // Test 2: Search by station (Belagavi to Mumbai - should return results)
        console.log('\n2️⃣ Testing search: Belagavi to Mumbai');
        const search2Response = await fetch('http://localhost:5000/api/trains?from=Belagavi&to=Mumbai&searchOption=SEARCH%20by%20station');
        const search2Data = await search2Response.json();
        
        console.log('Response status:', search2Response.status);
        console.log('Response data:', JSON.stringify(search2Data, null, 2));
        
        // Test 3: Search by number
        console.log('\n3️⃣ Testing search by number: 12307');
        const search3Response = await fetch('http://localhost:5000/api/trains?number=12307&searchOption=SEARCH%20by%20number');
        const search3Data = await search3Response.json();
        
        console.log('Response status:', search3Response.status);
        console.log('Response data:', JSON.stringify(search3Data, null, 2));
        
        // Test 4: Get all trains
        console.log('\n4️⃣ Testing get all trains');
        const allTrainsResponse = await fetch('http://localhost:5000/api/trains/all');
        const allTrainsData = await allTrainsResponse.json();
        
        console.log('Response status:', allTrainsResponse.status);
        console.log('Number of trains:', allTrainsData.data ? allTrainsData.data.length : 0);
        if (allTrainsData.data) {
            allTrainsData.data.forEach(train => {
                console.log(`   - ${train.number}: ${train.name} (${train.source || train.origin} → ${train.destination})`);
            });
        }
        
        // Test 5: Test booking endpoint availability
        console.log('\n5️⃣ Testing booking endpoints...');
        const testBookingResponse = await fetch('http://localhost:5000/api/bookings/test');
        console.log('Booking test endpoint status:', testBookingResponse.status);
        
        if (testBookingResponse.status === 404) {
            console.log('❌ Booking endpoints might not be properly registered');
        } else {
            const testBookingData = await testBookingResponse.json();
            console.log('Booking test response:', testBookingData);
        }
        
    } catch (error) {
        console.error('❌ Error in debug test:', error.message);
    }
}

debugSearchIssues();