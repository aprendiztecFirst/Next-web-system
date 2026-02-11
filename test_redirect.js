async function checkRedirect() {
    try {
        const res = await fetch('http://127.0.0.1:4000/secretary/students');
        console.log('Status:', res.status);
        console.log('Final URL:', res.url);
        const text = await res.text();
        console.log('Title:', text.match(/<title>(.*?)<\/title>/)?.[1]);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
checkRedirect();
