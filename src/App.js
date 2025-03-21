import React, { useState } from 'react';
import RegistrationForm from './components/forms/RegistrationForm';
import Toastr from './components/toastr/Toastr';
import './App.css';

function App() {
  const [successful, setSuccessful] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Formulaire d'enregistrement</h1>
      </header>
      <main>
        <RegistrationForm setSuccessful={setSuccessful} />
        {successful && <Toastr setSuccessful={setSuccessful} />}
      </main>
    </div>
  );
}

export default App;
