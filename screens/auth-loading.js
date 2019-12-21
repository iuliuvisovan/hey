import { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';
import Constants from 'expo-constants';

const useRemote = Constants.appOwnership === 'expo';
global.baseUrl = useRemote ? 'https://hey-server.herokuapp.com' : 'http://127.0.0.1:3000';

export default class AuthLoading extends Component {
  async componentDidMount() {
    // await AsyncStorage.clear();
    const registrationNumber = await AsyncStorage.getItem('registrationNumber');
    if (registrationNumber) {
      global.registrationNumber = registrationNumber;
      this.setupNotifications();
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  setupNotifications = () => {
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('messages', {
        name: 'Messages from drivers',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 1000]
      });
    }
  };

  render() {
    return null;
  }
}
