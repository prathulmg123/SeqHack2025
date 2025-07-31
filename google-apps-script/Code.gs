// Google Apps Script for handling registration form submissions
// This script will store data in Google Sheets and upload files to Google Drive

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheet ID
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID'; // Replace with your Google Drive folder ID

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/**
 * Main function to handle POST requests
 */
function doPost(e) {
  try {
    // Handle CORS preflight requests
    if (e.parameter.method === 'OPTIONS') {
      return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders(CORS_HEADERS);
    }

    // Parse the form data
    const formData = e.parameter;
    const jsonData = JSON.parse(formData.data);
    
    // Process file uploads
    const fileUrls = processFileUploads(e.parameter, jsonData);
    
    // Store data in Google Sheets
    const rowData = prepareRowData(jsonData, fileUrls);
    appendToSheet(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration submitted successfully',
      fileUrls: fileUrls
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
    
  } catch (error) {
    console.error('Error processing registration:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput('Registration API is running')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(CORS_HEADERS);
}

/**
 * Process file uploads and store them in Google Drive
 */
function processFileUploads(formData, jsonData) {
  const fileUrls = {};
  
  try {
    // Get the Drive folder
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Process team member ID cards
    jsonData.teamMembers.forEach((member, index) => {
      const fileKey = `member_${index}_id_file`;
      if (formData[fileKey]) {
        const file = formData[fileKey];
        const blob = Utilities.newBlob(file.getBytes(), file.getContentType(), file.getName());
        const driveFile = folder.createFile(blob);
        
        // Set file permissions to anyone with link can view
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        fileUrls[`member_${index}_id`] = driveFile.getUrl();
      }
    });
    
    // Process additional files if any
    if (jsonData.files) {
      jsonData.files.forEach((fileInfo, index) => {
        const fileKey = `additional_${index}`;
        if (formData[fileKey]) {
          const file = formData[fileKey];
          const blob = Utilities.newBlob(file.getBytes(), file.getContentType(), file.getName());
          const driveFile = folder.createFile(blob);
          
          // Set file permissions
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          fileUrls[`additional_${index}`] = driveFile.getUrl();
        }
      });
    }
    
  } catch (error) {
    console.error('Error processing files:', error);
    throw new Error('Failed to process file uploads: ' + error.toString());
  }
  
  return fileUrls;
}

/**
 * Prepare row data for Google Sheets
 */
function prepareRowData(jsonData, fileUrls) {
  const timestamp = new Date().toISOString();
  
  // Base row data
  const rowData = [
    timestamp, // Timestamp
    jsonData.instituteName || '',
    jsonData.numberOfParticipants || '',
    jsonData.githubRepository || ''
  ];
  
  // Add team member data (up to 4 members)
  for (let i = 0; i < 4; i++) {
    const member = jsonData.teamMembers[i] || {};
    const fileUrl = fileUrls[`member_${i}_id`] || '';
    
    rowData.push(
      member.fullName || '',
      member.contactNumber || '',
      member.email || '',
      member.collegeId || '',
      fileUrl
    );
  }
  
  // Add additional file URLs
  const additionalFiles = Object.values(fileUrls).filter(url => 
    !url.includes('member_') && !url.includes('id')
  );
  rowData.push(additionalFiles.join(', '));
  
  return rowData;
}

/**
 * Append data to Google Sheet
 */
function appendToSheet(rowData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // If sheet is empty, add headers
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Institute Name',
        'Number of Participants',
        'GitHub Repository',
        'Member 1 - Full Name',
        'Member 1 - Contact Number',
        'Member 1 - Email',
        'Member 1 - College ID',
        'Member 1 - ID Card URL',
        'Member 2 - Full Name',
        'Member 2 - Contact Number',
        'Member 2 - Email',
        'Member 2 - College ID',
        'Member 2 - ID Card URL',
        'Member 3 - Full Name',
        'Member 3 - Contact Number',
        'Member 3 - Email',
        'Member 3 - College ID',
        'Member 3 - ID Card URL',
        'Member 4 - Full Name',
        'Member 4 - Contact Number',
        'Member 4 - Email',
        'Member 4 - College ID',
        'Member 4 - ID Card URL',
        'Additional Files'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Append the new row
    sheet.appendRow(rowData);
    
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw new Error('Failed to save data to spreadsheet: ' + error.toString());
  }
}

/**
 * Setup function to create the initial spreadsheet structure
 */
function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Clear existing data
    sheet.clear();
    
    // Add headers
    const headers = [
      'Timestamp',
      'Institute Name',
      'Number of Participants',
      'GitHub Repository',
      'Member 1 - Full Name',
      'Member 1 - Contact Number',
      'Member 1 - Email',
      'Member 1 - College ID',
      'Member 1 - ID Card URL',
      'Member 2 - Full Name',
      'Member 2 - Contact Number',
      'Member 2 - Email',
      'Member 2 - College ID',
      'Member 2 - ID Card URL',
      'Member 3 - Full Name',
      'Member 3 - Contact Number',
      'Member 3 - Email',
      'Member 3 - College ID',
      'Member 3 - ID Card URL',
      'Member 4 - Full Name',
      'Member 4 - Contact Number',
      'Member 4 - Email',
      'Member 4 - College ID',
      'Member 4 - ID Card URL',
      'Additional Files'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('Spreadsheet setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up spreadsheet:', error);
  }
} 