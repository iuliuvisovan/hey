import React, { Component } from 'react';
import MessageScreen from './screens/messages';
import SendMessageScreen from './screens/send';
import LoginScreen from './screens/login';
import AuthLoadingScreen from './screens/auth-loading';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

const MainTabNavigator = createAppContainer(
  createBottomTabNavigator({
    Mesaje: {
      screen: MessageScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name="ios-chatboxes" size={30} color={focused ? "#00bcd4": "#717171"} />,
      }
    },
    Contacteaza: {
      screen: SendMessageScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name="ios-send" size={30} color={focused ? "#00bcd4": "#717171"} />
      }
    }
  }, {
    tabBarOptions: {
      activeTintColor: '#00bcd4',
      inactiveTintColor: "#717171"
    }
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
