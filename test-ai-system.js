// Comprehensive test for the AI system
import fetch from 'node-fetch';

async function testAISystem() {
    try {
        console.log('🤖 Testing AI System...\n');
        
        // Test 1: AI Location Guidance
        console.log('1️⃣ Testing AI Location Guidance:');
        const guidanceResponse = await fetch('http://localhost:5000/api/ai/location-guidance?trainNumber=12307&userLocation=Belagavi');
        const guidanceData = await guidanceResponse.json();
        
        if (guidanceData.success) {
            console.log('✅ AI Guidance working');
            console.log(`   Train: ${guidanceData.train.name} (${guidanceData.train.number})`);
            console.log(`   Primary Message: ${guidanceData.aiGuidance.primaryMessage}`);
            console.log(`   Time Context: ${guidanceData.aiGuidance.timeContext.period} - ${guidanceData.aiGuidance.timeContext.message}`);
            console.log(`   Recommendations: ${guidanceData.aiGuidance.recommendations.length} AI recommendations`);
            console.log(`   Smart Notifications: ${guidanceData.aiGuidance.smartNotifications.length} notifications`);
        } else {
            console.log('❌ AI Guidance failed:', guidanceData.message);
        }
        
        // Test 2: Journey Insights
        console.log('\n2️⃣ Testing Journey Insights:');
        const insightsResponse = await fetch('http://localhost:5000/api/ai/journey-insights?trainNumber=12307&fromStation=Belagavi&toStation=Mumbai');
        const insightsData = await insightsResponse.json();
        
        if (insightsData.success) {
            console.log('✅ Journey Insights working');
            console.log(`   Journey Duration: ${insightsData.insights.journeyAnalysis.estimatedDuration}`);
            console.log(`   On-time Performance: ${insightsData.insights.aiPredictions.onTimePerformance}`);
            console.log(`   Smart Tips: ${insightsData.insights.smartTips.length} AI-generated tips`);
            console.log(`   Alternative Options: ${insightsData.insights.alternativeOptions.length} alternatives`);
        } else {
            console.log('❌ Journey Insights failed:', insightsData.message);
        }
        
        // Test 3: Real-time Notifications
        console.log('\n3️⃣ Testing Real-time Notifications:');
        const notificationsResponse = await fetch('http://localhost:5000/api/ai/notifications?email=test@example.com&trainNumber=12307');
        const notificationsData = await notificationsResponse.json();
        
        if (notificationsData.success) {
            console.log('✅ AI Notifications working');
            console.log(`   Notifications: ${notificationsData.notifications.length} smart alerts`);
            notificationsData.notifications.forEach((notif, index) => {
                console.log(`     ${index + 1}. [${notif.priority.toUpperCase()}] ${notif.title}`);
                console.log(`        ${notif.message}`);
            });
        } else {
            console.log('❌ AI Notifications failed:', notificationsData.message);
        }
        
        // Test 4: Multiple Train Analysis
        console.log('\n4️⃣ Testing Multiple Train Analysis:');
        const trainNumbers = ['12301', '12302', '12307', '12309'];
        
        for (const trainNum of trainNumbers) {
            const response = await fetch(`http://localhost:5000/api/ai/location-guidance?trainNumber=${trainNum}`);
            const data = await response.json();
            
            if (data.success) {
                console.log(`   ✅ ${trainNum}: ${data.train.name}`);
                console.log(`      Current Status: ${data.aiGuidance.primaryMessage}`);
                console.log(`      AI Confidence: ${data.aiGuidance.recommendations[0]?.confidence || 'N/A'}%`);
            } else {
                console.log(`   ❌ ${trainNum}: Failed to get AI guidance`);
            }
        }
        
        console.log('\n🎉 AI System test completed!');
        console.log('\n📱 Frontend Testing Instructions:');
        console.log('1. Go to http://localhost:5173/ai-assistant');
        console.log('2. Enter train number: 12307');
        console.log('3. Click "Get AI Guidance"');
        console.log('4. Explore all three tabs: AI Guidance, Smart Alerts, Journey Insights');
        console.log('5. Check the notification bell in the navbar (when logged in)');
        
    } catch (error) {
        console.error('❌ Error testing AI system:', error.message);
    }
}

testAISystem();