async function checkServer(port) {
    try {
        const res = await fetch(`http://localhost:${port}`);
        console.log(`Port ${port} - Status:`, res.status);
        return true;
    } catch (e) {
        console.log(`Port ${port} - Error:`, e.message);
        return false;
    }
}
async function run() {
    await checkServer(4000);
    await checkServer(4001);
}
run();
