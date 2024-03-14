document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('contact-form').addEventListener('submit', function(event) {
		event.preventDefault(); // Prevent default form submission
		
		// Get form data
		var fullName = document.getElementById('full_name').value;
		var emailAddress = document.getElementById('email_address').value;
		var message = document.getElementById('message').value;
		
		// Construct API URL with form data
		var apiUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScvpwieaOEQGIZ_emPH7hnI6fwW9D7AeIvu_zmmhJSt5nnhFA/formResponse';
		apiUrl += '?usp=pp_url';
		apiUrl += '&entry.1537159743=' + encodeURIComponent(fullName);
		apiUrl += '&entry.1892208282=' + encodeURIComponent(emailAddress);
		apiUrl += '&entry.1827350325=' + encodeURIComponent(message);
		
		// Make API request
		fetch(apiUrl, { method: 'POST' })
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				alert('Form submitted successfully!');
				document.getElementById('contact-form').reset(); // Reset form after successful submission
			})
			.catch(function(error) {
				console.error('There was a problem with the fetch operation:', error);
				alert('Error submitting form. Please try again later.');
			});
	});
});