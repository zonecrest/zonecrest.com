// Main entry point - show choice popup instead of contact form directly
function showContactForm() {
    document.getElementById('choice-popup').classList.remove('hidden');
}

// Choice popup functions
function closeChoicePopup() {
    document.getElementById('choice-popup').classList.add('hidden');
}

function startOnlineReview() {
    closeChoicePopup();
    
    // Create minimal data for online review
    const reviewData = {
        action: 'online_review',
        timestamp: new Date().toISOString(),
        page: window.location.href
    };
    
    // Send to online review webhook
    sendWebhookData('https://zonecrest.app.n8n.cloud/webhook/review', reviewData, 'online review');
}

function arrangeConsultation() {
    closeChoicePopup();
    document.getElementById('contact-form').classList.remove('hidden');
}

// Contact form functions
function closeContactForm() {
    document.getElementById('contact-form').classList.add('hidden');
}

// Generic webhook sender
async function sendWebhookData(webhookUrl, data, actionType) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            if (actionType === 'online review') {
                alert('Great! Click (OK) to be redirected to the online review page.');
                // Optional: redirect to external review platform
                window.open('https://jeweled-brownie-6c3.notion.site/1b673dcb8ea680aa928cffd9e57236de', '_blank');
            } else {
                alert('Thank you! I\'ll be in touch shortly.');
            }
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Sorry, there was an issue with your ${actionType} request. Please try again or contact me directly.`);
    }
}

// Handle form submission for consultation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('webhook-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add metadata
        data.action = 'consultation_request';
        data.timestamp = new Date().toISOString();
        data.page = window.location.href;
        
        await sendWebhookData('https://zonecrest.app.n8n.cloud/webhook/consultation', data, 'consultation');
        
        if (data) { // If successful
            closeContactForm();
            form.reset();
        }
    });
    
    // Close forms when clicking outside
    document.getElementById('choice-popup').addEventListener('click', function(e) {
        if (e.target === this) {
            closeChoicePopup();
        }
    });
    
    document.getElementById('contact-form').addEventListener('click', function(e) {
        if (e.target === this) {
            closeContactForm();
        }
    });
    
    // Close forms with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeChoicePopup();
            closeContactForm();
        }
    });
});