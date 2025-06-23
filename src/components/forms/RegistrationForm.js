import { useState } from 'react';
import { validateForm, areAllFieldsFilled } from '../utils/validation';
import './RegistrationForm.css';
import axios from 'axios';

/**
 * Composant de formulaire d'enregistrement
 * @returns {JSX.Element} Le formulaire d'enregistrement
 */
/**
 * RegistrationForm component handles user registration by collecting and validating form data.
 * It saves the data to localStorage upon successful submission and displays errors for invalid inputs.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setSuccessful - Callback function to set the success state after form submission.
 *
 * @returns {JSX.Element} The rendered registration form component.
 *
 * @example
 * <RegistrationForm setSuccessful={setSuccessfulHandler} />
 */
const RegistrationForm = ({ setSuccessful }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    city: '',
    postalCode: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validation dynamique du mot de passe
  const passwordRules = [
    { label: 'Au moins 8 caractères', valid: formData.password.length >= 8 },
    { label: 'Au moins une majuscule', valid: /[A-Z]/.test(formData.password) },
    { label: 'Au moins un chiffre', valid: /[0-9]/.test(formData.password) }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    // Ajout validation password côté front
    if (!formData.password || formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      validationErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.';
    }
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_PYTHON_API}/users`, formData);
        if (response.status === 201) {
          setSuccessful(true);
          setFormData({
            firstName: '', lastName: '', email: '', birthDate: '', city: '', postalCode: '', password: ''
          });
          setErrors({});
          setPasswordTouched(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setErrors({ email: 'Cet email est déjà utilisé' });
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const isFormValid = areAllFieldsFilled(formData) && passwordRules.every(r => r.valid);

  return (
    <form onSubmit={handleSubmit} className="registration-form" data-testid="registration-form">
      <h2 data-testid="registration-title">Inscription</h2>
      <div className="form-group">
        <label htmlFor="firstName">Prénom</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'error' : ''}
          data-testid="input-firstName"
        />
        {errors.firstName && <span className="error-message" data-testid="error-firstName">{errors.firstName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Nom</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'error' : ''}
          data-testid="input-lastName"
        />
        {errors.lastName && <span className="error-message" data-testid="error-lastName">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          data-testid="input-email"
        />
        {errors.email && <span className="error-message" data-testid="error-email">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="birthDate">Date de naissance</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className={errors.birthDate ? 'error' : ''}
          data-testid="input-birthDate"
        />
        {errors.birthDate && <span className="error-message" data-testid="error-birthDate">{errors.birthDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="city">Ville</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={errors.city ? 'error' : ''}
          data-testid="input-city"
        />
        {errors.city && <span className="error-message" data-testid="error-city">{errors.city}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="postalCode">Code postal</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          className={errors.postalCode ? 'error' : ''}
          data-testid="input-postalCode"
        />
        {errors.postalCode && <span className="error-message" data-testid="error-postalCode">{errors.postalCode}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            data-testid="input-password"
            onBlur={() => setPasswordTouched(true)}
            required
          />
          <span
            onClick={() => setShowPassword(v => !v)}
            style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', color: '#8b0000' }}
            data-testid="toggle-password-visibility"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <ul className="password-rules">
          {passwordRules.map((rule, idx) => (
            <li key={idx} style={{ color: rule.valid ? 'green' : '#8b0000', fontWeight: rule.valid ? 'bold' : 'normal' }}>
              {rule.valid ? '✔️' : '❌'} {rule.label}
            </li>
          ))}
        </ul>
        {errors.password && <span className="error-message" data-testid="error-password">{errors.password}</span>}
      </div>

      <button type="submit" disabled={!isFormValid} data-testid="submit-registration">
        Sauvegarder
      </button>
    </form>
  );
};

export default RegistrationForm;
