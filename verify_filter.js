async function verifyFilter() {
    try {
        const level = "iLearn 01";
        const res = await fetch(`http://127.0.0.1:4000/api/students?level=${encodeURIComponent(level)}`);
        const data = await res.json();
        console.log('Status:', res.status);
        console.log(`Students in ${level}:`, data.students?.length);
        if (data.students?.length > 0) {
            console.log('First student:', data.students[0].full_name);
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}
verifyFilter();
