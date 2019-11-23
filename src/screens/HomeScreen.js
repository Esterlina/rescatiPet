import React from 'react';
import {ScrollView,View,Image,ActivityIndicator} from 'react-native';
import Header from '../components/Header';
import {API} from '../keys';
import Notice from '../components/Notice'
import RequestHome from '../components/DetailRequestHome';
import Adoption from '../components/DetailAdoption';
import Campaign from '../components/DetailDonationCampaign';
import {Colors} from '../styles/colors'
import firebase from 'react-native-firebase'
import type { Notification, NotificationOpen } from 'react-native-firebase';
import Publication from '../components/SmallPublication'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      publications:[], 
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
  return fetch(API + 'publications')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      publications: responseJson['publicaciones'],
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
              {this.state.publications.map((item) => {
                console.log(item)
                if(item.tipo_publicacion == "Notice" && item.tipo != 'Adopcion'){
                  //if(item.tipo != "Adopcion"){
                    return (
                      <Notice key={item.publication_id} dataJson={item}
                        navigation={this.props.navigation}
                        /> 
                    )
                  //}else{
                   /* return(
                      <View key={item.publication_id} style={{marginHorizontal:5}}>
                      <Adoption key={item.publication_id} adoption={item}
                      navigation={this.props.navigation}
                      /> 
                    </View>
                    )
                  }*/
                }
                else{
                  return(
                    <View key={item.publication_id} style={{marginHorizontal:5}}>
                      <Publication key={item.publication_id} publication={item}
                            navigation={this.props.navigation}
                      /> 
                    </View>
                  )
                }
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
