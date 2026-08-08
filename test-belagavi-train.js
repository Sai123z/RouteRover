// Test script for the new Belagavi Special Express train
import fetch from 'node-fetch';

async function testBelagaviTrain() {
    try {
        console.log('🚂 Testing Belagavi Special Express (12307)...\n');
        
        // Test regular train search
        console.log('📋 Testing train search:');
        const searchResponse = await fetch('http://localhost:5000/api/trains/all');
        const searchData = await searchResponse.json();
        
        if (searchData.success) {
            const belagaviTrain = searchData.data.find(train => train.number === '12307');
            if (belagaviTrain) {
                console.log('✅ Found in train list:');
                console.log(`   Name: ${belagaviTrain.name}`);
                console.log(`   Route: ${belagaviTrain.source} → ${belagaviTrain.destination}`);
                console.log(`   Departure: ${belagaviTrain.departure}`);
                console.log(`   Arrival: ${belagaviTrain.arrival}`);
                console.log(`   Fare: ₹${belagaviTrain.fare}`);
            } else {
                console.log('❌ Train not found in search results');
            }
        }
        
        console.log('\n📍 Testing real-time tracking:');
        const trackingResponse = await fetch('http://localhost:5000/api/trains/realtime/12307');
        const trackingData = await trackingResponse.json();
        
        if (trackingResponse.ok && trackingData.success) {
            console.log('✅ Real-time tracking working:');
            console.log(`   Train: ${trackingData.train.name}`);
            console.log(`   Route: ${trackingData.train.origin} → ${trackingData.train.destination}`);
            console.log(`   Current Position: ${trackingData.realtime.currentPosition}`);
            console.log(`   Status: ${trackingData.realtime.status}`);
            console.log(`   Delay: ${trackingData.realtime.delay}`);
            console.log(`   Next Station: ${trackingData.realtime.nextStation}`);
            console.log(`   Speed: ${trackingData.realtime.speed}`);
            console.log(`   Progress: ${trackingData.route.completedStations}/${trackingData.route.totalStations} stations`);
            
            console.log('\n🛤️ Route Details:');
            console.log(`   Origin: ${trackingData.train.origin}`);
            for (let i = 1; i <= 6; i++) {
                const stop = trackingData.route[`stop${i}`];
                if (stop) {
                    const isCurrent = stop === trackingData.realtime.currentPosition;
                    console.log(`   Stop ${i}: ${stop}${isCurrent ? ' 📍 (Current)' : ''}`);
                }
            }
            console.log(`   Destination: ${trackingData.train.destination}`);
        } else {
            console.log('❌ Real-time tracking failed:', trackingData.message);
        }
        
        console.log('\n🎉 Belagavi Special Express test completed!');
        
    } catch (error) {
        console.error('❌ Error testing Belagavi train:', error.message);
    }
}

testBelagaviTrain();