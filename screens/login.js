import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard, AsyncStorage, Alert } from 'react-native';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Login extends Component {
  state = {
    registrationNumber: ''
  };

  componentDidMount() {
    const targetCarNumber = this.props.navigation.getParam('targetCarNumber');
    if (targetCarNumber) {
      this.setState({ registrationNumber: targetCarNumber });
    }
  }

  submit = () => {
    if (this.isSaveButtonDisabled()) {
      return;
    }

    const { registrationNumber, phoneNumber } = this.state;

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
    setTimeout(() => {
      this.props.navigation.goBack();
      this.props.navigation.getParam('onSave')();
    }, 0);
  };

  isSaveButtonDisabled = () => {
    const { registrationNumber, phoneNumber } = this.state;

    if ((phoneNumber || '').trim().length < 10) {
      return true;
    }
    if ((phoneNumber || '').includes('+')) {
      if ((phoneNumber || '').trim().length < 12) {
        return true;
      }
    }
    if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phoneNumber)) {
      return true;
    }
    if ((registrationNumber || '').trim().startsWith('B')) {
      if ((registrationNumber || '').trim().length < 6) {
        return true;
      }
    } else {
      if ((registrationNumber || '').trim().length < 7) {
        return true;
      }
    }

    if ((registrationNumber || '').trim().length > 8) {
      return true;
    }

    if (!(/[A-Z]/.test(registrationNumber) && /[0-9]/.test(registrationNumber) && !/\s/.test(registrationNumber))) {
      return true;
    }
  };

  render() {
    const targetCarNumber = this.props.navigation.getParam('targetCarNumber');

    console.log('targetCarNumber', targetCarNumber);

    return (
      <View style={styles.container} onTouchStart={Keyboard.dismiss}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.label}>Introdu numarul de inmatriculare al masinii{targetCarNumber ? '' : ' tale'}:</Text>
          <TextInput
            value={this.state.registrationNumber}
            onChangeText={text => this.setState({ registrationNumber: (text || '').trim().toUpperCase() })}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="e.g. BZ63VMD"
          />
          <Text style={styles.label}>Introdu numarul de telefon:</Text>
          <TextInput
            onChangeText={text => this.setState({ phoneNumber: (text || '').trim().toUpperCase() })}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="e.g. +40745263009"
          />
          <TouchableOpacity
            disabled={this.isSaveButtonDisabled()}
            onPress={this.submit}
            style={[styles.contactButton, { backgroundColor: this.isSaveButtonDisabled() ? 'gray' : '#5DBCD2' }]}
          >
            <Text style={styles.contactLabel}>Salveaza</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
