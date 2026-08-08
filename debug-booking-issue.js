// Debug script to test the booking process step by step
import fetch from 'node-fetch';

async function debugBookingIssue() {
    try {
        console.log('🔍 Debugging Booking Issue...\n');
        
        // Step 1: Test user authentication
        console.log('1️⃣ Testing user authentication:');
        const loginResponse = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testuser2@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        if (loginData.message === 'Login successful') {
            console.log('✅ User authentication working');
            console.log(`   User: ${loginData.user.email}`);
        } else {
            console.log('❌ User authentication failed:', loginData.message);
            return;
        }
        
        // Step 2: Test train search
        console.log('\n2️⃣ Testing train search:');
        const searchResponse = await fetch('http://localhost:5000/api/trains?from=Belagavi&to=Mumbai&searchOption=SEARCH%20by%20station');
        const searchData = await searchResponse.json();
        
        if (searchData.success && searchData.data.length > 0) {
            console.log('✅ Train search working');
            console.log(`   Found: ${searchData.data[0].number} - ${searchData.data[0].name}`);
        } else {
            console.log('❌ Train search failed');
            return;
        }
        
        // Step 3: Test train details by number
        console.log('\n3️⃣ Testing train details by number:');
        const trainDetailsResponse = await fetch('http://localhost:5000/api/trains?number=12307&searchOption=SEARCH%20by%20number');
        const trainDetailsData = await trainDetailsResponse.json();
        
        if (trainDetailsData.success && trainDetailsData.data.length > 0) {
            console.log('✅ Train details working');
            const train = trainDetailsData.data[0];
            console.log(`   Train: ${train.name}`);
            console.log(`   Fare: ₹${train.fare}`);
            console.log(`   Available Seats: ${train.available_seats}`);
        } else {
            console.log('❌ Train details failed');
            return;
        }
        
        // Step 4: Test booking endpoints individually
        console.log('\n4️⃣ Testing booking endpoints:');
        const bookingId = `DEBUG-${Date.now()}`;
        const testEmail = loginData.user.email;
        
        // Test passenger details endpoint
        console.log('   4a. Testing passenger details storage...');
        const passengerResponse = await fetch('http://localhost:5000/api/bookings/store-passenger-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                trainNumber: '12307',
                bookID: bookingId,
                passengers: JSON.stringify([
                    { name: 'Debug User', age: 30, gender: 'male', coach: '2A' }
                ])
            })
        });
        
        const passengerData = await passengerResponse.json();
        console.log('   Response status:', passengerResponse.status);
        console.log('   Response data:', JSON.stringify(passengerData, null, 2));
        
        if (passengerData.success) {
            console.log('   ✅ Passenger details storage working');
            
            // Test booking details endpoint
            console.log('   4b. Testing booking details storage...');
            const bookingResponse = await fetch('http://localhost:5000/api/bookings/store-booking-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    bookID: bookingId,
                    trainNumber: '12307',
                    seatsBooked: 1,
                    coach: '2A'
                })
            });
            
            const bookingData = await bookingResponse.json();
            console.log('   Response status:', bookingResponse.status);
            console.log('   Response data:', JSON.stringify(bookingData, null, 2));
            
            if (bookingData.success) {
                console.log('   ✅ Booking details storage working');
                
                // Test user booking endpoint
                console.log('   4c. Testing user booking storage...');
                const userBookingResponse = await fetch('http://localhost:5000/api/bookings/store-user-booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: testEmail,
                        bookID: bookingId,
                        journeyDate: '2025-12-30'
                    })
                });
                
                const userBookingData = await userBookingResponse.json();
                console.log('   Response status:', userBookingResponse.status);
                console.log('   Response data:', JSON.stringify(userBookingData, null, 2));
                
                if (userBookingData.success) {
                    console.log('   ✅ User booking storage working');
                    console.log('\n🎉 All booking endpoints are working!');
                    
                    // Test retrieval
                    console.log('\n5️⃣ Testing booking retrieval:');
                    const retrievalResponse = await fetch(`http://localhost:5000/api/bookings/fetch-passenger-details?bookID=${bookingId}`);
                    const retrievalData = await retrievalResponse.json();
                    
                    if (Array.isArray(retrievalData) && retrievalData.length > 0) {
                        console.log('✅ Booking retrieval working');
                        console.log(`   Retrieved passenger: ${retrievalData[0].pname}`);
                    } else {
                        console.log('❌ Booking retrieval failed');
                    }
                } else {
                    console.log('   ❌ User booking storage failed:', userBookingData.message);
                }
            } else {
                console.log('   ❌ Booking details storage failed:', bookingData.message);
            }
        } else {
            console.log('   ❌ Passenger details storage failed:', passengerData.message);
        }
        
        // Step 5: Check database state
        console.log('\n6️⃣ Testing database queries:');
        try {
            const allTrainsResponse = await fetch('http://localhost:5000/api/trains/all');
            const allTrainsData = await allTrainsResponse.json();
            console.log(`✅ Database has ${allTrainsData.data.length} trains`);
        } catch (error) {
            console.log('❌ Database query failed:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error in booking debug:', error.message);
    }
}

debugBookingIssue();