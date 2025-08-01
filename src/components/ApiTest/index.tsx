import React, { useState } from 'react';
import { testApiConnection, submitRegistration, debugConfiguration } from '../../utils/registrationService';
import { useToast } from '../ToastManager';
import style from './index.module.css';

const ApiTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const { showSuccess, showError } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult('Testing connection...');
    
    try {
      // First, show debug info
      debugConfiguration();
      
      const result = await testApiConnection();
      if (result) {
        setTestResult('✅ API connection successful!\n\nCheck browser console for detailed logs.');
        showSuccess('API connection test passed');
      } else {
        setTestResult('❌ API connection failed\n\nCheck browser console for detailed error logs.');
        showError('API connection test failed');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console for detailed logs.`);
      showError('API connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestRegistration = async () => {
    setIsTesting(true);
    setTestResult('Testing registration submission...');
    
    try {
      // Create test data
      const testData = {
        instituteName: 'Test Institute',
        numberOfParticipants: 2,
        teamMembers: [
          {
            fullName: 'Test User 1',
            contactNumber: '1234567890',
            email: 'test1@example.com',
            collegeId: 'TEST001',
            idCard: null
          },
          {
            fullName: 'Test User 2',
            contactNumber: '0987654321',
            email: 'test2@example.com',
            collegeId: 'TEST002',
            idCard: null
          }
        ],
        githubRepository: 'https://github.com/testuser/testrepo'
      };

      const result = await submitRegistration(testData);
      setTestResult(`✅ Registration test successful! ${result.message}\n\nCheck browser console for detailed logs.`);
      showSuccess('Registration test passed');
    } catch (error) {
      setTestResult(`❌ Registration test failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console for detailed logs.`);
      showError('Registration test failed');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className={style.container}>
      <h3>API Test Panel</h3>
      <div className={style.testButtons}>
        <button 
          onClick={handleTestConnection} 
          disabled={isTesting}
          className={style.testButton}
        >
          {isTesting ? 'Testing...' : 'Test API Connection'}
        </button>
        
        <button 
          onClick={handleTestRegistration} 
          disabled={isTesting}
          className={style.testButton}
        >
          {isTesting ? 'Testing...' : 'Test Registration'}
        </button>
      </div>
      
      {testResult && (
        <div className={style.result}>
          <pre>{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 