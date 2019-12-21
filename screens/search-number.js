import React, { version } from 'react';
import { Text, View, TextInput, Keyboard, AsyncStorage, Alert } from 'react-native';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class App extends React.Component {
  state = {
    query: '',
    availableNumbers: []
  };

  componentDidMount() {
    this.loadAvailableNumbers();
  }

  selectNumber = () => {
    this.props.navigation.navigate('SelectMessage', { carNumber: this.state.query.trim() });
  };

  contactDriver = () => {
    const { targetText } = this.state;
    if ((targetText || '').trim().length < 6) return;
    if (/[A-Z]/.test(targetText) && /[0-9]/.test(targetText)) {
      this.setState({ query: targetText });
    }
  };

  sendMessage = async () => {
    let sentMessages = await AsyncStorage.getItem('sentMessages');
    if (!sentMessages) sentMessages = [];
    else sentMessages = JSON.parse(sentMessages);

    const { query } = this.state;

    const messagesInLastHour = sentMessages.filter(x => +new Date() - +x.dateTimestamp < 1000 * 60 * 60);
    const messagesInLastHourToThisGuy = messagesInLastHour.filter(x => x.query == query);

    if (messagesInLastHourToThisGuy.length > 5 || messagesInLastHour.length > 10) {
      Alert.alert('Eroare', `Ai trimis prea multe mesaje in ultima vreme.`);
      return;
    }
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    const message = this.state.messages.find(x => x.selected);
    Alert.alert(`Mesaj trimis catre ${query}:`, `${message.text}`);

    sentMessages.push({ query, message, dateTimestamp: +new Date() });
    AsyncStorage.setItem('sentMessages', JSON.stringify(sentMessages));
    (this.state.messages.find(x => x.selected) || {}).selected = false;
    this.setState({});
  };

  loadAvailableNumbers = async () => {
    const availableNumbers = await (await fetch(global.baseUrl + '/availableNumbers')).json();
    this.setState({ availableNumbers });
  };

  addNewNumber = () => {
    console.log('this.state.query', this.state.query);

    this.props.navigation.navigate('AddNewNumber', {
      targetCarNumber: this.state.query,
      onSave: this.loadAvailableNumbers
    });
  };

  render() {
    const { query, availableNumbers } = this.state;

    const matches = availableNumbers.filter(x => x.toLowerCase().includes(query.trim().toLowerCase()));

    return (
      <View style={styles.container} onTouchStart={Keyboard.dismiss}>
        <View style={{ marginTop: 25, alignItems: 'center' }}>
          <TextInput
            value={query}
            onChangeText={text => this.setState({ query: text })}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="e.g. BZ63VMD"
          />
        </View>
        <View style={styles.numberList}>
          {query.length > 6 && (
            <>
              {matches.map(x => (
                <Number key={x} number={x} isAvailable onPress={this.selectNumber} />
              ))}
              {!matches.length && <Number number={query} onPress={this.addNewNumber} />}
            </>
          )}
        </View>
      </View>
    );
  }
}

const Number = ({ number, isAvailable, onPress }) => (
  <View style={styles.number}>
    <Text style={{ fontSize: 24 }}>{number}</Text>
    <Text style={{ color: 'darkgrey', fontSize: 12 }}>{isAvailable ? 'Disponibil' : 'Indisponibil'}</Text>
    {isAvailable ? (
      <TouchableOpacity onPress={onPress} style={styles.contactButton}>
        <Text style={styles.contactLabel}>TRIMITE MESAJ</Text>
      </TouchableOpacity>
    ) : (
      <>
        <Text style={{ marginTop: 16 }}>Acest numar nu este disponibil inca.</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.addButton}>Doresti sa-l adaugi?</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);
