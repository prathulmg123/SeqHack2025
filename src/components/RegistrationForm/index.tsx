import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaUpload, FaUser, FaEnvelope, FaPhone, FaBuilding, FaImage, FaGithub } from 'react-icons/fa';
import style from './index.module.css';
import { useToast } from '../ToastManager';

interface TeamMember {
  fullName: string;
  contactNumber: string;
  email: string;
  collegeId: string;
  idCard: File | null;
}

interface FormData {
  instituteName: string;
  numberOfParticipants: number;
  teamMembers: TeamMember[];
  githubRepository: string;
}

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'registration' });
  const [formData, setFormData] = useState<FormData>({
    instituteName: '',
    numberOfParticipants: 2,
    teamMembers: [
      { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null },
      { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null },
      { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null },
      { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null }
    ],
    githubRepository: ''
  });

  const [errors, setErrors] = useState<Partial<FormData> & { teamMembers?: (string | undefined)[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showError, showSuccess } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> & { teamMembers?: (string | undefined)[] } = {};
    const errorMessages: string[] = [];

    // Validate institute name
    if (!formData.instituteName.trim()) {
      newErrors.instituteName = 'Institute name is required';
      errorMessages.push('Institute name is required');
    }

    // Validate number of participants
    if (![2, 3, 4].includes(formData.numberOfParticipants)) {
      newErrors.numberOfParticipants = 'Please select 2, 3, or 4 participants'as any;
      errorMessages.push('Please select 2, 3, or 4 participants');
    }

    // Validate team members
    const teamMemberErrors: (string | undefined)[] = [];
    for (let i = 0; i < formData.numberOfParticipants; i++) {
      const member = formData.teamMembers[i];
      const memberErrors: string[] = [];

      if (!member.fullName.trim()) {
        memberErrors.push('Full name is required');
      }

      if (!member.contactNumber.trim()) {
        memberErrors.push('Contact number is required');
      } else if (!/^[0-9+\-\s()]{10,15}$/.test(member.contactNumber)) {
        memberErrors.push('Please enter a valid contact number');
      }

      if (!member.email.trim()) {
        memberErrors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        memberErrors.push('Please enter a valid email address');
      }

      if (!member.collegeId.trim()) {
        memberErrors.push('College ID is required');
      }

      if (!member.idCard) {
        memberErrors.push('College ID card is required');
      }

      if (memberErrors.length > 0) {
        teamMemberErrors[i] = memberErrors.join(', ');
        errorMessages.push(`Team Member ${i + 1}: ${memberErrors.join(', ')}`);
      }
    }

    if (teamMemberErrors.some(error => error)) {
      newErrors.teamMembers = teamMemberErrors as any;
    }

    // Validate GitHub repository
    if (!formData.githubRepository.trim()) {
      newErrors.githubRepository = 'GitHub repository link is required';
      errorMessages.push('GitHub repository link is required');
    } else if (!/^https?:\/\/github\.com\/[^\/]+\/[^\/]+/.test(formData.githubRepository)) {
      newErrors.githubRepository = 'Please enter a valid GitHub repository URL';
      errorMessages.push('Please enter a valid GitHub repository URL');
    }

    setErrors(newErrors);
    
    // Show toast with validation errors
    if (errorMessages.length > 0) {
      showError(`Please fix the following errors: ${errorMessages.slice(0, 3).join('; ')}${errorMessages.length > 3 ? ' and more...' : ''}`);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));

    // Clear team member errors
    if (errors.teamMembers?.[index]) {
      setErrors(prev => ({
        ...prev,
        teamMembers: prev.teamMembers?.map((error, i) => i === index ? undefined : error)
      }as any));
    }
  };

  const handleFileUpload = (index: number, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, idCard: file } : member
      )
    }));

    // Clear team member errors
    if (errors.teamMembers?.[index]) {
      setErrors(prev => ({
        ...prev,
        teamMembers: prev.teamMembers?.map((error, i) => i === index ? undefined : error)
      }as any));
    }
  };

  const handleNumberOfParticipantsChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      numberOfParticipants: value,
      teamMembers: prev.teamMembers.slice(0, value)
    }));
    
    if (errors.numberOfParticipants) {
      setErrors(prev => ({ ...prev, numberOfParticipants: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      showSuccess('Registration submitted successfully! Data file has been downloaded.');
      // Reset form after successful submission
      setFormData({
        instituteName: '',
        numberOfParticipants: 2,
        teamMembers: [
          { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null },
          { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null },
          { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null },
          { fullName: '', contactNumber: '', email: '', collegeId: '', idCard: null }
        ],
        githubRepository: ''
      });
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      showError('Error submitting registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <div className={style.header}>
          <h2>Hackathon Registration</h2>
          <button className={style.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formGrid}>
            {/* Institute Information */}
            <div className={style.section}>
              <h3>Institute Information</h3>
              
              <div className={style.inputGroup}>
                <label htmlFor="instituteName">Name of Institute *</label>
                <div className={style.inputWrapper}>
                  <FaBuilding className={style.inputIcon} />
                  <input
                    type="text"
                    id="instituteName"
                    value={formData.instituteName}
                    onChange={(e) => handleInputChange('instituteName', e.target.value)}
                    className={errors.instituteName ? style.error : ''}
                    placeholder="Enter your institute name"
                  />
                </div>
                {errors.instituteName && <span className={style.errorText}>{errors.instituteName}</span>}
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="numberOfParticipants">Number of Participants *</label>
                <select
                  id="numberOfParticipants"
                  value={formData.numberOfParticipants}
                  onChange={(e) => handleNumberOfParticipantsChange(Number(e.target.value))}
                  className={errors.numberOfParticipants ? style.error : ''}
                >
                  <option value={2}>2 Participants</option>
                  <option value={3}>3 Participants</option>
                  <option value={4}>4 Participants</option>
                </select>
                {errors.numberOfParticipants && <span className={style.errorText}>{errors.numberOfParticipants}</span>}
              </div>
            </div>

            {/* Team Members */}
            {Array.from({ length: formData.numberOfParticipants }, (_, index) => (
              <div key={index} className={style.section}>
                <h3>Team Member {index + 1}</h3>
                
                <div className={style.inputGroup}>
                  <label htmlFor={`fullName${index}`}>Full Name *</label>
                  <div className={style.inputWrapper}>
                    <FaUser className={style.inputIcon} />
                    <input
                      type="text"
                      id={`fullName${index}`}
                      value={formData.teamMembers[index]?.fullName || ''}
                      onChange={(e) => handleTeamMemberChange(index, 'fullName', e.target.value)}
                      className={errors.teamMembers?.[index] ? style.error : ''}
                      placeholder={`Enter full name of team member ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`contactNumber${index}`}>Contact Number *</label>
                  <div className={style.inputWrapper}>
                    <FaPhone className={style.inputIcon} />
                    <input
                      type="tel"
                      id={`contactNumber${index}`}
                      value={formData.teamMembers[index]?.contactNumber || ''}
                      onChange={(e) => handleTeamMemberChange(index, 'contactNumber', e.target.value)}
                      className={errors.teamMembers?.[index] ? style.error : ''}
                      placeholder={`Enter contact number of team member ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`email${index}`}>Email Address *</label>
                  <div className={style.inputWrapper}>
                    <FaEnvelope className={style.inputIcon} />
                    <input
                      type="email"
                      id={`email${index}`}
                      value={formData.teamMembers[index]?.email || ''}
                      onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                      className={errors.teamMembers?.[index] ? style.error : ''}
                      placeholder={`Enter email address of team member ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`collegeId${index}`}>College ID *</label>
                  <div className={style.inputWrapper}>
                    <FaUser className={style.inputIcon} />
                    <input
                      type="text"
                      id={`collegeId${index}`}
                      value={formData.teamMembers[index]?.collegeId || ''}
                      onChange={(e) => handleTeamMemberChange(index, 'collegeId', e.target.value)}
                      className={errors.teamMembers?.[index] ? style.error : ''}
                      placeholder={`Enter college ID of team member ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`idCard${index}`}>College ID Card *</label>
                  <div className={style.imageUpload}>
                    <input
                      ref={(el) => fileInputRefs.current[index] = el}
                      type="file"
                      id={`idCard${index}`}
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(index, e.target.files?.[0] || null)}
                      className={style.hiddenInput}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[index]?.click()}
                      className={style.uploadButton}
                    >
                      <FaUpload />
                      <span>
                        {formData.teamMembers[index]?.idCard 
                          ? formData.teamMembers[index]?.idCard?.name 
                          : `Upload College ID Card for Team Member ${index + 1}`
                        }
                      </span>
                    </button>
                  </div>
                </div>

                {errors.teamMembers?.[index] && (
                  <span className={style.errorText}>{errors.teamMembers[index]}</span>
                )}
              </div>
            ))}

            {/* GitHub Repository */}
            <div className={style.section}>
              <h3>Project Information</h3>
              
              <div className={style.inputGroup}>
                <label htmlFor="githubRepository">GitHub Repository Link *</label>
                <div className={style.inputWrapper}>
                  <FaGithub className={style.inputIcon} />
                  <input
                    type="url"
                    id="githubRepository"
                    value={formData.githubRepository}
                    onChange={(e) => handleInputChange('githubRepository', e.target.value)}
                    className={errors.githubRepository ? style.error : ''}
                    placeholder="https://github.com/username/repository"
                  />
                </div>
                {errors.githubRepository && <span className={style.errorText}>{errors.githubRepository}</span>}
              </div>
            </div>
          </div>

          <div className={style.formActions}>
            <button type="button" onClick={onClose} className={style.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={style.submitButton}>
              {isSubmitting ? 'Submitting...' : 'Register Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm; 