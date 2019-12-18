import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  receivedMessagesWrapper: {
    maxHeight: Dimensions.get('window').height - 130,
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
    left: 15,
  },
  topWrapper: {
    alignItems: 'center',
    paddingTop: 35,
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
  }
});
