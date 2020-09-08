import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import HomePage from './components/HomePage'
import About from './components/About'
import Footer from './components/Footer'
import NavBar from './components/Navbar'
import Chores from './components/Chores'
import './App.css';
import CreateGroup from './components/CreateGroup';
import GroupUrl from './components/GroupUrl';
import Accept from './components/Accept'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Switch from '@material-ui/core/Switch';

const PrivateRoute = ({ component: Component, ...rest}) => {
  const user = localStorage.getItem('jwtToken')
  return <Route {...rest} render={(props) => {
    return user ? <Component {...rest} {...props} /> : <Redirect to="/login" />
  }} />
}

function App() {
  const [darkMode, setDarkMode] = useState(false); 
  const theme = createMuiTheme({
      palette: {
        primary: {
          main: blue[700],
        },
        secondary: {
          main: '#a2a3ac',
        },
        success: {
          main: '#66BB6A',
        },
        //if dark mode is true then have the type be dark, if not default to light
        type: darkMode ? "dark" : "light",
      },
    });

  const [currentUser, setCurrentUser] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    let token
    if(!localStorage.getItem('jwtToken')) {
      setIsAuthenticated(false)
    } else {
      token = jwt_decode(localStorage.getItem('jwtToken'))
      setAuthToken(localStorage.jwtToken)
      setCurrentUser(token)
      setIsAuthenticated(true)
    }
  }, [])

  const nowCurrentUser = (userData) => {
    console.log('nowCurrentUser is working...')
    setCurrentUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    if(localStorage.getItem('jwtToken')){
      localStorage.removeItem('jwtToken')
      setCurrentUser(null)
      setIsAuthenticated(false)
    }
  }

  console.log('Current User', currentUser);
  console.log('Authenicated', isAuthenticated);
  
  return (
    <div>
      <ThemeProvider theme={theme}>
      {/* <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)}/> */}
      <NavBar handleLogout={handleLogout} isAuth={isAuthenticated}/>
      <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)}/>
      <div className="">
          <Route path="/register" component={ Register } />
          <Route
            path="/login"
            render={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser} />}
          />
          {/* Need to add a CreateGroup route somehwere here...might also be a nav */}
          <Route path="/about" component={ About } />
          <Route path="/accept" component={ Accept }/>
          <Route path="/groupurl" component={ GroupUrl }/>
          <Route path="/creategroup" component={ CreateGroup }/>
          <Route path="/chores" component={ Chores } user={currentUser} />
          <PrivateRoute path="/profile" component={ Profile } user={currentUser} />
          {/* <PrivateRoute path="/chores" componenet={ Chores } user={currentUser} /> */}
          <Route exact path="/" component={ HomePage } />
      </div>
      <Footer />
      </ThemeProvider>
    </div>
  );
}

export default App;