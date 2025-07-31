// Google Apps Script for handling registration form submissions
// This script will store data in Google Sheets and upload files to Google Drive

// Configuration
const SPREADSHEET_ID = '1dQWl07IzyQeuV-RFUl-zkI5XJ01q-mHaGcyBMU_vFKs';
const DRIVE_FOLDER_ID = '16H6lQgz3zEjz2R5YaYamV32GsNuE6NrC';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

/**
 * Main function to handle POST requests
 */
function doPost(e) {
  try {
    console.log('Received POST request');
    console.log('Parameters:', Object.keys(e.parameter));
    
    // Parse the form data
    const formData = e.parameter;
    let jsonData;
    
    // Handle different content types
    if (formData.data) {
      jsonData = JSON.parse(formData.data);
    } else if (e.postData && e.postData.contents) {
      jsonData = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received');
    }
    
    console.log('Parsed JSON data:', jsonData);
    
    // Process file uploads
    const fileUrls = processFileUploads(e.parameter, jsonData);
    console.log('File URLs:', fileUrls);
    
    // Store data in Google Sheets
    const rowData = prepareRowData(jsonData, fileUrls);
    appendToSheet(rowData);
    
    // Return success response
    const response = ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration submitted successfully',
      fileUrls: fileUrls
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
    // Set CORS headers
    Object.keys(CORS_HEADERS).forEach(key => {
      response.setHeader(key, CORS_HEADERS[key]);
    });
    
    return response;
    
  } catch (error) {
    console.error('Error processing registration:', error);
    
    const errorResponse = ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
    // Set CORS headers even for error responses
    Object.keys(CORS_HEADERS).forEach(key => {
      errorResponse.setHeader(key, CORS_HEADERS[key]);
    });
    
    return errorResponse;
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  const response = ContentService.createTextOutput('Registration API is running')
    .setMimeType(ContentService.MimeType.TEXT);
  
  // Set CORS headers
  Object.keys(CORS_HEADERS).forEach(key => {
    response.setHeader(key, CORS_HEADERS[key]);
  });
  
  return response;
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  const response = ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
  
  // Set CORS headers for preflight
  Object.keys(CORS_HEADERS).forEach(key => {
    response.setHeader(key, CORS_HEADERS[key]);
  });
  
  return response;
}

/**
 * Process file uploads and store them in Google Drive
 */
function processFileUploads(formData, jsonData) {
  const fileUrls = {};
  
  try {
    console.log('Processing file uploads...');
    
    // Get the Drive folder
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    console.log('Drive folder accessed');
    
    // Process participant college ID proofs
    jsonData.participants.forEach((participant, index) => {
      const fileKey = `participant_${index}_college_id_proof`;
      console.log(`Checking for file key: ${fileKey}`);
      
      if (formData[fileKey]) {
        console.log(`Processing college ID proof for participant ${index + 1}`);
        const base64 = formData[fileKey];
        const match = base64.match(/^data:(.+);base64,(.*)$/);
        
        if (match) {
          const contentType = match[1];
          const bytes = Utilities.base64Decode(match[2]);
          const blob = Utilities.newBlob(bytes, contentType, `participant_${index + 1}_college_id_proof`);
          
          // Upload to Drive
          const driveFile = folder.createFile(blob);
          console.log(`File uploaded: ${driveFile.getName()}`);
          
          // Set file permissions to anyone with link can view
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          fileUrls[`participant_${index}_college_id_proof`] = driveFile.getUrl();
          console.log(`File URL: ${driveFile.getUrl()}`);
        }
      } else {
        console.log(`No college ID proof found for participant ${index + 1}`);
      }
    });
    
    // Process college verification document
    if (formData.college_verification) {
      console.log('Processing college verification document');
      const base64 = formData.college_verification;
      const match = base64.match(/^data:(.+);base64,(.*)$/);
      
      if (match) {
        const contentType = match[1];
        const bytes = Utilities.base64Decode(match[2]);
        const blob = Utilities.newBlob(bytes, contentType, 'college_verification_letter');
        
        // Upload to Drive
        const driveFile = folder.createFile(blob);
        console.log(`College verification uploaded: ${driveFile.getName()}`);
        
        // Set file permissions
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        fileUrls['college_verification'] = driveFile.getUrl();
        console.log(`College verification URL: ${driveFile.getUrl()}`);
      }
    }
    
    console.log('File processing completed');
    
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
    jsonData.collegeName || '',
    jsonData.teamSize || ''
  ];
  
  // Add participant data (up to 4 participants)
  for (let i = 0; i < 4; i++) {
    const participant = jsonData.participants[i] || {};
    const fileUrl = fileUrls[`participant_${i}_college_id_proof`] || '';
    
    rowData.push(
      participant.name || '',
      participant.email || '',
      participant.phoneNumber || '',
      fileUrl,
      participant.gitLink || '',
      participant.achievements || '',
      participant.registeredInMulearn ? 'Yes' : 'No',
      participant.karmaPoints || ''
    );
  }
  
  // Add college verification URL
  rowData.push(fileUrls['college_verification'] || '');
  
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
        'College Name',
        'Team Size',
        'Participant 1 - Name',
        'Participant 1 - Email',
        'Participant 1 - Phone Number',
        'Participant 1 - College ID Proof URL',
        'Participant 1 - Git Link',
        'Participant 1 - Achievements',
        'Participant 1 - Registered in Mulearn',
        'Participant 1 - Karma Points',
        'Participant 2 - Name',
        'Participant 2 - Email',
        'Participant 2 - Phone Number',
        'Participant 2 - College ID Proof URL',
        'Participant 2 - Git Link',
        'Participant 2 - Achievements',
        'Participant 2 - Registered in Mulearn',
        'Participant 2 - Karma Points',
        'Participant 3 - Name',
        'Participant 3 - Email',
        'Participant 3 - Phone Number',
        'Participant 3 - College ID Proof URL',
        'Participant 3 - Git Link',
        'Participant 3 - Achievements',
        'Participant 3 - Registered in Mulearn',
        'Participant 3 - Karma Points',
        'Participant 4 - Name',
        'Participant 4 - Email',
        'Participant 4 - Phone Number',
        'Participant 4 - College ID Proof URL',
        'Participant 4 - Git Link',
        'Participant 4 - Achievements',
        'Participant 4 - Registered in Mulearn',
        'Participant 4 - Karma Points',
        'College Verification URL'
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
      'College Name',
      'Team Size',
      'Participant 1 - Name',
      'Participant 1 - Email',
      'Participant 1 - Phone Number',
      'Participant 1 - College ID Proof URL',
      'Participant 1 - Git Link',
      'Participant 1 - Achievements',
      'Participant 1 - Registered in Mulearn',
      'Participant 1 - Karma Points',
      'Participant 2 - Name',
      'Participant 2 - Email',
      'Participant 2 - Phone Number',
      'Participant 2 - College ID Proof URL',
      'Participant 2 - Git Link',
      'Participant 2 - Achievements',
      'Participant 2 - Registered in Mulearn',
      'Participant 2 - Karma Points',
      'Participant 3 - Name',
      'Participant 3 - Email',
      'Participant 3 - Phone Number',
      'Participant 3 - College ID Proof URL',
      'Participant 3 - Git Link',
      'Participant 3 - Achievements',
      'Participant 3 - Registered in Mulearn',
      'Participant 3 - Karma Points',
      'Participant 4 - Name',
      'Participant 4 - Email',
      'Participant 4 - Phone Number',
      'Participant 4 - College ID Proof URL',
      'Participant 4 - Git Link',
      'Participant 4 - Achievements',
      'Participant 4 - Registered in Mulearn',
      'Participant 4 - Karma Points',
      'College Verification URL'
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
