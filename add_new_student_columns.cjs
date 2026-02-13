const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

try {
    console.log('🔄 Running migration to add new columns to students table...');

    const columns = [
        { name: 'parent_name', type: 'TEXT' },
        { name: 'cpf', type: 'TEXT' },
        { name: 'rg', type: 'TEXT' },
        { name: 'specific_needs', type: 'TEXT' }
    ];

    for (const col of columns) {
        try {
            db.exec(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✅ Added column: ${col.name}`);
        } catch (err) {
            if (err.message.includes('duplicate column name')) {
                console.log(`ℹ️ Column ${col.name} already exists, skipping.`);
            } else {
                throw err;
            }
        }
    }

    console.log('🎉 Migration completed successfully!');
} catch (err) {
    console.error('❌ Migration failed:', err.message);
} finally {
    db.close();
}
