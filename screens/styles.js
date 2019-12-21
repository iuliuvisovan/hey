import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  selectMessagesWrapper: {
    flex: 1,
    backgroundColor: '#d6d9dc',
    paddingHorizontal: 8
  },
  label: {
    paddingHorizontal: 24,
    textAlign: 'center',
    marginTop: 28
  },
  input: {
    borderWidth: 1,
    borderColor: '#788190',
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 8,
    width: 150,
    borderRadius: 5
  },
  numberList: {
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16
  },
  number: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#5DBCD2',
    marginTop: 18,
    paddingTop: 4
  },
  contactLabel: {
    fontSize: 14,
    marginTop: 4,
    color: '#fff',
    fontWeight: '500'
  },
  addButton: {
    color: '#5DBCD2',
    fontSize: 12,
    marginTop: 4
  },
  message: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8
  },
  topMessage: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: -8,
    shadowOffset: { width: -4, height: 0 },
    shadowRadius: 6,
    shadowColor: 'black',
    shadowOpacity: 0.4
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -16,
    marginTop: 16,
    marginBottom: -16
  },
  bigButton: {
    width: Dimensions.get('screen').width / 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigbuttonLabel: {
    fontSize: 14,
    marginTop: 4,
    color: '#fff',
    fontWeight: '700'
  }
});
