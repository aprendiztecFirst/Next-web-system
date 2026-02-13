const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
const crypto = require('crypto');

function setup() {
    console.log('🔄 Initializing data tables...');

    db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            birth_date TEXT,
            address TEXT,
            parent_name TEXT,
            cpf TEXT,
            rg TEXT,
            specific_needs TEXT,
            active INTEGER DEFAULT 1,
            enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        );

        CREATE TABLE IF NOT EXISTS classes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            level TEXT NOT NULL,
            language TEXT NOT NULL,
            schedule TEXT,
            teacher_id TEXT,
            active INTEGER DEFAULT 1,
            max_students INTEGER DEFAULT 15
        );

        CREATE TABLE IF NOT EXISTS class_enrollments (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
            enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(student_id, class_id)
        );
    `);

    // Insert Mock Classes
    const levels = [
        "iLearn 01", "iLearn 02", "iLearn 03",
        "Top Notch Fundamentals A", "Top Notch Fundamentals B",
        "Top Notch 1A", "Top Notch 1B", "Top Notch 2A", "Top Notch 2B", "Top Notch 3A", "Top Notch 3B"
    ];

    const insertClass = db.prepare('INSERT OR IGNORE INTO classes (id, name, level, language, schedule, active) VALUES (?, ?, ?, ?, ?, 1)');
    const classIds = [];

    levels.forEach(level => {
        const id = crypto.randomUUID();
        insertClass.run(id, `${level} - Turma A`, level, level.startsWith('iLearn') ? 'Inglês' : 'Inglês', 'Seg/Qua 19:00');
        classIds.push({ id, level });
    });

    // Insert Mock Students
    const insertStudent = db.prepare('INSERT OR IGNORE INTO students (id, full_name, email, active) VALUES (?, ?, ?, 1)');
    const studentIds = [];

    for (let i = 1; i <= 20; i++) {
        const id = crypto.randomUUID();
        insertStudent.run(id, `Aluno Exemplo ${i}`, `aluno${i}@example.com`);
        studentIds.push(id);
    }

    // Enroll Students randomly
    const insertEnrollment = db.prepare('INSERT OR IGNORE INTO class_enrollments (id, student_id, class_id) VALUES (?, ?, ?)');

    studentIds.forEach((sid, index) => {
        // Assign each student to at least one class
        const classInfo = classIds[index % classIds.length];
        insertEnrollment.run(crypto.randomUUID(), sid, classInfo.id);
    });

    console.log('✅ Tables initialized and mock data inserted.');
}

setup();
db.close();
