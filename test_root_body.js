async function testRoot() {
    try {
        const res = await fetch('http://localhost:4000/');
        const text = await res.text();
        console.log('Content Snippet (Body):', text.substring(text.indexOf('<body'), text.indexOf('<body') + 2000));
    } catch (e) {
        console.error('Error:', e.message);
    }
}
testRoot();
