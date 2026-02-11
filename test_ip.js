async function checkServer() {
    try {
        const res = await fetch('http://127.0.0.1:4000');
        console.log('Status:', res.status);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
checkServer();
