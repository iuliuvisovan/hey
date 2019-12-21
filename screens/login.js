import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Keyboard,
  AsyncStorage,
  Dimensions,
  Alert,
  TouchableOpacityBase
} from 'react-native';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
moment.locale('ro');
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class App extends Component {
  state = {
    registrationNumber: ''
  };

  submit = () => {
    const { registrationNumber, phoneNumber } = this.state;
    if ((registrationNumber || '').trim().length < 6) return;
    if (/[A-Z]/.test(registrationNumber) && /[0-9]/.test(registrationNumber) && !/\s/.test(registrationNumber)) {
      Alert.alert(
        'Verifica datele',
        `\nNr. inmatriculare:\n${registrationNumber}\n\nTelefon:\n${phoneNumber}`,
        [
          { text: 'Nu, hopa', onPress: () => {}, style: 'cancel' },
          {
            text: 'Sunt corecte',
            onPress: this.register
          }
        ],
        { cancelable: false }
      );
    }
  };

  register = async () => {
    const { registrationNumber, phoneNumber } = this.state;
    AsyncStorage.setItem('registrationNumber', registrationNumber);
    await fetch(global.baseUrl + '/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ registrationNumber, phoneNumber })
    });
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.container} onTouchStart={Keyboard.dismiss}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.label}>Introdu numarul de inmatriculare al masinii tale:</Text>
          <TextInput
            onChangeText={text => this.setState({ registrationNumber: text.toUpperCase() })}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="e.g. BZ63VMD"
          />
          <Text style={styles.label}>Introdu numarul de telefon:</Text>
          <TextInput
            onChangeText={text => this.setState({ phoneNumber: text.toUpperCase() })}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="e.g. +40745263009"
          />
          <TouchableOpacity onPress={this.submit} style={styles.contactButton}>
            <Text style={styles.contactLabel}>Salveaza</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
