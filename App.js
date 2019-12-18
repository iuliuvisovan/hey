import React, { Component } from 'react';
import MessageScreen from './screens/messages';
import SendMessageScreen from './screens/send';
import LoginScreen from './screens/login';
import AuthLoadingScreen from './screens/auth-loading';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const MainTabNavigator = createAppContainer(
  createBottomTabNavigator({
    Mesaje: MessageScreen,
    Contacteaza: SendMessageScreen
  })
);

class App extends Component {
  render() {
    return <MainTabNavigator />;
  }
}

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Login: LoginScreen,
    App
  })
);
