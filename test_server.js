async function checkServer() {
    try {
        const res = await fetch('http://localhost:4001');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Content length:', text.length);
    } catch (e) {
        console.error('Error connecting to server:', e.message);
    }
}
checkServer();
