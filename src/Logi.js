
// Load the Google Sheets API library
gapi.load('client', start);

// Define the Google Sheets API configuration
const CLIENT_ID = '210564638215-p90r8gark26tv52n8aebi3hpu8c0fpeu.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB8OEsDBZXydo8driIGYblEUoBII0tkP7g';
const SPREADSHEET_ID = '1OMgOXj-w4ZMXgFDnWJBOF7xhEnWvx1kDR-1UDWGPHFs';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Initialize the Google Sheets API client
function start() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: SCOPES
  }).then(function() {
    console.log('Google Sheets API initialized');
  });
}

// Handle form submission
document.addEventListener('submit', function(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  if (form.id === 'login-form') {
    handleLogin(formData);
  } else if (form.id === 'signup-form') {
    handleSignup(formData);
  }
});

// Handle login form submission
function handleLogin(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Get the user's data from the sheet
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!A2:C',
    majorDimension: 'ROWS'
  }).then(function(response) {
    const data = response.result.values;
    const user = data.find(function(user) {
      return user[1] === email && user[2] === password;
    });

    if (user) {
      showMessage('Login successful');
      clearForm('login-form');
    } else {
      showError('Invalid email or password');
    }
  }, function(reason) {
    console.error('Error: ' + reason.result.error.message);
    showError('Could not access the sheet');
  });
}

// Handle signup form submission
function handleSignup(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  // Check if the user already exists
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!B:B',
    majorDimension: 'COLUMNS'
  }).then(function(response) {
    const data = response.result.values[0];

    if (data.includes(email)) {
      showError('User already exists');
    } else {
      // Add the user to the sheet
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!A:C',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[name, email, password]]
        }
      }).then(function(response) {
        showMessage('Sign up successful');
        clearForm('signup-form');
      }, function(reason) {
        console.error('Error: ' + reason.result.error.message);
        showError('Could not access the sheet');
      });
    }
  }, function(reason) {
    console.error('Error: ' + reason.result.error.message);
    showError('Could not access the sheet');
  });
}

// Display a success message
function showMessage(message) {
  const messageElement = document.getElementById('message');
  messageElement.innerHTML = message;
  messageElement.classList.remove('error');
}

// Display an error message
function showError(message) {
const messageElement = document.getElementById('error-message');
messageElement.innerHTML = message;
}

// Clear the form fields
function clearForm(formId) {
const form = document.getElementById(formId);
form.reset();
showMessage('');
showError('');
}