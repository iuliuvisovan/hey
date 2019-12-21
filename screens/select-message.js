import React, { version } from 'react';
import { Text, View, TextInput, Keyboard, AsyncStorage, Alert, LayoutAnimation } from 'react-native';
import styles from './styles';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

const useRemote = true;
const baseUrl = useRemote ? 'https://hey-server.herokuapp.com' : 'http://192.168.1.117:3000';

export default class App extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const carNumber = navigation.getParam('carNumber');
    return {
      headerTitle: 'Mesaj catre ' + carNumber + ':'
    };
  };

  state = {
    query: '',
    selectedMessageId: null
  };

  confirmSendMessage = () => {
    const { navigation } = this.props;

    Alert.alert(
      'Confirma',
      `Trimite catre ${navigation.getParam('carNumber')}:\n\n${
        availableMessages.find(x => x.id === this.state.selectedMessageId).text
      }`,
      [
        { text: 'Anuleaza', onPress: () => {}, style: 'cancel' },
        {
          text: 'Trimite',
          onPress: this.sendMessage
        }
      ],
      { cancelable: false }
    );
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
    const message = this.state.messages.find(x => x.selected);
    Alert.alert(`Mesaj trimis catre ${query}:`, `${message.text}`);

    sentMessages.push({ query, message, dateTimestamp: +new Date() });
    AsyncStorage.setItem('sentMessages', JSON.stringify(sentMessages));
    (this.state.messages.find(x => x.selected) || {}).selected = false;
    this.setState({});
  };

  selectMessage = id => {
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({ selectedMessageId: id });
    }, 0);
  };

  render() {
    const { selectedMessageId } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.selectMessagesWrapper} onTouchStart={Keyboard.dismiss}>
        {selectedMessageId !== null && (
          <View style={styles.topMessage}>
            <Text>
              Trimite catre
              <Text style={{ fontWeight: '700' }}> {navigation.getParam('carNumber')}</Text>:
            </Text>
            <Text style={{ fontWeight: '500', fontSize: 18, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
              "{availableMessages.find(x => x.id === selectedMessageId).text}"
            </Text>
            <Text style={{ fontSize: 12, marginTop: 16, marginBottom: -8, color: 'gray' }}>
              Mesajul ales de tine va fi trimis de la un numar anonim.
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => this.selectMessage(null)}
                style={[styles.bigButton, { backgroundColor: '#5DBCD2' }]}
              >
                <Text style={styles.bigbuttonLabel}>ALEGE ALT MESAJ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.confirmSendMessage}
                style={[styles.bigButton, { backgroundColor: '#cb2431' }]}
              >
                <Text style={styles.bigbuttonLabel}>TRIMITE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView style={{ paddingTop: 8 }}>
          <Text style={{ marginTop: 8 }}>Selecteaza:</Text>
          {availableMessages.map(({ id, text }) => (
            <TouchableOpacity disabled={selectedMessageId != null} key={id} onPress={() => this.selectMessage(id)}>
              <View
                style={[
                  styles.message,
                  { opacity: selectedMessageId !== null ? (selectedMessageId === id ? 1 : 0.4) : 1 }
                ]}
              >
                <Text style={{ fontSize: 20, marginLeft: 8 }}>{text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const availableMessages = [
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
    text: 'Ar fi bine sa-ti muti masina!'
  },
  {
    id: 3,
    text: 'Te rog sa vii sa-ti muti masina cat mai repede!'
  },
  {
    id: 4,
    text: 'Ar trebui sa vii la masina cat mai repede! (politie, geam deschis, cheie in contact, bunuri, etc.)'
  },
  {
    id: 5,
    text: 'Urat din partea ta!'
  }
];
