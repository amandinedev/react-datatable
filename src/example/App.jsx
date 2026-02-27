import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './reduxFeatures/store.js';
import Router from './components/Router/Router.jsx';
import './sass/index.scss';


const root = document.getElementById("root");

function App() {
  return (
    <>
      <Router/>
    </>
  );
}

export default App;

createRoot(root).render(
  <StrictMode>
      <Provider store={store}>
    <App/>
    </Provider>
  </StrictMode>
)