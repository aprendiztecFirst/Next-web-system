const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

try {
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const classCount = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
    const enrollmentCount = db.prepare('SELECT COUNT(*) as count FROM class_enrollments').get().count;

    console.log('Students:', studentCount);
    console.log('Classes:', classCount);
    console.log('Enrollments:', enrollmentCount);

    const level = "iLearn 01";
    const studentsInLevel = db.prepare(`
        SELECT s.full_name 
        FROM students s
        JOIN class_enrollments ce ON s.id = ce.student_id
        JOIN classes c ON ce.class_id = c.id
        WHERE c.level = ?
    `).all(level);

    console.log(`\nStudents in ${level}:`, studentsInLevel.length);
    studentsInLevel.slice(0, 5).forEach(s => console.log(' -', s.full_name));

} catch (e) {
    console.error('Error:', e.message);
} finally {
    db.close();
}
