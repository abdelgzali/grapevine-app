import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Chat from './Chat';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

function App() {
  return ( 
    <div id="app">
      <main>
        <section>
          <h3>Grapes in the vine:</h3>
          <Chat></Chat>
        </section>
      </main>
    </div>
   );
}
 
export default App;

