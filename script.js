document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    // IMPORTANT: Replace this with the Web App URL you copied from Google Apps Script deployment
    const appsScriptURL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'; // <--- PASTE YOUR URL HERE

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const submitButton = contactForm.querySelector('.submit-btn');
        submitButton.disabled = true; // Disable button to prevent multiple submissions
        submitButton.textContent = 'Sending...'; // Change button text

        const formData = new FormData(contactForm); // Get all form data

        try {
            const response = await fetch(appsScriptURL, {
                method: 'POST',
                body: formData, // Send form data directly
                // headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // FormData handles this automatically
            });

            const result = await response.json(); // Parse the JSON response from Apps Script

            if (result.success) {
                alert('Message sent successfully! We will get back to you soon.');
                contactForm.reset(); // Clear the form fields
            } else {
                alert('Failed to send message: ' + result.message + '\nPlease try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please check your internet connection and try again.');
        } finally {
            submitButton.disabled = false; // Re-enable the button
            submitButton.textContent = 'Send Message'; // Reset button text
        }
    });
});