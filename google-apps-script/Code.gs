// Configuration
const SPREADSHEET_ID = '1dQWl07IzyQeuV-RFUl-zkI5XJ01q-mHaGcyBMU_vFKs';
const DRIVE_FOLDER_ID = '16H6lQgz3zEjz2R5YaYamV32GsNuE6NrC';

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

function doPost(e) {
  try {
    let jsonData;
    const formData = e.parameter;

    if (formData.data) {
      jsonData = JSON.parse(formData.data);
    } else if (e.postData && e.postData.contents) {
      jsonData = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received');
    }

    // Upload files and get URLs
    const fileUrls = processFileUploads(formData, jsonData);

    // Prepare row and save to Sheet
    const rowData = prepareRowData(jsonData, fileUrls);
    appendToSheet(rowData);

    const output = ContentService
      .createTextOutput(JSON.stringify({ success: true, fileUrls }))
      .setMimeType(ContentService.MimeType.JSON);
    return setCorsHeaders(output);
  } catch (err) {
    const output = ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
    return setCorsHeaders(output);
  }
}

function doGet() {
  const output = ContentService
    .createTextOutput('Registration API is running')
    .setMimeType(ContentService.MimeType.TEXT);
  return setCorsHeaders(output);
}

function doOptions() {
  const output = ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
  return setCorsHeaders(output);
}
function setCorsHeaders(output) {
 
    return output;
  }  
  
/**
 * Convert base64 files to Drive uploads and return public URLs
 */
function processFileUploads(formData, jsonData) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const fileUrls = {};

  for (let i = 0; i < 4; i++) {
    const key = `member_${i}_id_file`;
    if (formData[key]) {
      const base64 = formData[key];
      const match = base64.match(/^data:(.+);base64,(.*)$/);
      if (!match) continue;

      const contentType = match[1];
      const bytes = Utilities.base64Decode(match[2]);
      const blob = Utilities.newBlob(bytes, contentType, `member_${i + 1}_id_card.png`);

      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrls[`member_${i}_id`] = file.getUrl();
    }
  }

  return fileUrls;
}

/**
 * Prepare a row for Google Sheets
 */
function prepareRowData(jsonData, fileUrls) {
  const rowData = [
    new Date().toISOString(),
    jsonData.instituteName || '',
    jsonData.numberOfParticipants || '',
    jsonData.githubRepository || ''
  ];

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

  // Optional: add any other file URLs
  rowData.push('');
  return rowData;
}

/**
 * Append data to Google Sheets
 */
function appendToSheet(rowData) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
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

  sheet.appendRow(rowData);
}
