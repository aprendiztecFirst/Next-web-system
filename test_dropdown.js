async function checkDropdown() {
    try {
        const res = await fetch('http://127.0.0.1:4000/secretary/classes');
        const text = await res.text();
        const options = [
            "iLearn 01",
            "Top Notch Fundamentals A",
            "Top Notch 3B"
        ];
        console.log('Status:', res.status);
        options.forEach(opt => {
            console.log(`Contains "${opt}"?`, text.includes(opt));
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}
checkDropdown();
