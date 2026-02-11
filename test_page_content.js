async function testPage() {
    try {
        const res = await fetch('http://localhost:4000/secretary/students');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Content Snippet:', text.substring(0, 500));
        console.log('Includes Header?', text.includes('Next Idiomas'));
    } catch (e) {
        console.error('Error:', e.message);
    }
}
testPage();
