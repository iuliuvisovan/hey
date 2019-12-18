import React from 'react';
import {
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  Keyboard,
  AsyncStorage,
  Platform,
  AppState,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Notifications } from 'expo';
import moment from 'moment';
import styles from './styles';
import * as locales from 'moment/min/locales';
moment.locale('ro');

const useRemote = true;
const baseUrl = useRemote ? 'https://hey-server.herokuapp.com' : 'http://192.168.1.117:3000';

export default class App extends React.Component {
  state = {
    text: '',
    targetText: '',
    registrationNumber: '',
    targetRegistrationNumber: '',
    receivedMessages: [],
    messages: [
      {
        id: 0,
        text: 'Mersi!'
      },
      {
        id: 1,
        text: 'Scuze!'
      },
      {
        id: 2,
        text: 'Ai parcat pe locul meu si am nevoie de el. Te rog sa vii sa-ti muti masina cat mai repede!'
      },
      {
        id: 3,
        text: 'Ai parcat prost si ii incurci pe ceilalti! Ar fi bine sa-ti muti masina!'
      },
      {
        id: 4,
        text:
          'Ar trebui sa vii la masina cat mai repede! (ai uitat geamul deschis, politie, cheia in contact, bunuri, etc.)'
      },
      {
        id: 5,
        text: 'Vin acum!'
      }
    ],
    appState: AppState.currentState
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      setTimeout(() => {
        this.loadMessages();
      }, 500);
    }
    this.setState({ appState: nextAppState });
  };

  async componentDidMount() {
    setTimeout(this.loadMessages, 0);

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  loadMessages = async () => {
    this.setState({ refreshing: true });
    const receivedMessages = await (
      await fetch(`${baseUrl}/my-messages?registrationNumber=${global.registrationNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).json();
    if (receivedMessages.length)
      receivedMessages.sort((a, b) => +new Date(b.date) - +new Date(a.date))[0].expanded = true;
    this.setState({ receivedMessages, refreshing: false });
  };

  contactDriver = () => {
    const { targetText } = this.state;
    if ((targetText || '').trim().length < 6) return;
    if (/[A-Z]/.test(targetText) && /[0-9]/.test(targetText)) {
      this.setState({ targetRegistrationNumber: targetText });
    }
  };

  selectMessage = id => {
    (this.state.messages.find(x => x.selected) || {}).selected = false;
    const message = this.state.messages.find(x => x.id == id);
    if (message) message.selected = !message.selected;
    this.setState({});
  };

  sendMessage = async () => {
    let sentMessages = await AsyncStorage.getItem('sentMessages');
    if (!sentMessages) sentMessages = [];
    else sentMessages = JSON.parse(sentMessages);

    const { targetRegistrationNumber } = this.state;

    const messagesInLastHour = sentMessages.filter(x => +new Date() - +x.dateTimestamp < 1000 * 60 * 60);
    const messagesInLastHourToThisGuy = messagesInLastHour.filter(
      x => x.targetRegistrationNumber == targetRegistrationNumber
    );

    if (messagesInLastHourToThisGuy.length > 5 || messagesInLastHour.length > 10) {
      Alert.alert('Eroare', `Ai trimis prea multe mesaje in ultima vreme.`);
      return;
    }
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    const message = this.state.messages.find(x => x.selected);
    const response = await fetch(`${baseUrl}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetRegistrationNumber,
        message: message.text,
        sourceRegistrationNumber: global.registrationNumber
      })
    });
    Alert.alert(`Mesaj trimis catre ${targetRegistrationNumber}:`, `${message.text}`);

    sentMessages.push({ targetRegistrationNumber, message, dateTimestamp: +new Date() });
    AsyncStorage.setItem('sentMessages', JSON.stringify(sentMessages));
    (this.state.messages.find(x => x.selected) || {}).selected = false;
    this.setState({});
  };

  cancel = () => {
    (this.state.messages.find(x => x.selected) || {}).selected = false;
    this.setState({ targetRegistrationNumber: '' });
  };

  expandMessage = _id => {
    (this.state.receivedMessages.find(x => x.expanded && x._id != _id) || {}).expanded = false;
    const message = this.state.receivedMessages.find(x => x._id == _id);
    if (message) message.expanded = !message.expanded;
    this.setState({});
  };

  replyToDriver = targetRegistrationNumber => {
    this.setState({ targetRegistrationNumber });
  };

  render() {
    const { registrationNumber, receivedMessages, targetRegistrationNumber, messages } = this.state;
    return (
      <View style={styles.wrapper} onTouchStart={Keyboard.dismiss}>
        <View style={styles.topWrapper}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadMessages} />}
            style={styles.receivedMessagesWrapper}
          >
            {receivedMessages
              .sort((a, b) => +new Date(b.date) - +new Date(a.date))
              .map((x, i) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.expandMessage(x._id)}
                  style={styles.receivedMessageWrapper}
                  key={x._id}
                >
                  <Text style={styles.receivedMessageInfo}>
                    Acum {moment.duration(moment(x.date).diff(moment())).humanize()} - de la{' '}
                    {x.sourceRegistrationNumber}
                  </Text>
                  <Text style={styles.receivedMessage}>{x.message}</Text>
                  {x.expanded && (
                    <View style={{ marginTop: 10 }}>
                      <Button
                        color="#00bcd4"
                        onPress={() => this.replyToDriver(x.sourceRegistrationNumber)}
                        title="Raspunde"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </ScrollView>
          {Boolean(targetRegistrationNumber) && (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text>
                <Text style={{}}>Trimite un mesaj lui </Text>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{targetRegistrationNumber}</Text>
              </Text>
              <Text style={{ marginTop: 10 }}>Selecteaza:</Text>
              <ScrollView style={styles.messagesWrapper}>
                {messages.map(x => (
                  <TouchableOpacity activeOpacity={1} key={x.id} onPress={() => this.selectMessage(x.id)}>
                    <Text style={[styles.message, x.selected ? { backgroundColor: '#00bcd4', fontWeight: '500' } : {}]}>
                      {x.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.buttonsWrapper}>
                <Button color="#788190" onPress={this.cancel} title="Inapoi" />
                <Button
                  disabled={!this.state.messages.some(x => x.selected)}
                  color="#00bcd4"
                  onPress={this.sendMessage}
                  title="Trimite"
                />
              </View>
            </View>
          )}
        </View>
        <Text style={{ paddingVertical: 8 }}>Tu vei fi contactat la acest numar: {global.registrationNumber}</Text>
      </View>
    );
  }
}
