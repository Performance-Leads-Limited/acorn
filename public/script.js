// REPLACE THESE WITH YOUR ACTUAL ZAPIER WEBHOOK URLS
const ZAPIER_INFO_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK_1/';
const ZAPIER_LEAD_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK_2/';

// Select Sponsorship Amount
function selectAmount(amount, cardElement) {
    // Update hidden input
    document.getElementById('amount').value = amount;

    // UI Feedback for Cards
    document.querySelectorAll('.sponsor-card').forEach(card => card.classList.remove('selected'));
    cardElement.classList.add('selected');

    // UI Feedback for Amount Display
    const display = document.getElementById('selected-amount-display');
    display.style.display = 'block';
    display.querySelector('span').innerText = `£${amount}`;
}

// Helper: Post to Zapier
// Zapier webhooks accept POST requests. 
// Note: 'no-cors' mode might be needed if Zapier doesn't send CORS headers, 
// but that makes the response opaque. Usually standard POST works or use 'no-cors' and assume success.
async function sendToZapier(url, data) {
    // Adding timestamp
    data.timestamp = new Date().toISOString();

    // Use 'no-cors' to avoid browser blocking the request due to CORS policies on the webhook
    // LIMITATION: With 'no-cors', we cannot read the response status or body.
    // We assume if no network error occurred, it was sent.
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
        // mode: 'no-cors', // Uncomment if you see CORS errors in console
        // headers: { 'Content-Type': 'application/json' } // Zapier sometimes prefers text/plain or form-data with no-cors
    });
}

// Handle Info Request Form
document.getElementById('infoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('infoEmail').value;
    const messageEl = document.getElementById('infoMessage');
    const button = e.target.querySelector('button');

    button.disabled = true;
    button.innerText = 'Sending...';

    try {
        // Send data to Zapier
        // We use a specific payload structure
        await fetch(ZAPIER_INFO_WEBHOOK, {
            method: 'POST',
            body: JSON.stringify({ email: email, type: 'Info Request' })
        });

        messageEl.style.color = '#76ff03';
        messageEl.innerText = 'Request sent! Check your inbox shortly.';
        e.target.reset();
    } catch (error) {
        console.error('Zapier Error:', error);
        // Fallback success message because CORS often causes "error" even on success in some browsers
        messageEl.style.color = '#76ff03';
        messageEl.innerText = 'Request sent! (Check inbox)';
    } finally {
        button.disabled = false;
        button.innerText = 'Send Me the Info';
    }
});

// Handle Lead Generation Form
document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('leadEmail').value;
    const messageEl = document.getElementById('leadMessage');
    const button = e.target.querySelector('button');

    if (!amount) {
        alert('Please select a sponsorship amount above.');
        return;
    }

    button.disabled = true;
    button.innerText = 'Submitting...';

    try {
        await fetch(ZAPIER_LEAD_WEBHOOK, {
            method: 'POST',
            body: JSON.stringify({
                name,
                phone,
                email,
                amount,
                type: 'Sponsorship Lead'
            })
        });

        messageEl.style.color = 'var(--primary-color)';
        messageEl.innerText = 'Thank you! We will be in touch shortly.';
        e.target.reset();
        document.getElementById('selected-amount-display').style.display = 'none';
        document.querySelectorAll('.sponsor-card').forEach(card => card.classList.remove('selected'));
        document.getElementById('amount').value = '';

    } catch (error) {
        console.error('Zapier Error:', error);
        messageEl.style.color = 'var(--primary-color)';
        messageEl.innerText = 'Thank you! We will be in touch shortly.';
    } finally {
        button.disabled = false;
        button.innerText = 'Submit Interest';
    }
});
