import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GeoHealthMap</h1>
        <p>Coğrafi verilerle sağlık tesislerini keşfedin.</p>
      </header>
      <main className="App-main">
        <MapComponent />
      </main>
    </div>
  );
}

export default App;
