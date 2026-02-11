async function testRoot() {
    try {
        const res = await fetch('http://localhost:4000/');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Includes Header?', text.includes('Next Idiomas'));
        console.log('Content Snippet:', text.substring(0, 500));
    } catch (e) {
        console.error('Error:', e.message);
    }
}
testRoot();
