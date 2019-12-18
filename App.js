import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  Keyboard,
  AsyncStorage,
  Platform,
  Dimensions,
  AppState,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Notifications } from 'expo';
import Permissions from 'expo-permissions';
import moment from 'moment';
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
        text: 'Ar trebui sa vii la masina cat mai repede! (ai uitat geamul deschis, politie, cheia in contact, bunuri, etc.)'
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
    AppState.addEventListener('change', this._handleAppStateChange);

    // AsyncStorage.clear();
    const registrationNumber = await AsyncStorage.getItem('registrationNumber');
    if (registrationNumber) {
      this.setState({ registrationNumber });
      setTimeout(this.loadMessages, 0);
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('messages', {
        name: 'Messages from drivers',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 1000]
      });
    }
  }

  submit = () => {
    const { text } = this.state;
    if ((text || '').trim().length < 6) return;
    if (/[A-Z]/.test(text) && /[0-9]/.test(text) && !/\s/.test(text)) {
      Alert.alert(
        'Confirma',
        `${text}\n\nE ok acest numar? \n(va fi folosit de alti soferi ca sa te contacteze)`,
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
    const { text } = this.state;
    this.setState({ registrationNumber: text });
    AsyncStorage.setItem('registrationNumber', text);

    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registrationNumber: text,
        token
      })
    });

    setTimeout(this.loadMessages, 0);
  };

  loadMessages = async () => {
    this.setState({ refreshing: true });
    const receivedMessages = await (
      await fetch(`${baseUrl}/my-messages?registrationNumber=${this.state.registrationNumber}`, {
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
        sourceRegistrationNumber: this.state.registrationNumber
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
      <View style={styles.container} onTouchStart={Keyboard.dismiss}>
        {!registrationNumber ? (
          <View style={{ marginTop: 100, alignItems: 'center' }}>
            <Text>Introdu numarul de inmatriculare al masinii tale:</Text>
            <TextInput
              onChange={event => this.setState({ text: event.nativeEvent.text })}
              autoCapitalize="characters"
              style={styles.input}
              placeholder="e.g. BZ63VMD"
            />
            <Button color="#00bcd4" onPress={this.submit} title="Continua" />
          </View>
        ) : (
          <>
            {!Boolean(targetRegistrationNumber) && (
              <View style={styles.bottomWrapper}>
                <Text>Tu vei fi contactat la acest numar: {this.state.registrationNumber}</Text>
              </View>
            )}
            <View style={styles.accessedPageWrapper}>
              <View style={styles.topWrapper}>
                {!Boolean(targetRegistrationNumber) && (
                  <>
                    <Text>Contacteaza sofer:</Text>
                    <TextInput
                      onChange={event => this.setState({ targetText: event.nativeEvent.text })}
                      autoCapitalize="characters"
                      style={styles.input}
                      placeholder="e.g. CJ64SVM"
                    />
                    <Button
                      color="#00bcd4"
                      disabled={!this.state.targetText}
                      onPress={this.contactDriver}
                      title="Continua"
                    />
                    {Boolean(receivedMessages.length) && <Text style={{ marginTop: 25 }}>Mesaje primite:</Text>}
                    <ScrollView
                      refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadMessages} />
                      }
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
                  </>
                )}
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
                          <Text
                            style={[
                              styles.message,
                              x.selected ? { backgroundColor: '#00bcd4', fontWeight: '500' } : {}
                            ]}
                          >
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
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  receivedMessagesWrapper: {
    maxHeight: Dimensions.get('window').height - 250,
    minHeight: Dimensions.get('window').height - 250,
    borderWidth: 1,
    borderColor: '#00bcd4'
  },
  receivedMessageWrapper: {
    padding: 15,
    borderColor: '#788190',
    borderBottomWidth: 0.6
  },
  receivedMessageInfo: {},
  receivedMessage: {
    fontWeight: '500',
    color: '#677080',
    fontSize: 18,
    marginVertical: 1
  },
  buttonsWrapper: {
    position: 'absolute',
    bottom: 0,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  message: {
    backgroundColor: '#78819077',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 1,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 15,
    fontSize: 16,
    color: 'white'
  },
  messagesWrapper: {
    maxHeight: Dimensions.get('window').height - 200,
    minHeight: Dimensions.get('window').height - 200,
    borderColor: '#00bcd4',
    marginVertical: 25,
    marginBottom: 50
  },
  messagesWrapperContainer: {
    alignItems: 'center'
  },
  accessedPageWrapper: {
    justifyContent: 'space-between',
    flex: 1
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 15,
    left: 15
  },
  topWrapper: {
    alignItems: 'center',
    paddingTop: 35
  },
  registrationNumber: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#788190',
    padding: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: 150,
    borderRadius: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});
