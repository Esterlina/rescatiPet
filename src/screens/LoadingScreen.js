import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import firebase from 'react-native-firebase'
import { Colors } from '../styles/colors';
import { connect } from 'react-redux'
import {API} from '../keys';

class LoadingScreen extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state={
      user:'',
      token_device:'',
      picture: (this.props.navigation.getParam('picture') == undefined ? '': this.props.navigation.getParam('picture')),
      token_device: (this.props.navigation.getParam('token_device') == undefined ? '': this.props.navigation.getParam('token_device')),
    }
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
            console.log(user)
            console.log("OBTENDRE AL USUARIO Y LO SETEARÉ")
            this.firebaseToken()
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
    //Obetener Token de Firebase
    async firebaseToken() {
      const currentUser = firebase.auth().currentUser
       if (currentUser) {
        const idToken = await currentUser.getIdToken();
        console.log("IMPRIMIRE EL TOKEN:");
        console.log(idToken);
        this.getUserData(idToken)
      }
    }
    //Obtener datos del usuario
    getUserData(idToken){
      console.log("EL TOKEN ES")
      console.log(idToken)
      console.log("AHORA OBTENDRE LA DATA DEL USUARIO")
      fetch(API + 'users/data_user', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': idToken,
        },
        body: JSON.stringify({
          profile_picture: this.state.picture,
          token_device: this.state.token_device
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        let user = responseJson['usuario']
        console.log("EL USUARIO OBTENIDO CON EXITO")
        console.log(user)
        this.setState({user: user},() => {this.props.updateUser(this.state.user);this.sendHome();})
      }).catch((error) =>{
        console.log("HUBO UN ERROR")
        console.error(error);
      });
    }
    sendHome(){
      console.log("Ya termine de poner el usuario, ahora vamos al HOMEEEE")
      this.props.navigation.navigate('Dashboard')
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


  const mapStateToProps = (state) => {
    console.log('State:');
    console.log(state);  // Redux Store --> Component
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
  };
  const mapDispatchToProps = (dispatch) => {
    console.log("ENTRE AL DISPATCH PARA ACTUALIZAR USUARIO")
    // Action
      return {
        // update user
        updateUser: (user) => dispatch({
          type: 'UPDATE_USER',
          userReducer: user,
         // payload: payload,
        }),
     };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);