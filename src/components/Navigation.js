import React, { Component } from 'react';
import { Image } from 'react-native';
import Login from "../screens/LoginScreen";
import Register from "../screens/RegisterScreen";
import Perfil from "../screens/PerfilScreen";
import Search from "../screens/SearchScreen";
import Rescue from "../screens/Rescue/";
import Notice from "../screens/Notice/";
import DetailNotice from "./DetailNotice";
import DetailAdoption from "./DetailAdoption"
import DetailEvent from "./DetailEvent"
import Inbox from "../screens/InboxScreen"
import Home from "../screens/HomeScreen";
import LoadingScreen from "../screens/LoadingScreen";
import {Colors} from "../styles/colors"
import Icon from 'react-native-vector-icons/FontAwesome';
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
  
  
  /*export default class Navigation extends Component {
    render() {
        return <AppContainer/>;   
    }
  }*/
  
  const DashboardTabNavigator = createBottomTabNavigator(
    {
      Home,
      Search,
      Rescue:{
        screen: Rescue,
        navigationOptions:{
          tabBarIcon:({tintColor}) => (
            <Icon name="paw" size={25} color="white"/>
          )
        }
      },
      Notice: {
        screen: Notice,
        navigationOptions: {
            tabBarIcon:({tintColor}) => (
              <Image
              source={require('../icons/tabs/megaphone.png')}
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
        inactiveBackgroundColor: Colors.primaryColor,
        inactiveTintColor: '#e9fffc'
      }
    }
  );
  const DashboardStackNavigator = createStackNavigator(
    {
      DashboardTabNavigator: DashboardTabNavigator,   
      DetailNotice: DetailNotice,
      DetailAdoption,
      DetailEvent,
      Inbox: Inbox,
    },{
      headerMode: 'none'
    }
  );
  
  const AppDrawerNavigator = createDrawerNavigator({
    Dashboard: DashboardStackNavigator,
  },{
    drawerBackgroundColor:Colors.primaryColor,
    //drawerWidth:200,
    contentOptions:{
      activeTintColor:'white',
      inactiveTintColor:'#E9FFFC'
  
    }
  });
  const AuthStack = createStackNavigator({ Login: Login, Register: Register },{headerMode: 'none',});
  
  const  AppSwitchNavigator = createSwitchNavigator(
    {
      AuthLoading: LoadingScreen,
      Dashboard: AppDrawerNavigator ,
      Auth : AuthStack,
    },
  );
  
  export default AppContainer = createAppContainer(AppSwitchNavigator);
