import React, { Component } from 'react';
import { Image } from 'react-native';
import Login from "./src/screens/LoginScreen";
import Register from "./src/screens/RegisterScreen";
import Perfil from "./src/screens/PerfilScreen";
import Search from "./src/screens/SearchScreen";
//import Notice from "./src/screens/Notice/NoticeScreen";
import Rescue from "./src/screens/RescueScreen";
import Notice from "./src/screens/Notice/";
import Home from "./src/screens/HomeScreen";
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

import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
class App extends Component {
  render() {
    return <AppContainer />;
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
  },
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardTabNavigator
  },
},{
  drawerBackgroundColor:'#66d2c5',
  //drawerWidth:200,
  contentOptions:{
    activeTintColor:'white',
    inactiveTintColor:'#E9FFFC'

  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Dashboard: { screen: AppDrawerNavigator },
  Login: { screen: Login },
  Register: {screen: Register},
  
});

const AppContainer = createAppContainer(AppSwitchNavigator);
