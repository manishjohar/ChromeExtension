import React, {Component} from 'react';
import './App.css';

function App() {
  socketRequest({d:'dads'});
  return (
    <div className="App">
      <div className='header headColor'>
          WatchMe
      </div>
        <div className='body bodyColor'>
            Hi this is body
        </div>
    </div>
  );
}

export default App;
