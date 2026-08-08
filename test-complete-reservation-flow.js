// Complete reservation flow test
import fetch from 'node-fetch';

async function testCompleteReservationFlow() {
    try {
        console.log('🎫 Testing Complete Reservation Flow...\n');
        
        // Step 1: Register a test user
        console.log('1️⃣ Registering test user...');
        const registerResponse = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser2',
                email: 'testuser2@example.com',
                password: 'password123'
            })
        });
        
        const registerData = await registerResponse.json();
        if (registerData.message === 'User registered successfully') {
            console.log('✅ User registered successfully');
        } else {
            console.log('ℹ️ User might already exist, continuing...');
        }
        
        // Step 2: Login
        console.log('\n2️⃣ Logging in...');
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
            console.log(`   User: ${loginData.user.username} (${loginData.user.email})`);
        } else {
            console.log('❌ Login failed:', loginData.message);
            return;
        }
        
        // Step 3: Search for trains
        console.log('\n3️⃣ Searching for trains...');
        const searchResponse = await fetch('http://localhost:5000/api/trains?from=Belagavi&to=Mumbai&searchOption=SEARCH%20by%20station');
        const searchData = await searchResponse.json();
        
        if (searchData.success && searchData.data.length > 0) {
            console.log(`✅ Found ${searchData.data.length} trains`);
            const train = searchData.data[0];
            console.log(`   Selected: ${train.number} - ${train.name}`);
            console.log(`   Route: ${train.source || train.origin} → ${train.destination}`);
            console.log(`   Fare: ₹${train.fare}`);
            
            // Step 4: Get train details by number
            console.log('\n4️⃣ Getting train details...');
            const trainDetailsResponse = await fetch(`http://localhost:5000/api/trains?number=${train.number}&searchOption=SEARCH%20by%20number`);
            const trainDetailsData = await trainDetailsResponse.json();
            
            if (trainDetailsData.success) {
                console.log('✅ Train details retrieved');
                const trainDetails = trainDetailsData.data[0];
                console.log(`   Available seats: ${trainDetails.available_seats}`);
                
                // Step 5: Complete booking flow
                console.log('\n5️⃣ Starting booking process...');
                const bookingId = `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                const passengers = [
                    { name: 'John Smith', age: 35, gender: 'male', coach: '2A' },
                    { name: 'Jane Smith', age: 32, gender: 'female', coach: '2A' }
                ];
                
                // Step 5a: Store passenger details
                console.log('   5a. Storing passenger details...');
                const passengerResponse = await fetch('http://localhost:5000/api/bookings/store-passenger-details', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: loginData.user.email,
                        trainNumber: train.number,
                        bookID: bookingId,
                        passengers: JSON.stringify(passengers)
                    })
                });
                
                const passengerData = await passengerResponse.json();
                if (passengerData.success) {
                    console.log('   ✅ Passenger details stored');
                    
                    // Step 5b: Store booking details
                    console.log('   5b. Storing booking details...');
                    const bookingResponse = await fetch('http://localhost:5000/api/bookings/store-booking-details', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: loginData.user.email,
                            bookID: bookingId,
                            trainNumber: train.number,
                            seatsBooked: passengers.length,
                            coach: '2A'
                        })
                    });
                    
                    const bookingData = await bookingResponse.json();
                    if (bookingData.success) {
                        console.log('   ✅ Booking details stored');
                        
                        // Step 5c: Store user booking
                        console.log('   5c. Storing user booking...');
                        const userBookingResponse = await fetch('http://localhost:5000/api/bookings/store-user-booking', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: loginData.user.email,
                                bookID: bookingId,
                                journeyDate: '2025-12-30'
                            })
                        });
                        
                        const userBookingData = await userBookingResponse.json();
                        if (userBookingData.success) {
                            console.log('   ✅ User booking stored');
                            
                            // Step 6: Retrieve booking details
                            console.log('\n6️⃣ Retrieving booking confirmation...');
                            
                            const fetchPassengerResponse = await fetch(`http://localhost:5000/api/bookings/fetch-passenger-details?bookID=${bookingId}`);
                            const fetchedPassengers = await fetchPassengerResponse.json();
                            
                            const fetchBookingResponse = await fetch(`http://localhost:5000/api/bookings/fetch-booking-fare?bookID=${bookingId}`);
                            const fetchedBooking = await fetchBookingResponse.json();
                            
                            const fetchUserBookingResponse = await fetch(`http://localhost:5000/api/bookings/fetch-user-booking?bookID=${bookingId}`);
                            const fetchedUserBooking = await fetchUserBookingResponse.json();
                            
                            console.log('✅ Booking confirmation generated:');
                            console.log(`   📋 Booking ID: ${bookingId}`);
                            console.log(`   🚂 Train: ${train.number} - ${train.name}`);
                            console.log(`   📅 Journey Date: ${fetchedUserBooking.journeyDate}`);
                            console.log(`   👥 Passengers: ${fetchedPassengers.length}`);
                            fetchedPassengers.forEach((p, i) => {
                                console.log(`      ${i + 1}. ${p.pname}, Age: ${p.page}, Gender: ${p.pgender}, Class: ${p.pclass}`);
                            });
                            console.log(`   💰 Total Fare: ₹${fetchedBooking.fare}`);
                            console.log(`   🎫 Seats Booked: ${fetchedBooking.seatsBooked}`);
                            
                            console.log('\n🎉 Complete reservation flow test SUCCESSFUL!');
                            console.log('\n📱 Frontend Testing Instructions:');
                            console.log('1. Go to http://localhost:5173/reservation');
                            console.log('2. Login with: testuser2@example.com / password123');
                            console.log('3. Search: From "Belagavi" To "Mumbai"');
                            console.log('4. Enter train number: 12307');
                            console.log('5. Select ticket class and add passengers');
                            console.log('6. Complete the booking process');
                            
                        } else {
                            console.log('   ❌ Failed to store user booking:', userBookingData.message);
                        }
                    } else {
                        console.log('   ❌ Failed to store booking details:', bookingData.message);
                    }
                } else {
                    console.log('   ❌ Failed to store passenger details:', passengerData.message);
                }
            } else {
                console.log('❌ Failed to get train details');
            }
        } else {
            console.log('❌ No trains found');
        }
        
    } catch (error) {
        console.error('❌ Error in reservation flow test:', error.message);
    }
}

testCompleteReservationFlow();