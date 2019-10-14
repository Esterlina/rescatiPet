import React, { Component } from 'react';
import { Image } from 'react-native';
import Login from "./src/screens/LoginScreen";
import Register from "./src/screens/RegisterScreen";
import Perfil from "./src/screens/PerfilScreen";
import Search from "./src/screens/SearchScreen";
import Rescue from "./src/screens/RescueScreen";
import Notice from "./src/screens/Notice/";
import DetailNotice from "./src/components/DetailNotice";
import Inbox from "./src/screens/InboxScreen"
import Home from "./src/screens/HomeScreen";
import LoadingScreen from "./src/screens/LoadingScreen";

import * as firebase from 'firebase';
import FirebaseConfig from './lib/FirebaseConfig';
firebase.initializeApp(FirebaseConfig);

import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
/**
 * - AppSwitchNavigator
 *    - WelcomeScreen
 *      - Login Button
 *      - Sign Up Button
 *    - AppDrawerNavigator
 *          - Dashboard - DashboardStackNavigator(needed for header and to change the header based on the                     tab)
 *            - DashboardTabNavigator
 *              - Tab 1 - HomeStack
 *              - Tab 2 - ProfileStack
 *              - Tab 3 - SettingsStack
 *            - Any files you don't want to be a part of the Tab Navigator can go here.
 */


class App extends Component {
  render() {
      return <AppContainer/>;   
  }
}
export default App;

const DashboardTabNavigator = createBottomTabNavigator(
  {
    Home,
    Search,
    Rescue,
    Notice: {
      screen: Notice,
      navigationOptions: {
          tabBarIcon:({tintColor}) => (
            <Image
            source={require('./src/icons/tabs/megaphone.png')}
            style= {{width:25,height:25,tintColor:'white'}}
          >
          </Image>
        )
      }
},
    Perfil,
    
  },
  {tabBarOptions:{
      showLabel: false,
      activeTintColor: 'white',
      activeBackgroundColor: '#5FB4A9',
      inactiveBackgroundColor: '#66d2c5',
      inactiveTintColor: '#e9fffc'
    }
  }
);
const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator,   
    DetailNotice: DetailNotice,
    Inbox: Inbox,
  },{
    headerMode: 'none'
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: DashboardStackNavigator,
},{
  drawerBackgroundColor:'#66d2c5',
  //drawerWidth:200,
  contentOptions:{
    activeTintColor:'white',
    inactiveTintColor:'#E9FFFC'

  }
});
const AuthStack = createStackNavigator({ Login: Login, Register: Register },{headerMode: 'none',});
const AppSwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: LoadingScreen,
    Dashboard: AppDrawerNavigator ,
    Auth : AuthStack,
  },
);

const AppContainer = createAppContainer(AppSwitchNavigator);
