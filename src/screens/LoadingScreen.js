import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

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
      console.log("IMPRIMIRE EL TOKEN:");
      console.log(idToken);
    // never reaches here
    return idToken
    }
  }
  getUserToken(){
    this.firebaseToken();
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