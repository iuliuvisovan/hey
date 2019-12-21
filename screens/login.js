import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Keyboard, AsyncStorage, Dimensions, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
moment.locale('ro');
import styles from './styles';

const useRemote = true;
const baseUrl = useRemote ? 'https://hey-server.herokuapp.com' : 'http://192.168.1.117:3000';

export default class App extends Component {
  state = {
    registrationNumber: ''
  };

  submit = () => {
    const { registrationNumber } = this.state;
    if ((registrationNumber || '').trim().length < 6) return;
    if (/[A-Z]/.test(registrationNumber) && /[0-9]/.test(registrationNumber) && !/\s/.test(registrationNumber)) {
      Alert.alert(
        'Confirma',
        `${registrationNumber}\n\nE ok acest numar? \n(va fi folosit de alti soferi ca sa te contacteze)`,
        [
          { text: 'Nu, hopa', onPress: () => {} },
          {
            text: 'Da',
            onPress: this.register
          }
        ],
        { cancelable: false }
      );
    }
  };

  register = async () => {
    const { registrationNumber } = this.state;
    AsyncStorage.setItem('registrationNumber', registrationNumber);
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.container} onTouchStart={Keyboard.dismiss}>
        <View style={{ marginTop: 100, alignItems: 'center' }}>
          <Text>Introdu numarul de inmatriculare al masinii tale:</Text>
          <TextInput
            onChangeText={text => this.setState({ registrationNumber: text.toUpperCase() })}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="e.g. BZ63VMD"
          />
          <Button color="#00bcd4" onPress={this.submit} title="Salveaza" />
        </View>
      </View>
    );
  }
}
