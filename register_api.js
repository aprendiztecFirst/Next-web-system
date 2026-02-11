async function register() {
    console.log('Calling registration API...');
    try {
        const response = await fetch('http://localhost:4000/api/auth/callback/credentials-signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email: 'heysolarenergize@gmail.com',
                password: '123456',
                name: 'Aluno Antigravity',
                redirect: 'false',
                json: 'true',
            }),
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response:', text);

        try {
            const data = JSON.parse(text);
            if (data.url && data.url.includes('error=')) {
                console.error('Registration failed with error in URL:', data.url);
            } else {
                console.log('Registration likely successful or redirected.');
            }
        } catch (e) {
            console.log('Response is not JSON or could not be parsed.');
        }
    } catch (err) {
        console.error('Fetch failed:', err);
    }
}

register();
