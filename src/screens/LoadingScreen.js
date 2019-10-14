import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import {API} from '../keys';
import * as firebase from 'firebase'

class LoadingScreen extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this._isMounted = true;
    this.checkIfLoggedIn();
  }


  async firebaseToken() {
    const currentUser = firebase.auth().currentUser
  
     if (currentUser) {
    // reaches here
      const idToken = await currentUser.getIdToken();
      this.getUserData(idToken);
      console.log("IMPRIMIRE EL TOKEN:");
      console.log(idToken);

    // never reaches here
    return idToken
    }
  }
  getUserToken(){
    this.firebaseToken();
  }

  getUserData(idToken){
    console.log("ESTOY EN SALVANDO LOS DATOS DEL USUAIROOOOO")
    fetch(API + 'users/data_user/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': idToken,
      }})
    .then((response) => response.json())
    .then((responseJson) => {
      let user = responseJson['usuario']
      AsyncStorage.setItem('user',JSON.stringify(user))
    }).catch((error) =>{
      console.error(error);
    });
    console.log("ESTOY TERMINANDO EN SALVANDO LOS DATOS DEL USUAIROOOOO")
  }

  // Fetch the token from storage then navigate to our appropriate place
  checkIfLoggedIn = async () => {
    console.log("VOT A REVISAR EL USARIO");
    firebase.auth().onAuthStateChanged(
      function(user) {
        if(this._isMounted){
          console.log('AUTH STATE CHANGED CALLED ')
          if (user) {
            console.log("ANTES DEL DASHBOARD IMPRIMIRE EL TOKEN");
            this.getUserToken();
            this.props.navigation.navigate('Dashboard');
          } else {
            this.props.navigation.navigate('Auth');
          }
        }   
      }.bind(this)
    );
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });