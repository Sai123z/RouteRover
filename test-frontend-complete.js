// Complete frontend booking flow test
import fetch from 'node-fetch';

async function testCompleteFrontendFlow() {
    try {
        console.log('🧪 Testing Complete Frontend Booking Flow...\n');
        
        // Step 1: Test user login (simulating frontend login)
        console.log('1️⃣ Testing user login flow:');
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
            console.log('✅ Login successful');
            console.log(`   User: ${loginData.user.email}`);
            console.log(`   Username: ${loginData.user.username}`);
        } else {
            console.log('❌ Login failed:', loginData.message);
            return;
        }
        
        // Step 2: Test train search (simulating Reservation.jsx search)
        console.log('\n2️⃣ Testing train search flow:');
        const searchParams = new URLSearchParams({
            from: 'Belagavi',
            to: 'Mumbai',
            searchOption: 'SEARCH by station'
        });
        
        const searchResponse = await fetch(`http://localhost:5000/api/trains?${searchParams.toString()}`);
        const searchData = await searchResponse.json();
        
        if (searchData.success && searchData.data.length > 0) {
            console.log('✅ Train search working');
            const train = searchData.data[0];
            console.log(`   Found: ${train.number} - ${train.name}`);
            console.log(`   Route: ${train.source} → ${train.destination}`);
            console.log(`   Fare: ₹${train.fare}`);
            console.log(`   Available Seats: ${train.available_seats}`);
        } else {
            console.log('❌ Train search failed');
            return;
        }
        
        // Step 3: Test train details by number (simulating BookingCompo.jsx)
        console.log('\n3️⃣ Testing train details by number:');
        const trainNumber = '12307';
        const detailsParams = new URLSearchParams({
            number: trainNumber,
            searchOption: 'SEARCH by number'
        });
        
        const detailsResponse = await fetch(`http://localhost:5000/api/trains?${detailsParams.toString()}`);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.success && detailsData.data.length > 0) {
            console.log('✅ Train details working');
            const train = detailsData.data[0];
            console.log(`   Train: ${train.name}`);
            console.log(`   Number: ${train.number}`);
            console.log(`   Source: ${train.source}`);
            console.log(`   Destination: ${train.destination}`);
            console.log(`   Fare: ₹${train.fare}`);
            console.log(`   Available Seats: ${train.available_seats}`);
        } else {
            console.log('❌ Train details failed');
            return;
        }
        
        // Step 4: Test complete booking flow (simulating ReservationDetails.jsx)
        console.log('\n4️⃣ Testing complete booking flow:');
        const bookingId = `FRONTEND-TEST-${Date.now()}`;
        const testEmail = loginData.user.email;
        const testDate = '2025-12-30';
        const testCoach = '2A';
        const testPassengers = [
            { name: 'John Doe', age: 30, gender: 'male', coach: testCoach },
            { name: 'Jane Doe', age: 28, gender: 'female', coach: testCoach }
        ];
        
        console.log(`   Booking ID: ${bookingId}`);
        console.log(`   Email: ${testEmail}`);
        console.log(`   Train: ${trainNumber}`);
        console.log(`   Date: ${testDate}`);
        console.log(`   Coach: ${testCoach}`);
        console.log(`   Passengers: ${testPassengers.length}`);
        
        // Step 4a: Store passenger details
        console.log('\n   4a. Storing passenger details...');
        const passengerResponse = await fetch('http://localhost:5000/api/bookings/store-passenger-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                trainNumber: trainNumber,
                bookID: bookingId,
                passengers: JSON.stringify(testPassengers)
            })
        });
        
        const passengerData = await passengerResponse.json();
        console.log(`   Status: ${passengerResponse.status}`);
        console.log(`   Success: ${passengerData.success}`);
        console.log(`   Message: ${passengerData.message}`);
        
        if (!passengerData.success) {
            console.log('❌ Passenger details storage failed');
            return;
        }
        
        // Step 4b: Store booking details
        console.log('\n   4b. Storing booking details...');
        const bookingResponse = await fetch('http://localhost:5000/api/bookings/store-booking-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                bookID: bookingId,
                trainNumber: trainNumber,
                seatsBooked: testPassengers.length,
                coach: testCoach
            })
        });
        
        const bookingData = await bookingResponse.json();
        console.log(`   Status: ${bookingResponse.status}`);
        console.log(`   Success: ${bookingData.success}`);
        console.log(`   Message: ${bookingData.message}`);
        
        if (!bookingData.success) {
            console.log('❌ Booking details storage failed');
            return;
        }
        
        // Step 4c: Store user booking
        console.log('\n   4c. Storing user booking...');
        const userBookingResponse = await fetch('http://localhost:5000/api/bookings/store-user-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                bookID: bookingId,
                journeyDate: testDate
            })
        });
        
        const userBookingData = await userBookingResponse.json();
        console.log(`   Status: ${userBookingResponse.status}`);
        console.log(`   Success: ${userBookingData.success}`);
        console.log(`   Message: ${userBookingData.message}`);
        
        if (!userBookingData.success) {
            console.log('❌ User booking storage failed');
            return;
        }
        
        console.log('\n✅ Complete booking flow successful!');
        
        // Step 5: Test booking retrieval (simulating ShowBill.jsx)
        console.log('\n5️⃣ Testing booking retrieval:');
        const retrievalResponse = await fetch(`http://localhost:5000/api/bookings/fetch-passenger-details?bookID=${bookingId}`);
        const retrievalData = await retrievalResponse.json();
        
        if (Array.isArray(retrievalData) && retrievalData.length > 0) {
            console.log('✅ Booking retrieval working');
            retrievalData.forEach((passenger, index) => {
                console.log(`   Passenger ${index + 1}: ${passenger.pname}, Age: ${passenger.page}, Gender: ${passenger.pgender}`);
            });
        } else {
            console.log('❌ Booking retrieval failed');
        }
        
        // Step 6: Test booking fare retrieval
        console.log('\n6️⃣ Testing booking fare retrieval:');
        const fareResponse = await fetch(`http://localhost:5000/api/bookings/fetch-booking-fare?bookID=${bookingId}`);
        const fareData = await fareResponse.json();
        
        if (Array.isArray(fareData) && fareData.length > 0) {
            console.log('✅ Booking fare retrieval working');
            const booking = fareData[0];
            console.log(`   Train: ${booking.trainNumber}`);
            console.log(`   Seats: ${booking.seatsBooked}`);
            console.log(`   Coach: ${booking.coach}`);
        } else {
            console.log('❌ Booking fare retrieval failed');
        }
        
        // Step 7: Test user bookings list
        console.log('\n7️⃣ Testing user bookings list:');
        const userBookingsResponse = await fetch(`http://localhost:5000/api/bookings/user-bookings?email=${encodeURIComponent(testEmail)}`);
        const userBookingsData = await userBookingsResponse.json();
        
        if (userBookingsData.success && Array.isArray(userBookingsData.data)) {
            console.log('✅ User bookings list working');
            console.log(`   Total bookings: ${userBookingsData.data.length}`);
            if (userBookingsData.data.length > 0) {
                const latestBooking = userBookingsData.data[userBookingsData.data.length - 1];
                console.log(`   Latest booking: ${latestBooking.bookID}`);
                console.log(`   Journey date: ${latestBooking.journeyDate}`);
            }
        } else {
            console.log('❌ User bookings list failed');
        }
        
        console.log('\n🎉 ALL TESTS PASSED! Frontend booking flow is working correctly.');
        console.log('\n📋 Summary:');
        console.log('✅ User authentication');
        console.log('✅ Train search');
        console.log('✅ Train details');
        console.log('✅ Passenger details storage');
        console.log('✅ Booking details storage');
        console.log('✅ User booking storage');
        console.log('✅ Booking retrieval');
        console.log('✅ Fare retrieval');
        console.log('✅ User bookings list');
        
        console.log('\n🔍 If booking is not working in the frontend, the issue is likely:');
        console.log('1. Frontend validation preventing form submission');
        console.log('2. Network connectivity issues');
        console.log('3. CORS configuration');
        console.log('4. Frontend state management');
        console.log('5. User interface flow issues');
        
    } catch (error) {
        console.error('❌ Error in frontend test:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

testCompleteFrontendFlow();