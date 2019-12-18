import React from "react";
import { StyleSheet, ScrollView, Dimensions, AppState, RefreshControl } from "react-native";
import moment from "moment";
import * as locales from "moment/min/locales";
moment.locale("ro");

export default class ReceivedMessages extends React.Component {
  state = {
    receivedMessages: [],
    appState: AppState.currentState
  };

  // componentWillUnmount() {
  //   AppState.removeEventListener("change", this._handleAppStateChange);
  // }

  // _handleAppStateChange = nextAppState => {
  //   if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
  //     setTimeout(() => {
  //       this.loadMessages();
  //     }, 500);
  //   }
  //   this.setState({ appState: nextAppState });
  // };

  // async componentDidMount() {
  //   AppState.addEventListener("change", this._handleAppStateChange);
  // }

  // loadMessages = async () => {
  //   this.setState({ refreshing: true });
  //   const receivedMessages = await (await fetch(`${baseUrl}/my-messages?registrationNumber=${this.state.registrationNumber}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })).json();
  //   if (receivedMessages.length) receivedMessages.sort((a, b) => +new Date(b.date) - +new Date(a.date))[0].expanded = true;
  //   this.setState({ receivedMessages, refreshing: false });
  // };

  // expandMessage = _id => {
  //   (this.state.receivedMessages.find(x => x.expanded && x._id != _id) || {}).expanded = false;
  //   const message = this.state.receivedMessages.find(x => x._id == _id);
  //   if (message) message.expanded = !message.expanded;
  //   this.setState({});
  // };

  // contactDriver = () => {
  //   const { targetText } = this.state;
  //   if ((targetText || "").trim().length < 6) return;
  //   if (/[A-Z]/.test(targetText) && /[0-9]/.test(targetText)) {
  //     this.setState({ targetRegistrationNumber: targetText });
  //   }
  // };

  // replyToDriver = targetRegistrationNumber => {
  //   this.props.screenProps.replyTo(targetRegistrationNumber);
  // };

  render() {
    // const { receivedMessages } = this.state;
    return (
      <ScrollView>
        {/* {receivedMessages
          .sort((a, b) => +new Date(b.date) - +new Date(a.date))
          .map((x, i) => (
            <TouchableOpacity activeOpacity={1} onPress={() => this.expandMessage(x._id)} style={styles.receivedMessageWrapper} key={x._id}>
              <Text style={styles.receivedMessageInfo}>
                Acum {moment.duration(moment(x.date).diff(moment())).humanize()} - de la {x.sourceRegistrationNumber}
              </Text>
              <Text style={styles.receivedMessage}>{x.message}</Text>
              {x.expanded && (
                <View style={{ marginTop: 10 }}>
                  <Button color="#00bcd4" onPress={() => this.replyToDriver(x.sourceRegistrationNumber)} title="Raspunde" />
                </View>
              )}
            </TouchableOpacity>
          ))} */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  receivedMessagesWrapper: {
    maxHeight: Dimensions.get("window").height - 250,
    minHeight: Dimensions.get("window").height - 250,
    borderWidth: 1,
    borderColor: "#00bcd4"
  },
  receivedMessageWrapper: {
    padding: 15,
    borderColor: "#788190",
    borderBottomWidth: 0.6
  },
  receivedMessageInfo: {},
  receivedMessage: {
    fontWeight: "500",
    color: "#677080",
    fontSize: 18,
    marginVertical: 1
  }
});
