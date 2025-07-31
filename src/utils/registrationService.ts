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

export const submitRegistration = async (data: RegistrationData): Promise<{ success: boolean; message: string; fileUrls?: Record<string, string> }> => {
  try {
    console.log('🚀 Starting registration submission...');
    console.log('📡 API URL:', API_URL);
    console.log('📋 Form data:', data);

    // Prepare form data for file uploads
    const formData = new FormData();

    // Add team member ID cards to files
    let fileCount = 0;
    data.teamMembers.forEach((member, index) => {
      if (member.idCard) {
        console.log(`📎 Adding file for member ${index + 1}:`, member.idCard.name);
        formData.append(`member_${index}_id_file`, member.idCard);
        fileCount++;
      }
    });

    console.log(`📁 Total files to upload: ${fileCount}`);

    // Add JSON data
    const jsonData = {
      instituteName: data.instituteName,
      numberOfParticipants: data.numberOfParticipants,
      teamMembers: data.teamMembers.map(member => ({
        fullName: member.fullName,
        contactNumber: member.contactNumber,
        email: member.email,
        collegeId: member.collegeId
      })),
      githubRepository: data.githubRepository
    };

    formData.append('data', JSON.stringify(jsonData));
    console.log('📤 Sending request to Google Apps Script...');

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Response received:', result);
    
    if (!result.success) {
      console.error('❌ API Error:', result.error);
      throw new Error(result.error || 'Unknown error occurred');
    }

    console.log('🎉 Registration successful!');
    return result;
  } catch (error) {
    console.error('💥 Registration submission failed:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Google Apps Script. Please check your internet connection and try again.');
    }
    
    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error('CORS error: The Google Apps Script is not configured to accept requests from this domain. Please check the deployment settings.');
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
