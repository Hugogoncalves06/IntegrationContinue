import { countUsers, getAllUsers } from './api';
import axios from 'axios';
jest.mock('axios');

describe('countUsers', () => {
  it('fetches erroneously data from an API', async () => {
    const errorMessage = 'Network Error';

    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage)),
    );

    await expect(countUsers()).rejects.toThrow(errorMessage);
  });
});

describe('getAllUsers', () => {
  it('fetches successfully data from an API', async () => {
    const data = {
      data: {
        utilisateurs: [
          {
            id: '1',
            nom: 'a',
            prenom: 'b',
            email: 'c@c.fr'
          }
        ],
      },
    };

    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    await expect(getAllUsers()).resolves.toEqual(data.data.utilisateurs);
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.REACT_APP_PYTHON_API}/users`,
    );
  });

  it('fetches erroneously data from an API', async () => {
    const errorMessage = 'Network Error';

    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage)),
    );

    await expect(getAllUsers()).rejects.toThrow(errorMessage);
  });
});
