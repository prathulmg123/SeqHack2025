# Troubleshooting Google Drive Integration

## Quick Debug Steps

1. **Open Browser Console** (F12) and look for error messages
2. **Test API Connection** using the test button in development mode
3. **Check the logs** in the console for detailed information

## Common Issues and Solutions

### 1. **CORS Error**
**Symptoms:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
- Go to Google Apps Script
- Click "Deploy" > "Manage deployments"
- Edit your deployment
- Set "Who has access" to "Anyone" (for testing)
- Redeploy

### 2. **Google Apps Script Not Deployed**
**Symptoms:** `HTTP 404` or `Failed to fetch`

**Solution:**
- Go to [script.google.com](https://script.google.com)
- Open your project
- Click "Deploy" > "New deployment"
- Choose "Web app"
- Set "Execute as" to "Me"
- Set "Who has access" to "Anyone"
- Deploy and copy the URL

### 3. **Wrong Spreadsheet/Folder IDs**
**Symptoms:** `Spreadsheet not found` or `Folder not found`

**Solution:**
- Check your Google Apps Script code
- Verify SPREADSHEET_ID and DRIVE_FOLDER_ID are correct
- Make sure you have access to both the sheet and folder

### 4. **File Upload Issues**
**Symptoms:** Files not appearing in Drive

**Solution:**
- Check file size (Google Apps Script has limits)
- Ensure file types are supported
- Verify Drive folder permissions

### 5. **Environment Variable Issues**
**Symptoms:** API URL is placeholder value

**Solution:**
- Check `src/config/environment.ts`
- Ensure the Google Apps Script URL is correct
- Restart your development server after changes

## Step-by-Step Debug Process

### Step 1: Check Configuration
```javascript
// In browser console, run:
import { debugConfiguration } from './src/utils/registrationService';
debugConfiguration();
```

### Step 2: Test API Connection
```javascript
// In browser console, run:
import { testApiConnection } from './src/utils/registrationService';
testApiConnection().then(result => console.log('API Test:', result));
```

### Step 3: Check Google Apps Script Logs
1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click "Executions" in the left sidebar
4. Look for recent executions and check for errors

### Step 4: Verify Google Apps Script Code
Make sure your Google Apps Script has:
- Correct SPREADSHEET_ID
- Correct DRIVE_FOLDER_ID
- Proper CORS headers
- Error handling

## Testing Checklist

- [ ] Google Apps Script is deployed as web app
- [ ] Web app URL is correct in environment config
- [ ] Spreadsheet ID is correct
- [ ] Drive folder ID is correct
- [ ] CORS is properly configured
- [ ] Files are being uploaded
- [ ] Data is being saved to sheet

## Error Messages and Solutions

| Error | Solution |
|-------|----------|
| `CORS policy blocked` | Change deployment access to "Anyone" |
| `HTTP 404` | Redeploy Google Apps Script |
| `Spreadsheet not found` | Check SPREADSHEET_ID |
| `Folder not found` | Check DRIVE_FOLDER_ID |
| `File upload failed` | Check file size and type |
| `Network error` | Check internet connection |

## Debug Commands

Add these to your browser console for debugging:

```javascript
// Test API connection
import { testApiConnection } from './src/utils/registrationService';
testApiConnection();

// Show configuration
import { debugConfiguration } from './src/utils/registrationService';
debugConfiguration();

// Test with sample data
import { submitRegistration } from './src/utils/registrationService';
submitRegistration({
  instituteName: 'Test Institute',
  numberOfParticipants: 2,
  teamMembers: [
    {
      fullName: 'Test User',
      contactNumber: '1234567890',
      email: 'test@example.com',
      collegeId: 'TEST001',
      idCard: null
    }
  ],
  githubRepository: 'https://github.com/test/test'
});
```

## Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Verify all IDs** are correct
3. **Test with simple data** first (no files)
4. **Check Google Apps Script logs** for server-side errors
5. **Ensure proper permissions** on Google Drive and Sheets 