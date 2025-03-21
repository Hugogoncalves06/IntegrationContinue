import {

isOver18,
isValidPostalCode,
isValidName,
isValidEmail,
areAllFieldsFilled,
validateForm
} from './validation';

describe('Validation Utils', () => {
describe('isOver18', () => {
  test('returns true for a date of birth 18 years ago or more', () => {
    const birthDate = new Date(new Date().getFullYear() - 18, 0, 1).toISOString();
    expect(isOver18(birthDate)).toBe(true);
  });

  test('returns false for a date of birth less than 18 years ago', () => {
    const birthDate = new Date(new Date().getFullYear() - 17, 0, 1).toISOString();
    expect(isOver18(birthDate)).toBe(false);
  });
});

test('calcule correctement l\'âge quand l\'anniversaire n\'est pas encore passé cette année', () => {
  const today = new Date();
  const futureMonth = today.getMonth() + 1;
  const birthDate = new Date(today.getFullYear() - 18, futureMonth, today.getDate()).toISOString();
  expect(isOver18(birthDate)).toBe(false); // devrait retourner false car l'anniversaire n'est pas encore passé
});

test('calcule correctement l\'âge quand l\'anniversaire est dans le même mois mais pas encore passé', () => {
  const today = new Date();
  const futureDayInCurrentMonth = today.getDate() + 1;
  const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), futureDayInCurrentMonth).toISOString();
  expect(isOver18(birthDate)).toBe(false); // devrait retourner false car l'anniversaire n'est pas encore passé
});

describe('isValidPostalCode', () => {
  test('returns true for a valid postal code', () => {
    expect(isValidPostalCode('75000')).toBe(true);
  });

  test('returns false for an invalid postal code', () => {
    expect(isValidPostalCode('abc')).toBe(false);
    expect(isValidPostalCode('1234')).toBe(false);
    expect(isValidPostalCode('123456')).toBe(false);
  });
});

describe('isValidName', () => {
  test('returns true for a valid name', () => {
    expect(isValidName('John')).toBe(true);
    expect(isValidName('Jean-Pierre')).toBe(true);
    expect(isValidName('Éléonore')).toBe(true);
  });

  test('returns false for an invalid name', () => {
    expect(isValidName('123')).toBe(false);
    expect(isValidName('')).toBe(false);
    expect(isValidName('John123')).toBe(false);
  });
});

describe('isValidEmail', () => {
  test('returns true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('returns false for an invalid email', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('test@com')).toBe(false);
  });
});

describe('areAllFieldsFilled', () => {
  test('returns true when all fields are filled', () => {
    const fields = { firstName: 'John', lastName: 'Doe', email: 'test@example.com' };
    expect(areAllFieldsFilled(fields)).toBe(true);
  });

  test('returns false when at least one field is empty', () => {
    const fields = { firstName: 'John', lastName: '', email: 'test@example.com' };
    expect(areAllFieldsFilled(fields)).toBe(false);
  });
});

describe('validateForm', () => {
  test('returns an empty object when all fields are valid', () => {
    const fields = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      birthDate: new Date(new Date().getFullYear() - 18, 0, 1).toISOString(),
      postalCode: '75000',
      city: 'Paris'
    };
    expect(validateForm(fields)).toEqual({});
  });

  test('returns errors for invalid fields', () => {
    const fields = {
      firstName: '123',
      lastName: '123',
      email: 'invalid-email',
      birthDate: new Date(new Date().getFullYear() - 17, 0, 1).toISOString(),
      postalCode: 'abc',
      city: ''
    };
    expect(validateForm(fields)).toEqual({
      firstName: 'Le prénom n\'est pas valide',
      lastName: 'Le nom n\'est pas valide',
      email: 'L\'email n\'est pas valide',
      birthDate: 'Vous devez avoir au moins 18 ans',
      postalCode: 'Le code postal n\'est pas valide',
      city: 'La ville est requise'
    });
  });
});
});