async function checkNav() {
    try {
        const res = await fetch('http://127.0.0.1:4000/secretary/students');
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Contains "Alunos"?', text.includes('Alunos'));
        console.log('Contains "Turmas"?', text.includes('Turmas'));
        console.log('Contains "Horários"?', text.includes('Horários'));
    } catch (e) {
        console.error('Error:', e.message);
    }
}
checkNav();
