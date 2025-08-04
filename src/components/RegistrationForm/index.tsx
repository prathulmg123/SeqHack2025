import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaUpload, FaUser, FaEnvelope, FaPhone, FaBuilding, FaImage, FaGithub, FaTrophy, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import style from './index.module.css';
import { useToast } from '../ToastManager';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
interface Participant {
  name: string;
  email: string;
  phoneNumber: string;
  collegeIdProof: File | null;
  gitLink: string;
  achievements: string;
  registeredInMulearn: boolean;
  karmaPoints: string;
}

interface FormData {
  collegeName: string;
  teamSize: number;
  participants: Participant[];
}

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'registration' });
  const [formData, setFormData] = useState<FormData>({
    collegeName: '',
    teamSize: 2,
    participants: [
      { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' },
      { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' },
      { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' },
      { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' }
    ]
  });

  const [errors, setErrors] = useState<Partial<FormData> & { participants?: (string | undefined)[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch()

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> & { participants?: (string | undefined)[] } = {};
    const errorMessages: string[] = [];

    // Validate college name
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
      errorMessages.push('College name is required');
    }

    // Validate team size
    if (![2, 3, 4].includes(formData.teamSize)) {
      newErrors.teamSize = 'Please select 2, 3, or 4 participants' as any;
      errorMessages.push('Please select 2, 3, or 4 participants');
    }

    // Validate participants
    const participantErrors: (string | undefined)[] = [];
    for (let i = 0; i < formData.teamSize; i++) {
      const participant = formData.participants[i];
      const participantErrorMessages: string[] = [];

      if (!participant.name.trim()) {
        participantErrorMessages.push('Name is required');
      }

      if (!participant.email.trim()) {
        participantErrorMessages.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email)) {
        participantErrorMessages.push('Please enter a valid email address');
      }

      if (!participant.phoneNumber.trim()) {
        participantErrorMessages.push('Phone number is required');
      } else if (!/^[0-9+\-\s()]{10,15}$/.test(participant.phoneNumber)) {
        participantErrorMessages.push('Please enter a valid phone number');
      }

      if (!participant.collegeIdProof) {
        participantErrorMessages.push('College ID proof is required');
      }

      // Git link is mandatory only for participant 1
      if (i === 0 && !participant.gitLink.trim()) {
        participantErrorMessages.push('Git link is required for participant 1');
      } else if (i > 0 && participant.gitLink.trim() && !/^https?:\/\/github\.com\/[^\/]+\/[^\/]+/.test(participant.gitLink)) {
        participantErrorMessages.push('Please enter a valid GitHub repository URL');
      }

      // Validate karma points if registered in Mulearn
      if (participant.registeredInMulearn && !participant.karmaPoints.trim()) {
        participantErrorMessages.push('Karma points are required if registered in Mulearn');
      }

      if (participantErrorMessages.length > 0) {
        participantErrors[i] = participantErrorMessages.join(', ');
        errorMessages.push(`Participant ${i + 1}: ${participantErrorMessages.join(', ')}`);
      }
    }

    if (participantErrors.some(error => error)) {
      newErrors.participants = participantErrors as any;
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

  const handleParticipantChange = (index: number, field: keyof Participant, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      )
    }));

    // Clear participant errors
    if (errors.participants?.[index]) {
      setErrors(prev => ({
        ...prev,
        participants: prev.participants?.map((error, i) => i === index ? undefined : error)
      } as any));
    }
  };

  const handleFileUpload = (index: number, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, collegeIdProof: file } : participant
      )
    }));

    // Clear participant errors
    if (errors.participants?.[index]) {
      setErrors(prev => ({
        ...prev,
        participants: prev.participants?.map((error, i) => i === index ? undefined : error)
      } as any));
    }
  };



  const handleTeamSizeChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      teamSize: value,
      participants: prev.participants.slice(0, value)
    }));
    
    if (errors.teamSize) {
      setErrors(prev => ({ ...prev, teamSize: undefined }));
    }
  };
  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hidden')
  }, [dispatch.pointer])
  
  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      showSuccess('Registration submitted successfully!');
      // Reset form after successful submission
      setFormData({
        collegeName: '',
        teamSize: 2,
        participants: [
          { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' },
          { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' },
          { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' },
          { name: '', email: '', phoneNumber: '', collegeIdProof: null, gitLink: '', achievements: '', registeredInMulearn: false, karmaPoints: '' }
        ]
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
      <div className={style.modal}  >
        <div className={style.header}>
          <h2>Hackathon Registration</h2>
          <button className={style.closeButton} onClick={onClose} onMouseEnter={overHandler} onMouseLeave={outHandler}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formGrid} onMouseEnter={overHandler} onMouseLeave={outHandler}>
            {/* College Information */}
            <div className={style.section}>
              <h3>College Information</h3>
              
              <div className={style.inputGroup}>
                <label htmlFor="collegeName">College Name *</label>
                <div className={style.inputWrapper}>
                  <FaBuilding className={style.inputIcon} />
                  <input
                    type="text"
                    id="collegeName"
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    className={errors.collegeName ? style.error : ''}
                    placeholder="Enter your college name"
                  />
                </div>
                {errors.collegeName && <span className={style.errorText}>{errors.collegeName}</span>}
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="teamSize">Team Size *</label>
                <select
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) => handleTeamSizeChange(Number(e.target.value))}
                  className={errors.teamSize ? style.error : ''}
                >
                  <option value={2}>2 Participants</option>
                  <option value={3}>3 Participants</option>
                  <option value={4}>4 Participants</option>
                </select>
                {errors.teamSize && <span className={style.errorText}>{errors.teamSize}</span>}
              </div>
            </div>

            {/* Participants */}
            {Array.from({ length: formData.teamSize }, (_, index) => (
              <div key={index} className={style.section}>
                <h3>Participant {index + 1}</h3>
                
                <div className={style.inputGroup}>
                  <label htmlFor={`name${index}`}>Name *</label>
                  <div className={style.inputWrapper}>
                    <FaUser className={style.inputIcon} />
                    <input
                      type="text"
                      id={`name${index}`}
                      value={formData.participants[index]?.name || ''}
                      onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                      className={errors.participants?.[index] ? style.error : ''}
                      placeholder={`Enter name of participant ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`email${index}`}>Email ID *</label>
                  <div className={style.inputWrapper}>
                    <FaEnvelope className={style.inputIcon} />
                    <input
                      type="email"
                      id={`email${index}`}
                      value={formData.participants[index]?.email || ''}
                      onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                      className={errors.participants?.[index] ? style.error : ''}
                      placeholder={`Enter email of participant ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`phoneNumber${index}`}>Phone Number *</label>
                  <div className={style.inputWrapper}>
                    <FaPhone className={style.inputIcon} />
                    <input
                      type="tel"
                      id={`phoneNumber${index}`}
                      value={formData.participants[index]?.phoneNumber || ''}
                      onChange={(e) => handleParticipantChange(index, 'phoneNumber', e.target.value)}
                      className={errors.participants?.[index] ? style.error : ''}
                      placeholder={`Enter phone number of participant ${index + 1}`}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`collegeIdProof${index}`}>College ID Proof *</label>
                  <div className={style.imageUpload}>
                    <input
                      ref={(el) => fileInputRefs.current[index] = el}
                      type="file"
                      id={`collegeIdProof${index}`}
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
                        {formData.participants[index]?.collegeIdProof 
                          ? formData.participants[index]?.collegeIdProof?.name 
                          : `Upload College ID Proof for Participant ${index + 1}`
                        }
                      </span>
                    </button>
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`gitLink${index}`}>
                    Git Link {index === 0 ? '*' : '(Optional)'}
                  </label>
                  <div className={style.inputWrapper}>
                    <FaGithub className={style.inputIcon} />
                    <input
                      type="url"
                      id={`gitLink${index}`}
                      value={formData.participants[index]?.gitLink || ''}
                      onChange={(e) => handleParticipantChange(index, 'gitLink', e.target.value)}
                      className={errors.participants?.[index] ? style.error : ''}
                      placeholder="https://github.com/username/repository"
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label htmlFor={`achievements${index}`}>Achievements</label>
                  <div className={style.inputWrapper}>
                    <FaTrophy className={style.inputIcon} />
                    <textarea
                      id={`achievements${index}`}
                      value={formData.participants[index]?.achievements || ''}
                      onChange={(e) => handleParticipantChange(index, 'achievements', e.target.value)}
                      placeholder="Enter achievements of participant"
                      rows={3}
                    />
                  </div>
                </div>

                <div className={style.inputGroup}>
                  <label className={style.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.participants[index]?.registeredInMulearn || false}
                      onChange={(e) => handleParticipantChange(index, 'registeredInMulearn', e.target.checked)}
                    />
                    <FaCheckCircle className={style.checkboxIcon} />
                    Registered in Mulearn
                  </label>
                </div>

                {formData.participants[index]?.registeredInMulearn && (
                  <div className={style.inputGroup}>
                    <label htmlFor={`karmaPoints${index}`}>Karma Points *</label>
                    <div className={style.inputWrapper}>
                      <FaTrophy className={style.inputIcon} />
                      <input
                        type="text"
                        id={`karmaPoints${index}`}
                        value={formData.participants[index]?.karmaPoints || ''}
                        onChange={(e) => handleParticipantChange(index, 'karmaPoints', e.target.value)}
                        className={errors.participants?.[index] ? style.error : ''}
                        placeholder="Enter karma points"
                      />
                    </div>
                  </div>
                )}

                {errors.participants?.[index] && (
                  <span className={style.errorText}>{errors.participants[index]}</span>
                )}
              </div>
            ))}

            {/* College Verification Note */}
            <div className={style.section}>
              <h3>College Verification</h3>
              
              <div className={style.inputGroup}>
                <div className={style.noteBox}>
                  <FaFileAlt className={style.noteIcon} />
                  <div>
                    <strong>Important Note:</strong>
                    <p>Participants are required to upload a letter from the Principal confirming that they are attending the hackathon. This document should be submitted separately through your college administration.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={style.formActions}>
            <button type="button" onClick={onClose}onMouseEnter={overHandler} onMouseLeave={outHandler} className={style.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}onMouseEnter={overHandler} onMouseLeave={outHandler} className={style.submitButton}>
              {isSubmitting ? 'Submitting...' : 'Register Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm; 