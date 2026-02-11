async function testLogin() {
    console.log('Testing login for the new user...');
    try {
        const response = await fetch('http://localhost:4001/api/auth/callback/credentials-signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email: 'heysolarenergize@gmail.com',
                password: '123456',
                redirect: 'false',
                json: 'true',
            }),
        });

        console.log('Status:', response.status);
        console.log('Final URL:', response.url);
        if (response.url.includes('/account/signin?error=')) {
            console.log('Login FAILED.');
        } else if (response.url.includes('/onboarding') || response.url.includes('/dashboard')) {
            console.log('Login SUCCESSFUL!');
        } else {
            console.log('Result ambiguous. Check Final URL.');
        }
    } catch (err) {
        console.error('Fetch failed:', err);
    }
}

testLogin();
