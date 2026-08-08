// System Health Check - Comprehensive test of all Route Rover components
import fetch from 'node-fetch';

async function systemHealthCheck() {
    console.log('🏥 Route Rover System Health Check\n');
    console.log('=' .repeat(50));
    
    const results = {
        backend: false,
        database: false,
        authentication: false,
        trainSearch: false,
        booking: false,
        ai: false,
        realtime: false
    };
    
    try {
        // 1. Backend Server Health
        console.log('\n🔧 1. Backend Server Health');
        try {
            const healthResponse = await fetch('http://localhost:5000/api/trains/all', {
                timeout: 5000
            });
            if (healthResponse.ok) {
                console.log('✅ Backend server is running');
                results.backend = true;
            } else {
                console.log('❌ Backend server responded with error:', healthResponse.status);
            }
        } catch (error) {
            console.log('❌ Backend server is not accessible:', error.message);
        }
        
        // 2. Database Connectivity
        console.log('\n💾 2. Database Connectivity');
        try {
            const dbResponse = await fetch('http://localhost:5000/api/trains/all');
            const dbData = await dbResponse.json();
            if (dbData.success && Array.isArray(dbData.data)) {
                console.log(`✅ Database connected - ${dbData.data.length} trains available`);
                results.database = true;
                
                // Show sample trains
                dbData.data.slice(0, 3).forEach(train => {
                    console.log(`   🚂 ${train.number} - ${train.name} (${train.source} → ${train.destination})`);
                });
            } else {
                console.log('❌ Database query failed');
            }
        } catch (error) {
            console.log('❌ Database connectivity error:', error.message);
        }
        
        // 3. Authentication System
        console.log('\n🔐 3. Authentication System');
        try {
            const authResponse = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'testuser2@example.com',
                    password: 'password123'
                })
            });
            const authData = await authResponse.json();
            if (authData.message === 'Login successful') {
                console.log('✅ Authentication working');
                console.log(`   User: ${authData.user.email}`);
                console.log(`   Token: ${authData.token ? 'Generated' : 'Missing'}`);
                results.authentication = true;
            } else {
                console.log('❌ Authentication failed:', authData.message);
            }
        } catch (error) {
            console.log('❌ Authentication error:', error.message);
        }
        
        // 4. Train Search System
        console.log('\n🔍 4. Train Search System');
        try {
            // Test search by station
            const stationSearchResponse = await fetch('http://localhost:5000/api/trains?from=Belagavi&to=Mumbai&searchOption=SEARCH%20by%20station');
            const stationSearchData = await stationSearchResponse.json();
            
            // Test search by number
            const numberSearchResponse = await fetch('http://localhost:5000/api/trains?number=12307&searchOption=SEARCH%20by%20number');
            const numberSearchData = await numberSearchResponse.json();
            
            if (stationSearchData.success && numberSearchData.success) {
                console.log('✅ Train search working');
                console.log(`   Station search: ${stationSearchData.data.length} results`);
                console.log(`   Number search: ${numberSearchData.data.length} results`);
                results.trainSearch = true;
            } else {
                console.log('❌ Train search failed');
            }
        } catch (error) {
            console.log('❌ Train search error:', error.message);
        }
        
        // 5. Booking System
        console.log('\n🎫 5. Booking System');
        try {
            const bookingId = `HEALTH-CHECK-${Date.now()}`;
            const testEmail = 'testuser2@example.com';
            
            // Test all booking endpoints
            const passengerResponse = await fetch('http://localhost:5000/api/bookings/store-passenger-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    trainNumber: '12307',
                    bookID: bookingId,
                    passengers: JSON.stringify([{ name: 'Health Check', age: 30, gender: 'male', coach: '2A' }])
                })
            });
            
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
                console.log('✅ Booking system working');
                console.log(`   Test booking ID: ${bookingId}`);
                results.booking = true;
                
                // Test retrieval
                const retrievalResponse = await fetch(`http://localhost:5000/api/bookings/fetch-passenger-details?bookID=${bookingId}`);
                const retrievalData = await retrievalResponse.json();
                if (Array.isArray(retrievalData) && retrievalData.length > 0) {
                    console.log('✅ Booking retrieval working');
                }
            } else {
                console.log('❌ Booking system failed');
                console.log(`   Passenger: ${passengerData.success}`);
                console.log(`   Booking: ${bookingData.success}`);
                console.log(`   User Booking: ${userBookingData.success}`);
            }
        } catch (error) {
            console.log('❌ Booking system error:', error.message);
        }
        
        // 6. AI System
        console.log('\n🤖 6. AI System');
        try {
            const aiGuidanceResponse = await fetch('http://localhost:5000/api/ai/location-guidance?location=Mumbai&trainNumber=12307');
            const aiInsightsResponse = await fetch('http://localhost:5000/api/ai/journey-insights?trainNumber=12307');
            const aiNotificationsResponse = await fetch('http://localhost:5000/api/ai/notifications?trainNumber=12307');
            
            const guidanceData = await aiGuidanceResponse.json();
            const insightsData = await aiInsightsResponse.json();
            const notificationsData = await aiNotificationsResponse.json();
            
            if (guidanceData.success && insightsData.success && notificationsData.success) {
                console.log('✅ AI system working');
                console.log(`   Guidance: Available`);
                console.log(`   Insights: Available`);
                console.log(`   Notifications: ${notificationsData.notifications?.length || 0} active`);
                results.ai = true;
            } else {
                console.log('❌ AI system partially working');
                console.log(`   Guidance: ${guidanceData.success}`);
                console.log(`   Insights: ${insightsData.success}`);
                console.log(`   Notifications: ${notificationsData.success}`);
            }
        } catch (error) {
            console.log('❌ AI system error:', error.message);
        }
        
        // 7. Real-time Tracking
        console.log('\n📍 7. Real-time Tracking');
        try {
            const trackingResponse = await fetch('http://localhost:5000/api/trains/realtime/12307');
            const trackingData = await trackingResponse.json();
            
            if (trackingData.success) {
                console.log('✅ Real-time tracking working');
                console.log(`   Train: ${trackingData.data?.trainName || trackingData.train?.name || 'Unknown'}`);
                console.log(`   Location: ${trackingData.data?.currentLocation || 'Unknown'}`);
                console.log(`   Status: ${trackingData.data?.status || 'Unknown'}`);
                console.log(`   Progress: ${trackingData.data?.progressPercentage || 0}%`);
                results.realtime = true;
            } else {
                console.log('❌ Real-time tracking failed:', trackingData.message);
            }
        } catch (error) {
            console.log('❌ Real-time tracking error:', error.message);
        }
        
        // Summary
        console.log('\n' + '=' .repeat(50));
        console.log('📊 SYSTEM HEALTH SUMMARY');
        console.log('=' .repeat(50));
        
        const totalTests = Object.keys(results).length;
        const passedTests = Object.values(results).filter(Boolean).length;
        const healthPercentage = Math.round((passedTests / totalTests) * 100);
        
        console.log(`\n🏥 Overall Health: ${healthPercentage}% (${passedTests}/${totalTests} systems operational)\n`);
        
        Object.entries(results).forEach(([system, status]) => {
            const icon = status ? '✅' : '❌';
            const systemName = system.charAt(0).toUpperCase() + system.slice(1);
            console.log(`${icon} ${systemName}: ${status ? 'OPERATIONAL' : 'FAILED'}`);
        });
        
        if (healthPercentage === 100) {
            console.log('\n🎉 ALL SYSTEMS OPERATIONAL! Route Rover is ready for use.');
            console.log('\n🌐 Access the application at:');
            console.log('   Frontend: http://localhost:5173');
            console.log('   Backend:  http://localhost:5000');
            console.log('\n📋 Test the complete system:');
            console.log('   1. Open http://localhost:5173');
            console.log('   2. Login with: testuser2@example.com / password123');
            console.log('   3. Search trains: Belagavi → Mumbai');
            console.log('   4. Book train: 12307');
            console.log('   5. Track train: Real-time tracking page');
            console.log('   6. Use AI: AI Assistant page');
        } else if (healthPercentage >= 80) {
            console.log('\n⚠️  MOSTLY OPERATIONAL with minor issues.');
            console.log('   The system should work for most use cases.');
        } else if (healthPercentage >= 60) {
            console.log('\n🔧 PARTIALLY OPERATIONAL - some features may not work.');
            console.log('   Please check failed systems above.');
        } else {
            console.log('\n🚨 SYSTEM CRITICAL - multiple failures detected.');
            console.log('   Please restart servers and check configuration.');
        }
        
        console.log('\n📝 For detailed testing, open: test-complete-system.html in your browser');
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
    }
}

systemHealthCheck();