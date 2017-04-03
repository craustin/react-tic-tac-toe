import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Home = () => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to React</h2>
    </div>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
  </div>
)

const About = () => <div>About</div>

class App extends Component {
  render() {
    return (
      <div>
        {this.renderRoute()}
      </div>
    );
  }

  renderRoute() {
    switch (window.location.pathname) {
      case '/': return <Home />;
      case '/about': return <About />;
      default: throw new Error('bad route');
    }
  }
}

export default App;
