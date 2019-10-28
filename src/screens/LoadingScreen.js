import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import * as firebase from 'firebase'
import { Colors } from '../styles/colors';

export default class LoadingScreen extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this._isMounted = true;
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = async () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if(this._isMounted){
          if (user) {
            console.log("ANTES DEL DASHBOARD IMPRIMIRE EL TOKEN");
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
  
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color= {Colors.primaryColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });