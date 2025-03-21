import { calculateAge } from './module';
let person;

beforeEach(() => {
    const date = new Date();
    person = {
        birth: new Date(date.setFullYear(date.getFullYear() - 20))
    };
});

describe('calculateAge', () => {
    it('calcule correctement l\'âge d\'une personne', () => {
        // L'âge de Loïse est de 33 ans
        expect(calculateAge(person)).toEqual(20);
    });

    describe('Cas d\'erreur', () => {
        it('devrait lever une erreur quand aucun argument n\'est fourni', () => {
            expect(() => {
                calculateAge();
            }).toThrow('Argument requis');
        });

        it('devrait lever une erreur quand l\'argument n\'est pas un objet', () => {
            const invalidInputs = [
                { input: 42, type: 'number' },
                { input: 'string', type: 'string' },
                { input: true, type: 'boolean' },
                { input: null, type: 'null' },
                { input: undefined, type: 'undefined' }
            ];
            
            // Les arguments suivants ne sont pas des objets
            invalidInputs.forEach(({ input }) => {
                expect(() => {
                    calculateAge(input);
                }).toThrow('L\'argument doit être un objet');
            });
        });

        it('devrait lever une erreur quand l\'objet ne contient pas un champ birth', () => {
            const person = {
                name: 'John',
                age: 30
            };
            expect(() => {
                calculateAge(person);
            }).toThrow('L\'objet doit contenir une propriété birth');
        });

        it('devrait lever une erreur quand birth n\'est pas un objet Date', () => {
            const invalidBirthTypes = [
                { birth: '2000-01-01' },
                { birth: 946684800000 },
                { birth: { year: 2000, month: 1, day: 1 } },
                { birth: null },
                { birth: undefined }
            ];

            // Les valeurs suivantes ne sont pas des objets Date
            invalidBirthTypes.forEach(person => {
                expect(() => {
                    calculateAge(person);
                }).toThrow('La propriété birth doit être un objet Date');
            });
        });

        it('devrait lever une erreur pour des dates invalides', () => {
            const invalidDates = [
                { birth: new Date('invalid') },
                { birth: new Date('2000-13-45') },
                { birth: new Date(NaN) }
            ];

            // Les dates suivantes sont invalides
            invalidDates.forEach(person => {
                expect(() => {
                    calculateAge(person);
                }).toThrow('La date fournie est invalide');
            });
        });
    });
});