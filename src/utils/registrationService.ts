// Registration service for handling form submissions to Google Apps Script
import config from '../config/environment';

const API_URL = config.googleAppsScriptUrl;

export interface TeamMember {
  fullName: string;
  contactNumber: string;
  email: string;
  collegeId: string;
  idCard: File | null;
}

export interface RegistrationData {
  instituteName: string;
  numberOfParticipants: number;
  teamMembers: TeamMember[];
  githubRepository: string;
}

export const submitRegistration = async (
  data: RegistrationData
): Promise<{ success: boolean; message: string; fileUrls?: Record<string, string> }> => {
  try {
    console.log('🚀 Starting registration submission...');
    console.log('📡 API URL:', API_URL);

    const formData = new FormData();
    const fileUrls: Record<string, string> = {};
    let fileCount = 0;

    // Helper to convert File to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // Add base64 ID cards to formData
    for (let i = 0; i < data.teamMembers.length; i++) {
      const member = data.teamMembers[i];
      if (member.idCard) {
        const base64 = await fileToBase64(member.idCard);
        formData.append(`member_${i}_id_file`, base64);
        fileCount++;
        console.log(`📎 Added base64 file for member ${i + 1}`);
      }
    }

    console.log(`📁 Total files converted to base64: ${fileCount}`);

    // Strip out File objects for JSON payload
    const jsonData = {
      instituteName: data.instituteName,
      numberOfParticipants: data.numberOfParticipants,
      githubRepository: data.githubRepository,
      teamMembers: data.teamMembers.map(({ fullName, contactNumber, email, collegeId }) => ({
        fullName,
        contactNumber,
        email,
        collegeId
      }))
    };

    formData.append('data', JSON.stringify(jsonData));

    console.log('📤 Sending request to Google Apps Script...');

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      mode: 'cors',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Response received:', result);

    if (!result.success) {
      throw new Error(result.error || 'Unknown API error');
    }

    return result;
  } catch (error) {
    console.error('💥 Submission failed:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Cannot connect to Google Apps Script.');
    }

    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error('CORS error: Check your Google Apps Script deployment settings.');
    }

    throw error;
  }
};


// Test function to verify API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing API connection to:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'GET',
      mode: 'cors',
    });
    
    console.log('📡 Test response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Test failed with status:', response.status);
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.text();
    console.log('📄 Test response:', result);
    
    const isWorking = result.includes('Registration API is running');
    console.log('✅ API test result:', isWorking ? 'SUCCESS' : 'FAILED');
    
    return isWorking;
  } catch (error) {
    console.error('💥 API connection test failed:', error);
    return false;
  }
};

// Debug function to check configuration
export const debugConfiguration = () => {
  console.log('🔧 Configuration Debug Info:');
  console.log('📡 API URL:', API_URL);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('🔗 Is HTTPS:', window.location.protocol === 'https:');
  console.log('🏠 Origin:', window.location.origin);
};
