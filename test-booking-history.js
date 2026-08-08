// Test script to verify booking history functionality
import fetch from 'node-fetch';

async function testBookingHistory() {
    console.log('🧪 Testing Booking History Functionality\n');
    
    try {
        // Step 1: Login to get user credentials
        console.log('1️⃣ Testing user login...');
        const loginResponse = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testuser2@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        if (loginData.message !== 'Login successful') {
            console.log('❌ Login failed:', loginData.message);
            return;
        }
        
        console.log('✅ Login successful');
        const testEmail = loginData.user.email;
        
        // Step 2: Create a test booking
        console.log('\n2️⃣ Creating test booking...');
        const bookingId = `HISTORY-TEST-${Date.now()}`;
        const testPassengers = [
            { name: 'John Smith', age: 35, gender: 'male', coach: '2A' },
            { name: 'Jane Smith', age: 32, gender: 'female', coach: '2A' }
        ];
        
        // Store passenger details
        const passengerResponse = await fetch('http://localhost:5000/api/bookings/store-passenger-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                trainNumber: '12307',
                bookID: bookingId,
                passengers: JSON.stringify(testPassengers)
            })
        });
        
        // Store booking details
        const bookingResponse = await fetch('http://localhost:5000/api/bookings/store-booking-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                bookID: bookingId,
                trainNumber: '12307',
                seatsBooked: testPassengers.length,
                coach: '2A'
            })
        });
        
        // Store user booking
        const userBookingResponse = await fetch('http://localhost:5000/api/bookings/store-user-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                bookID: bookingId,
                journeyDate: '2025-12-30'
            })
        });
        
        const passengerData = await passengerResponse.json();
        const bookingData = await bookingResponse.json();
        const userBookingData = await userBookingResponse.json();
        
        if (passengerData.success && bookingData.success && userBookingData.success) {
            console.log('✅ Test booking created successfully');
            console.log(`   Booking ID: ${bookingId}`);
        } else {
            console.log('❌ Failed to create test booking');
            return;
        }
        
        // Step 3: Test booking history API
        console.log('\n3️⃣ Testing booking history API...');
        const historyResponse = await fetch(
            `http://localhost:5000/api/bookings/user-bookings?email=${encodeURIComponent(testEmail)}`
        );
        
        const historyData = await historyResponse.json();
        
        if (Array.isArray(historyData) && historyData.length > 0) {
            console.log('✅ Booking history API working');
            console.log(`   Found ${historyData.length} booking(s)`);
            
            // Find our test booking
            const testBooking = historyData.find(b => b.bookID === bookingId);
            if (testBooking) {
                console.log('✅ Test booking found in history');
                console.log(`   Train: ${testBooking.train_name || testBooking.trainNumber}`);
                console.log(`   Route: ${testBooking.from_station} → ${testBooking.to_station}`);
                console.log(`   Passengers: ${testBooking.passengerDetails?.length || 0}`);
                console.log(`   Fare: ₹${testBooking.fare}`);
                console.log(`   Journey Date: ${testBooking.journeyDate}`);
            } else {
                console.log('⚠️  Test booking not found in history (may take a moment to appear)');
            }
            
            // Display all bookings
            console.log('\n📋 All User Bookings:');
            historyData.forEach((booking, index) => {
                console.log(`\n   ${index + 1}. Booking ID: ${booking.bookID}`);
                console.log(`      Train: ${booking.train_name || booking.trainNumber || 'N/A'}`);
                console.log(`      Route: ${booking.from_station || 'N/A'} → ${booking.to_station || 'N/A'}`);
                console.log(`      Date: ${booking.journeyDate}`);
                console.log(`      Passengers: ${booking.passengerDetails?.length || 0}`);
                console.log(`      Fare: ₹${booking.fare || 'N/A'}`);
                console.log(`      Class: ${booking.coach || 'N/A'}`);
            });
            
        } else {
            console.log('❌ No booking history found or API failed');
            console.log('Response:', historyData);
        }
        
        // Step 4: Test individual booking details APIs
        console.log('\n4️⃣ Testing individual booking details APIs...');
        
        // Test passenger details
        const passengerDetailsResponse = await fetch(
            `http://localhost:5000/api/bookings/fetch-passenger-details?bookID=${bookingId}`
        );
        const passengerDetailsData = await passengerDetailsResponse.json();
        
        if (Array.isArray(passengerDetailsData) && passengerDetailsData.length > 0) {
            console.log('✅ Passenger details API working');
            console.log(`   Retrieved ${passengerDetailsData.length} passenger(s)`);
            passengerDetailsData.forEach((passenger, index) => {
                console.log(`   ${index + 1}. ${passenger.pname} (${passenger.page} years, ${passenger.pgender})`);
            });
        } else {
            console.log('❌ Passenger details API failed');
        }
        
        // Test booking fare
        const fareDetailsResponse = await fetch(
            `http://localhost:5000/api/bookings/fetch-booking-fare?bookID=${bookingId}`
        );
        const fareDetailsData = await fareDetailsResponse.json();
        
        if (fareDetailsData && fareDetailsData.fare) {
            console.log('✅ Booking fare API working');
            console.log(`   Seats: ${fareDetailsData.seatsBooked}`);
            console.log(`   Total Fare: ₹${fareDetailsData.fare}`);
        } else {
            console.log('❌ Booking fare API failed');
        }
        
        // Test user booking
        const userBookingDetailsResponse = await fetch(
            `http://localhost:5000/api/bookings/fetch-user-booking?bookID=${bookingId}`
        );
        const userBookingDetailsData = await userBookingDetailsResponse.json();
        
        if (userBookingDetailsData && userBookingDetailsData.journeyDate) {
            console.log('✅ User booking API working');
            console.log(`   Journey Date: ${userBookingDetailsData.journeyDate}`);
        } else {
            console.log('❌ User booking API failed');
        }
        
        console.log('\n🎉 Booking History Test Complete!');
        console.log('\n📱 Frontend Testing:');
        console.log('1. Open http://localhost:5173/dashboard');
        console.log('2. Login with: testuser2@example.com / password123');
        console.log('3. Click on "My Bookings" tab');
        console.log('4. Verify booking history is displayed');
        console.log('5. Click "View Details" on any booking');
        console.log('6. Test "Download Ticket" functionality');
        
    } catch (error) {
        console.error('❌ Error in booking history test:', error.message);
    }
}

testBookingHistory();