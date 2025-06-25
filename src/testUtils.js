import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Fonction utilitaire pour rendre les composants avec le router dans les tests
 * @param {JSX.Element} ui - Le composant à rendre
 * @param {Object} options - Options de configuration
 * @param {string} [options.route='/login'] - La route initiale
 * @param {string} [options.basename='/'] - Le basename du router
 * @returns {Object} Les résultats du render
 */
export const renderWithRouter = (
  ui,
  {
    route = '/login',
    basename = '/',
    ...renderOptions
  } = {}
) => {
  window.history.pushState({}, 'Test page', route);
  
  const Wrapper = ({ children }) => (
    <MemoryRouter basename={basename}>
      {children}
    </MemoryRouter>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
