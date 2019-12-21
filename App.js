import SearchNumberScreen from './screens/search-number';
import SelectMessageScreen from './screens/select-message';
import LoginScreen from './screens/login';
import AuthLoadingScreen from './screens/auth-loading';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
    SearchNumber: {
      screen: SearchNumberScreen,
      navigationOptions: {
        title: 'Cauta numar de inmatriculare'
      }
    },
    SelectMessage: SelectMessageScreen
  },
  {
    headerMode: 'screen'
  }
);

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Login: LoginScreen,
    App: AppNavigator
  })
);
