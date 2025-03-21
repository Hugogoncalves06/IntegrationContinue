/**
 * Calculate the age of a person from their birth date
 * 
 * @param {Object} p - person object with a birth property of type Date
 * @returns {Number} The age of the person
 * @throws {Error} If the input is invalid
 */
function calculateAge(p) {
    // Vérification si l'argument est fourni
    if (arguments.length === 0) {
        throw new Error('Argument requis');
    }

    // Vérification si l'argument est un objet
    if (typeof p !== 'object' || p === null) {
        throw new Error('L\'argument doit être un objet');
    }

    // Vérification si l'objet contient la propriété birth
    if (!p.hasOwnProperty('birth')) {
        throw new Error('L\'objet doit contenir une propriété birth');
    }

    // Vérification si birth est un objet Date
    if (!(p.birth instanceof Date)) {
        throw new Error('La propriété birth doit être un objet Date');
    }

    // Vérification si la date est valide
    if (isNaN(p.birth.getTime())) {
        throw new Error('La date fournie est invalide');
    }

    let dateDiff = new Date(Date.now() - p.birth.getTime());
    let age = dateDiff.getUTCFullYear() - 1970;
    return age;
}

module.exports = { calculateAge };