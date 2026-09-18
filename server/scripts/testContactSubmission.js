async function test() {
  console.log('Sending contact POST to http://localhost:5173/api/contact ...');
  const payload = {
    name: 'Steve Rogers',
    email: 'steverogers302006@gmail.com',
    subject: 'Project Inquiry & Internship Discussion',
    message: 'Hello Akilesh, I am contacting you regarding software development and systems engineering opportunities. Looking forward to connecting!',
  };

  const res = await fetch('http://localhost:5173/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', data);

  if (res.status === 200 && data.success) {
    console.log('✅ Contact form submitted successfully through Vite proxy to local backend and Gmail SMTP!');
  } else {
    throw new Error('Submission failed: ' + JSON.stringify(data));
  }
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
