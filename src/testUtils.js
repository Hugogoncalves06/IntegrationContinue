import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * Fonction utilitaire pour rendre les composants avec le router dans les tests
 * @param {JSX.Element} ui - Le composant à rendre
 * @param {Object} options - Options de configuration
 * @param {string} [options.route='/IntegrationContinue'] - La route initiale
 * @param {string} [options.basename='/IntegrationContinue'] - Le basename du router
 * @returns {Object} Les résultats du render
 */
export const renderWithRouter = (
  ui,
  {
    route = '/IntegrationContinue/login',
    basename = '/IntegrationContinue',
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
