# js-mail-sender-appsscript

Here is the JavaScript and Apps script code for your contact form that will send an email using Google Apps Script. This is a great way to handle form submissions without needing a traditional backend server.

Here's the plan:

- 1. Apps Script (Server-side): This script will receive the form data and send the email. You'll deploy it as a web app.
- 2. HTML Form (Client-side JavaScript): Your existing contact form's HTML will remain mostly the same, but we'll add JavaScript to capture the form data and send it to the Apps Script web app.

### 1. Google Apps Script Code (Code.gs)
First, you need to set up the Apps Script.

Steps:

1. Go to Google Drive.
2. Click + New > More > Google Apps Script.
3. Name your project (e.g., "ContactFormMailer").
4. Delete any default code in the Code.gs file.
5. Paste the following code into Code.gs:

```
// Function to handle GET requests (e.g., when the web app is first opened)
function doGet(e) {
  return HtmlService.createHtmlOutput("Please submit the form via POST.");
}

// Function to handle POST requests (when your form sends data)
function doPost(e) {
  var data = e.parameter; // Get all form data as an object

  // --- Configuration ---
  var recipientEmail = "your_email@example.com"; // <-- IMPORTANT: Change this to your email address
  var subject = "New Contact Form Submission";
  // --- End Configuration ---

  var emailBody = "New contact form submission:\n\n";

  // Iterate over all received data and build the email body
  for (var fieldName in data) {
    if (data.hasOwnProperty(fieldName)) {
      var fieldValue = data[fieldName];
      // Format field names nicely for the email
      var formattedFieldName = fieldName.replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, function(str){ return str.toUpperCase(); });

      emailBody += formattedFieldName + ": " + fieldValue + "\n";
    }
  }

  try {
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: emailBody
    });
    // Return a success message to the client
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Email sent successfully!" }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return an error message to the client
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Failed to send email: " + error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```


> - IMPORTANT: Replace "your_email@example.com" with the actual email address where you want to receive the form submissions.

### Deployment Steps for Apps Script:

1. In the Apps Script editor, click Deploy > New deployment.
2. For "Select type," choose Web app.
3. Description: (Optional) "Contact Form Handler"
4. Execute as: "Me" (your Google account)
5. Who has access: "Anyone" (so your form can send data without authentication)
6. Click Deploy.
7. Google will ask for permissions. Review them and click Allow.
8. Copy the "Web app URL". This is the URL you'll use in your JavaScript. Keep it safe!


### 2. JavaScript for Your Contact Form (script.js)
Now, let's create a new JavaScript file (script.js) that will handle the form submission and send the data to your Apps Script web app.

Steps:

1. Create a new file named script.js in the same directory as your index.html and style.css files.
2. Paste the following code into script.js:


```
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
```


> - IMPORTANT: Replace 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE' with the "Web app URL" you copied during the Apps Script deployment!


### 3. Update Your HTML (index.html)
- Finally, you need to link this script.js file to your index.html.

- Add this line just before the closing </body> tag in your index.html:
```
<script src="script.js"></script>
</body>
</html>
```


### How it all works:
- User fills out form: On your website, a user fills out the contact form.
- JavaScript Intercepts: When the user clicks "Send Message," the JavaScript in script.js intercepts the submission (event.preventDefault()).
- Data Collection: new FormData(contactForm) collects all the input values from your form.
- Fetch API to Apps Script: The JavaScript uses the fetch API to send a POST request with the formData to your deployed Google Apps Script web app URL.
- Apps Script Receives: Your doPost(e) function in Google Apps Script receives this data.
- Email Sent: Apps Script uses MailApp.sendEmail() to send an email to your specified recipientEmail with all the form details.
- Response Back: Apps Script sends a success or failure JSON response back to your JavaScript.
- User Feedback: The JavaScript then displays an alert to the user based on the success or failure of the email sending.
- This setup provides a robust and serverless way to handle your contact form submissions! If you run into any issues, double-check that your Apps Script URL is correct and that you've granted the necessary permissions during deployment.
