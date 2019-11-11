import React from 'react';
import {ScrollView,View,Image,ActivityIndicator} from 'react-native';
import Header from '../components/Header';
import {API} from '../keys';
import Notice from '../components/Notice'
import {Colors} from '../styles/colors'
import firebase from 'react-native-firebase'
import type { Notification, NotificationOpen } from 'react-native-firebase';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      notices:[], 
      loading: true,
    }
  }
static navigationOptions = {
  tabBarIcon:({tintColor}) => (
    <Image
      source={require('../icons/tabs/kennel.png')}
      style= {{width:25,height:25,tintColor:'white'}}
    >
    </Image>
  )
}

componentDidMount() {
  firebase.notifications().getInitialNotification()
    .then((notificationOpen: NotificationOpen) => {
      if (notificationOpen) {
        console.log("ACABO DE ABRIR NOTIFICACION")
        this.props.navigation.navigate('Inbox');
        console.log("FUI UNA NOTIFICACION ABIERTA")
        // App was opened by a notification
        // Get the action triggered by the notification being opened
       // const action = notificationOpen.action;
        // Get information about the notification that was opened
        //const notification: Notification = notificationOpen.notification;  
      }
    });
  return fetch(API+'notices')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      notices: responseJson['notices'],
    },() => this.setState({loading: false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}

  render(){ 
    
    return(
        <View style={{flex:1}}>
          <Header {...this.props} inbox='true'/> 
          {!this.state.loading ?
            <ScrollView style={{flex:1}}>
              {this.state.notices.map((item) => {
                console.log(item)
                if(item.tipe != "Adopcion"){
                return (
                  <Notice key={item.id} dataJson={item}
                    navigation={this.props.navigation}
                    /> 
                  
                )}
              })}
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View> }
      </View>
    );
    
  }
}
