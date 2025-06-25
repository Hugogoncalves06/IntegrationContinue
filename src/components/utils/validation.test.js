import {

isOver18,
isValidPostalCode,
isValidName,
isValidEmail,
areAllFieldsFilled,
validateForm
} from './validation';

  describe('isOver18', () => {
    test('returns true for a date of birth 18 years ago or more', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      expect(isOver18(date.toISOString())).toBe(true);
    });
    test('returns false for a date of birth less than 18 years ago', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 17);
      expect(isOver18(date.toISOString())).toBe(false);
    });
    test('returns false for invalid date', () => {
      expect(isOver18('invalid-date')).toBe(false);
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
  });

  describe('isValidPostalCode', () => {
    test('returns true for valid French postal code', () => {
      expect(isValidPostalCode('75000')).toBe(true);
      expect(isValidPostalCode('13001')).toBe(true);
    });
    test('returns false for invalid postal code', () => {
      expect(isValidPostalCode('ABCDE')).toBe(false);
      expect(isValidPostalCode('123')).toBe(false);
      expect(isValidPostalCode('999999')).toBe(false);
    });
  });

  describe('isValidName', () => {
    test('returns true for valid names', () => {
      expect(isValidName('Jean-Pierre')).toBe(true);
      expect(isValidName('Élodie')).toBe(true);
      expect(isValidName('Olivier')).toBe(true);
    });
    test('returns false for names with numbers or symbols', () => {
      expect(isValidName('Jean123')).toBe(false);
      expect(isValidName('!@#')).toBe(false);
      expect(isValidName('')).toBe(false);
    });
  });
  describe('validateForm - city field', () => {
    it.each([
      [{ city: 'Paris' }, {}],
      [{ city: 'Marseille' }, {}],
      [{ city: 'Saint-Étienne' }, {}],
      [{ city: '12345' }, { city: 'La ville n\'est pas valide' }],
      [{ city: '' }, { city: 'La ville n\'est pas valide' }],
      [{ city: 'Paris123' }, { city: 'La ville n\'est pas valide' }],
      [{ city: 'Paris@' }, { city: 'La ville n\'est pas valide' }]
    ])('returns %o when city is %o', (fields, expected) => {
      const result = validateForm({ ...fields, firstName: 'John', lastName: 'Doe', email: 'test@example.com', birthDate: new Date(new Date().getFullYear() - 18, 0, 1).toISOString(), postalCode: 75000 });
      expect(result).toEqual(expected);
    });
  });
  describe('isValidEmail', () => {
    test('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('prenom.nom@domaine.fr')).toBe(true);
    });
    test('returns false for invalid emails', () => {
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('areAllFieldsFilled', () => {
    test('returns true if all fields are filled', () => {
      expect(areAllFieldsFilled({ a: '1', b: '2' })).toBe(true);
    });
    test('returns false if at least one field is empty', () => {
      expect(areAllFieldsFilled({ a: '1', b: '' })).toBe(false);
      expect(areAllFieldsFilled({ a: '', b: '' })).toBe(false);
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
        lastName: '',
        email: 'invalid',
        birthDate: '2020-01-01',
        city: '',
        postalCode: 'abc',
      };
      const errors = validateForm(fields);
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.birthDate).toBeDefined();
      expect(errors.city).toBeDefined();
      expect(errors.postalCode).toBeDefined();
    });
  });

  describe('Form Validation Edge Cases', () => {
      const validFormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        birthDate: '1990-01-01',
        city: 'Paris',
        postalCode: '75000'
      };

      it('handles special characters in names', () => {
        const data = { ...validFormData };
        
        // Valid special characters
        data.firstName = 'Jean-François';
        expect(validateForm(data).firstName).toBeUndefined();
        
        data.firstName = 'María José';
        expect(validateForm(data).firstName).toBeUndefined();
        
        // Invalid special characters
        data.firstName = 'John@Doe';
        expect(validateForm(data).firstName).toBeTruthy();
      });

      it('validates email format strictly', () => {
        const data = { ...validFormData };
        
        // Valid email variations
        data.email = 'user+tag@example.com';
        expect(validateForm(data).email).toBeUndefined();
        
        data.email = 'user.name@sub.domain.com';
        expect(validateForm(data).email).toBeUndefined();
        
        // Invalid email formats
        data.email = 'user@domain';
        expect(validateForm(data).email).toBeTruthy();
        
        data.email = 'user.domain.com';
        expect(validateForm(data).email).toBeTruthy();
      });

      it('validates age calculation precisely', () => {
        const data = { ...validFormData };
        const today = new Date();
        
        // Exactly 18 years ago
        const exactly18 = new Date(today);
        exactly18.setFullYear(today.getFullYear() - 18);
        data.birthDate = exactly18.toISOString().split('T')[0];
        expect(validateForm(data).birthDate).toBeUndefined();
        
        // One day less than 18 years
        const almost18 = new Date(exactly18);
        almost18.setDate(almost18.getDate() + 1);
        data.birthDate = almost18.toISOString().split('T')[0];
        expect(validateForm(data).birthDate).toBeTruthy();
      });

      it('validates postal code format strictly', () => {
        const data = { ...validFormData };
        
        // Valid French postal codes
        ['75001', '13100', '06000', '97400'].forEach(code => {
          data.postalCode = code;
          expect(validateForm(data).postalCode).toBeUndefined();
        });
        
        // Invalid formats
        ['750012', '7500', 'A7500', '75 000'].forEach(code => {
          data.postalCode = code;
          expect(validateForm(data).postalCode).toBeTruthy();
        });
      });
    });

  describe('validateForm - champs null/undefined', () => {
    it('gère les champs null ou undefined sans planter', () => {
      const base = {
        firstName: null, lastName: undefined, email: '', birthDate: '', city: null, postalCode: undefined
      };
      const errors = validateForm(base);
      expect(errors.firstName).toBeTruthy();
      expect(errors.lastName).toBeTruthy();
      expect(errors.city).toBeTruthy();
      expect(errors.postalCode).toBeTruthy();
    });
  });

  describe('areAllFieldsFilled - robustesse', () => {
    it('retourne false si un champ est 0 ou false', () => {
      expect(areAllFieldsFilled({ a: 0, b: 'ok' })).toBe(false);
      expect(areAllFieldsFilled({ a: false, b: 'ok' })).toBe(false);
    });
    it('retourne true si tous les champs sont non vides (string)', () => {
      expect(areAllFieldsFilled({ a: '0', b: 'false', c: 'ok' })).toBe(true);
    });
  });