# Google Drive Integration Setup Instructions

This guide will help you set up the Google Drive integration for storing registration form data in Google Sheets and uploading files to Google Drive.

## Prerequisites

1. A Google account with access to Google Drive and Google Sheets
2. Basic knowledge of Google Apps Script
3. Your React application running locally

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Hackathon Registrations" or similar
4. Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
5. Share the spreadsheet with your Google account (if not already owned by you)

## Step 2: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named "Hackathon Files" or similar
3. Copy the Folder ID from the URL (the long string after `/folders/`)
4. Make sure the folder is accessible by your Google account

## Step 3: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Name it "Hackathon Registration Handler"
4. Replace the default code with the content from `google-apps-script/Code.gs`
5. Update the configuration variables at the top of the file:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheet ID
   const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID'; // Replace with your Google Drive folder ID
   ```

## Step 4: Deploy Google Apps Script

1. Click on "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set the following options:
   - **Execute as**: "Me" (your Google account)
   - **Who has access**: "Anyone" (for testing) or "Anyone with Google account" (for production)
4. Click "Deploy"
5. Copy the Web App URL provided

## Step 5: Configure Environment Variables

1. Create a `.env` file in your React project root (if it doesn't exist)
2. Add the following line:
   ```
   REACT_APP_GOOGLE_APPS_SCRIPT_URL=YOUR_WEB_APP_URL
   ```
3. Replace `YOUR_WEB_APP_URL` with the URL from Step 4

## Step 6: Test the Setup

1. Run your React application
2. Open the browser console
3. Test the API connection by running:
   ```javascript
   import { testApiConnection } from './src/utils/registrationService';
   testApiConnection().then(result => console.log('API Test:', result));
   ```

## Step 7: Initialize the Spreadsheet

1. In Google Apps Script editor, run the `setupSpreadsheet()` function
2. This will create the proper headers and formatting in your Google Sheet

## Step 8: Test Registration Form

1. Fill out the registration form with test data
2. Upload test files
3. Submit the form
4. Check your Google Sheet to verify the data was saved
5. Check your Google Drive folder to verify files were uploaded

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your Google Apps Script is deployed as a web app with proper access settings
2. **File Upload Failures**: Ensure the Drive folder ID is correct and the folder is accessible
3. **Sheet Access Errors**: Verify the spreadsheet ID and sharing permissions
4. **API URL Issues**: Double-check the web app URL in your environment variables

### Debug Steps:

1. Check the Google Apps Script execution logs
2. Verify all IDs are correct (spreadsheet, folder, web app)
3. Test the API endpoint directly in a browser
4. Check browser console for any JavaScript errors

## Security Considerations

1. **Production Deployment**: Change "Who has access" to "Anyone with Google account" for production
2. **File Permissions**: Files are set to "Anyone with link can view" - adjust as needed
3. **Rate Limiting**: Google Apps Script has quotas - monitor usage for high-traffic scenarios
4. **Data Validation**: Consider adding server-side validation in the Google Apps Script

## File Structure

```
src/
├── config/
│   └── environment.ts          # Environment configuration
├── utils/
│   └── registrationService.ts  # Updated registration service
├── partials/Contact/
│   └── index.tsx              # Updated contact component
└── components/RegistrationForm/
    └── index.tsx              # Registration form component

google-apps-script/
└── Code.gs                    # Google Apps Script backend

SETUP_INSTRUCTIONS.md          # This file
```

## API Endpoints

- **POST**: Submit registration data and files
- **GET**: Test API connection

## Data Flow

1. User fills out registration form
2. Form data is validated on the client side
3. Data and files are sent to Google Apps Script
4. Google Apps Script processes files and uploads to Drive
5. Registration data is appended to Google Sheet
6. Success/error response is sent back to client

## Monitoring

- Check Google Apps Script execution logs for errors
- Monitor Google Drive storage usage
- Review Google Sheet for data consistency
- Set up notifications for failed submissions if needed 