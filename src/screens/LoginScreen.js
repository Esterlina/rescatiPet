import React,{PureComponent} from 'react';
import { View, Text,TouchableOpacity,Image, ImageBackground,KeyboardAvoidingView,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginManager, AccessToken } from "react-native-fbsdk";
import * as firebase from 'firebase';
import {API} from '../keys';
import { connect } from 'react-redux'
import authStyle from '../styles/auth.style'
import appStyle from '../styles/app.style'
class LoginScreen extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      email : '',
      password: '',
      response: '',
    }
    this.login = this.login.bind(this)
    this.fbAuth = this.fbAuth.bind(this)
  }
  
  _isMounted = false;
  componentWillUnmount() {
    this._isMounted = false;
  }
  //Login con correo
  async login(){
    this._isMounted = true;
    try{
      await firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      if (this._isMounted){
        this.setState({response: 'Inicio de sensión exitoso.'},() => {this.firebaseToken();setTimeout(()=>{this.props.navigation.navigate('Dashboard')},1500)});
      }
    }catch(error){
      if (this._isMounted){
        this.setState({response:error.toString()});
        console.log(this.state.response);
      }
    }
  }
  //Login con Facebook
  async fbAuth(){
    LoginManager
    .logInWithPermissions(['public_profile','email'])
    .then((result) => {
      if (result.isCancelled){
        return alert("Login fue cancelado");
      }
      console.log("LOGIN DE FB FUNCIONO CON PERMISOS");
      return AccessToken.getCurrentAccessToken();
    })
    .then(data =>{
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      return firebase.auth().signInWithCredential(credential)
    })
    .then((currentUser) => {
      console.log('FACEBOOK+firebase LOGIN CON USUARIO');
      this.firebaseToken();
      setTimeout(()=>{this.props.navigation.navigate('Dashboard')},1500);
    })
    .catch((error) =>{
      console.log(error)
    })
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
      this.setState({user: user},() => {this.props.updateUser(this.state.user)})
    }).catch((error) =>{
      console.error(error);
    });
  }

  render() {
    return (
      <ImageBackground
      style={authStyle.container}
      source={require('../icons/fondo.png')}
      >
        <KeyboardAvoidingView behavior="position">
          <View style={{alignItems:'center'}}>
              <Image
                source={require('../icons/rescatipeticon.png')}/>
              <Image
                style={authStyle.iconLogin} 
                source={require('../icons/RescatiPet1.png')}/>
          </View>
          <View style={authStyle.formLogin}>
            <View style={authStyle.labelLogin}>
              <View style={authStyle.iconLabel}>
                <Icon name="user" size={32} color="#E9FFFC"/>
              </View>
              <TextInput
                style={authStyle.input}
                placeholder = {'Correo electronico'}
                placeholderTextColor = {'gray'}
                onChangeText={(email) => this.setState({email})}/> 
            </View>
            <View style={authStyle.labelLogin}>
              <View style={authStyle.iconLabel}>
                <Icon name="lock" size={32} color="#E9FFFC"/>
              </View>
              <TextInput
                style={authStyle.input}
                placeholder = {'Contraseña'}
                placeholderTextColor = {'gray'}
                secureTextEntry = {true}
                onChangeText={(password) => this.setState({password})}/> 
            </View>
            <TouchableOpacity 
              style={appStyle.buttonLarge}
              onPress={() => this.login()}>
              <Text style={authStyle.text}> Ingresar </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={appStyle.buttonLarge}
                onPress={() => this.props.navigation.navigate('Register')}
                >
                <Text style={authStyle.text}> Registrarme </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[appStyle.buttonLarge,authStyle.social]}
                onPress={() => this.fbAuth()}
                >
                <View style={{flexDirection:'row'}}>
                  <Icon name="facebook-square" size={32} color="white"/>
                  <Text style={[authStyle.text,{fontSize:21}]}> Ingresar con Facebook </Text>
                </View> 
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('State:');
  console.log(state);  // Redux Store --> Component
  console.log(state.userReducer)
  return {
    user: state.userReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);