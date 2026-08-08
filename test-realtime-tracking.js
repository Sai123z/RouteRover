// Test script for real-time train tracking API
import fetch from 'node-fetch';

async function testRealtimeTracking() {
    try {
        console.log('🚂 Testing Real-time Train Tracking API...\n');
        
        const trainNumbers = ['12301', '12302', '12309', '12307'];
        
        for (const trainNumber of trainNumbers) {
            console.log(`📍 Tracking Train ${trainNumber}:`);
            
            const response = await fetch(`http://localhost:5000/api/trains/realtime/${trainNumber}`);
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log(`✅ ${data.train.name}`);
                console.log(`   📍 Current Position: ${data.realtime.currentPosition}`);
                console.log(`   🚦 Status: ${data.realtime.status}`);
                console.log(`   ⏰ Delay: ${data.realtime.delay}`);
                console.log(`   🎯 Next Station: ${data.realtime.nextStation}`);
                console.log(`   🕐 ETA: ${data.realtime.estimatedArrival}`);
                console.log(`   🏃 Speed: ${data.realtime.speed}`);
                console.log(`   📊 Progress: ${data.realtime.route ? data.realtime.route.completedStations + '/' + data.realtime.route.totalStations : 'N/A'} stations\n`);
            } else {
                console.log(`❌ Error tracking train ${trainNumber}:`, data.message);
            }
        }
        
        console.log('🎉 Real-time tracking test completed!');
        
    } catch (error) {
        console.error('❌ Error testing real-time tracking:', error.message);
    }
}

testRealtimeTracking();