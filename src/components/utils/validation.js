/**
 * Vérifie si une date de naissance correspond à un âge supérieur ou égal à 18 ans
 * @param {Date} birthDate - La date de naissance à vérifier
 * @returns {boolean} - True si l'âge est >= 18 ans, false sinon
 */
export const isOver18 = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 18;
};

/**
 * Vérifie si une chaîne correspond à un code postal français valide
 * @param {string} postalCode - Le code postal à vérifier
 * @returns {boolean} - True si le format est valide, false sinon
 */
export const isValidPostalCode = (postalCode) => {
  return /^[0-9]{5}$/.test(postalCode);
};

/**
 * Vérifie si une chaîne est un nom valide (lettres, accents, tirets)
 * @param {string} name - Le nom à vérifier
 * @returns {boolean} - True si le format est valide, false sinon
 */
export const isValidName = (name) => {
  return /^[a-zàáâäçèéêëìíîïñòóôöùúûüýÿæœ\-\s']+$/i.test(name);
};

/**
 * Vérifie si une chaîne est une adresse email valide
 * @param {string} email - L'email à vérifier
 * @returns {boolean} - True si le format est valide, false sinon
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Vérifie si tous les champs requis sont remplis
 * @param {Object} fields - Objet contenant les valeurs des champs
 * @returns {boolean} - True si tous les champs sont remplis, false sinon
 */
export const areAllFieldsFilled = (fields) => {
  return Object.values(fields).every(value => value.trim() !== '');
};

/**
 * Valide tous les champs du formulaire
 * @param {Object} fields - Objet contenant les valeurs des champs
 * @returns {Object} - Objet contenant les erreurs pour chaque champ
 */
export const validateForm = (fields) => {
  const errors = {};

  if (!isValidName(fields.firstName)) {
    errors.firstName = 'Le prénom n\'est pas valide';
  }

  if (!isValidName(fields.lastName)) {
    errors.lastName = 'Le nom n\'est pas valide';
  }

  if (!isValidEmail(fields.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }

  if (!isOver18(fields.birthDate)) {
    errors.birthDate = 'Vous devez avoir au moins 18 ans';
  }

  if (!isValidPostalCode(fields.postalCode)) {
    errors.postalCode = 'Le code postal n\'est pas valide';
  }

  if (!fields.city.trim()) {
    errors.city = 'La ville est requise';
  }

  return errors;
};
