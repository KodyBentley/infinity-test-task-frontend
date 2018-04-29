import * as React from 'react';
import FormComponent from './components/formComponent';

import './styles/App.css';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Form Component Test Task</h1>
        </header>
        <FormComponent/>
      </div>
    );
  }
}

export default App;
