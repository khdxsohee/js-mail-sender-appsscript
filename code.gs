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