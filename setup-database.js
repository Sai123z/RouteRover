import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        
        // Connect to MySQL server without specifying the database
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Empty password - change if you have a password
            multipleStatements: true
        });

        console.log('Connected to MySQL successfully!');

        // Read and execute the SQL file
        const sqlFile = fs.readFileSync(path.join(__dirname, 'complete_database_setup.sql'), 'utf8');
        
        console.log('Executing database setup...');
        await connection.query(sqlFile);
        
        console.log('✅ Database setup completed successfully!');
        console.log('✅ Database "user_auth" created');
        console.log('✅ All tables created');
        console.log('✅ Sample data inserted');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 If you have a MySQL password, please update the password in this script or server/config/db.js');
        }
        
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();