import axios from 'axios';
//const port = process.env.REACT_APP_SERVER_PORT;
//const API = `http://localhost:${port}`;
const API = process.env.REACT_APP_SERVER_URL;


export const countUsers = async () => {
    try {
        const response = await axios.get(`${API}/users`);
        return response.data.utilisateurs.length;
    } catch (error) {
        //console.error(error);
        throw error;
    }
}


export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API}/users`);
        return response.data.utilisateurs;
    } catch (error) {
        //console.error(error);
        throw error;
    }
}