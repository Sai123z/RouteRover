// Comprehensive test for the reservation system
import fetch from 'node-fetch';

async function testReservationSystem() {
    try {
        console.log('🎫 Testing Reservation System...\n');
        
        // Test 1: Train search by station
        console.log('1️⃣ Testing train search by station:');
        const searchResponse = await fetch('http://localhost:5000/api/trains?from=Belagavi&to=Mumbai&searchOption=SEARCH%20by%20station');
        const searchData = await searchResponse.json();
        
        if (searchData.success) {
            console.log(`✅ Found ${searchData.data.length} trains`);
            searchData.data.forEach(train => {
                console.log(`   - ${train.number}: ${train.name} (${train.source || train.origin} → ${train.destination})`);
            });
        } else {
            console.log('❌ Train search failed:', searchData.message);
        }
        
        // Test 2: Train search by number
        console.log('\n2️⃣ Testing train search by number:');
        const numberSearchResponse = await fetch('http://localhost:5000/api/trains?number=12307&searchOption=SEARCH%20by%20number');
        const numberSearchData = await numberSearchResponse.json();
        
        if (numberSearchData.success) {
            console.log(`✅ Found train by number`);
            numberSearchData.data.forEach(train => {
                console.log(`   - ${train.number}: ${train.name}`);
                console.log(`   - Route: ${train.source || train.origin} → ${train.destination}`);
                console.log(`   - Fare: ₹${train.fare}`);
                console.log(`   - Available Seats: ${train.available_seats}`);
            });
        } else {
            console.log('❌ Train search by number failed:', numberSearchData.message);
        }
        
        // Test 3: Booking endpoints
        console.log('\n3️⃣ Testing booking endpoints:');
        
        // Test passenger details storage
        const testBookID = `TEST-${Date.now()}`;
        const testPassengers = [
            { name: 'John Doe', age: 30, gender: 'male', coach: '2A' },
            { name: 'Jane Doe', age: 28, gender: 'female', coach: '2A' }
        ];
        
        console.log('   Testing passenger details storage...');
        const passengerResponse = await fetch('http://localhost:5000/api/bookings/store-passenger-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                trainNumber: '12307',
                bookID: testBookID,
                passengers: JSON.stringify(testPassengers)
            })
        });
        
        const passengerData = await passengerResponse.json();
        if (passengerData.success) {
            console.log('   ✅ Passenger details stored successfully');
        } else {
            console.log('   ❌ Passenger details storage failed:', passengerData.message);
        }
        
        // Test booking details storage
        console.log('   Testing booking details storage...');
        const bookingResponse = await fetch('http://localhost:5000/api/bookings/store-booking-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                bookID: testBookID,
                trainNumber: '12307',
                seatsBooked: 2,
                coach: '2A'
            })
        });
        
        const bookingData = await bookingResponse.json();
        if (bookingData.success) {
            console.log('   ✅ Booking details stored successfully');
        } else {
            console.log('   ❌ Booking details storage failed:', bookingData.message);
        }
        
        // Test user booking storage
        console.log('   Testing user booking storage...');
        const userBookingResponse = await fetch('http://localhost:5000/api/bookings/store-user-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                bookID: testBookID,
                journeyDate: '2025-12-25'
            })
        });
        
        const userBookingData = await userBookingResponse.json();
        if (userBookingData.success) {
            console.log('   ✅ User booking stored successfully');
        } else {
            console.log('   ❌ User booking storage failed:', userBookingData.message);
        }
        
        // Test 4: Fetch booking details
        console.log('\n4️⃣ Testing booking retrieval:');
        
        const fetchPassengerResponse = await fetch(`http://localhost:5000/api/bookings/fetch-passenger-details?bookID=${testBookID}`);
        const fetchedPassengers = await fetchPassengerResponse.json();
        
        if (Array.isArray(fetchedPassengers) && fetchedPassengers.length > 0) {
            console.log('   ✅ Passenger details retrieved successfully');
            fetchedPassengers.forEach((p, i) => {
                console.log(`     Passenger ${i + 1}: ${p.pname}, Age: ${p.page}, Gender: ${p.pgender}, Class: ${p.pclass}`);
            });
        } else {
            console.log('   ❌ Failed to retrieve passenger details');
        }
        
        const fetchBookingResponse = await fetch(`http://localhost:5000/api/bookings/fetch-booking-fare?bookID=${testBookID}`);
        const fetchedBooking = await fetchBookingResponse.json();
        
        if (fetchedBooking && fetchedBooking.seatsBooked) {
            console.log('   ✅ Booking fare retrieved successfully');
            console.log(`     Seats: ${fetchedBooking.seatsBooked}, Fare: ₹${fetchedBooking.fare}`);
        } else {
            console.log('   ❌ Failed to retrieve booking fare');
        }
        
        console.log('\n🎉 Reservation system test completed!');
        
    } catch (error) {
        console.error('❌ Error testing reservation system:', error.message);
    }
}

testReservationSystem();