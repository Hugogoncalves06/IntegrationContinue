import axios from 'axios';
const API = process.env.PYTHON_APP_API_BASE_URL || 'http://localhost:8000/api';


/**
 * Fetches the list of users from the API and returns the count of users.
 *
 * @async
 * @function countUsers
 * @returns {Promise<number>} The number of users retrieved from the API.
 * @throws {Error} Throws an error if the API request fails.
 */
export const countUsers = async () => {
    try {
        console.log('API URL:', API);
        const response = await axios.get(`${API}/users`);
        return response.data.length;
    } catch (error) {
        //console.error(error);
        throw error;
    }
}


export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API}/users`);
        return response.data;
    } catch (error) {
        //console.error(error);
        throw error;
    }
}