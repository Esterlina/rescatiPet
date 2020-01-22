import React from 'react';
import {ScrollView,View,Image,ActivityIndicator,RefreshControl} from 'react-native';
import Header from '../components/Header';
import {API} from '../keys';
import Notice from '../components/Notice'
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
      refreshing: false,
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
  this.getPublications()
}
getPublications(){
  return fetch(API + 'publications')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      publications: responseJson['publicaciones'],
    },() => this.setState({loading: false,refreshing:false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false,refreshing:false})
  });
}
_onRefresh() {
  //Clear old data of the list
  this.setState({ loading:true,refreshing:true});
  //Call the Service to get the latest data
  this.getPublications();
}
  render(){ 
    
    return(
        <View style={{flex:1}}>
          <Header {...this.props} inbox='true'/> 
          {!this.state.loading ?
            <ScrollView style={{flex:1,marginTop:5}} refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
              {this.state.publications.map((item) => {
                console.log(item)
                if(item.tipo_publicacion == "Notice" && item.tipo != 'Adopcion'){
                  //if(item.tipo != "Adopcion"){
                    return (
                      <Notice key={item.publication_id} notice={item}
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
                else if(item.tipo_publicacion != "Event"){
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
