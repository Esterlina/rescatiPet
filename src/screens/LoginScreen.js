import React from 'react';
import { View, StyleSheet, Text,TouchableOpacity,Image, ImageBackground,Dimensions,KeyboardAvoidingView, Button,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Fonts} from '../utils/Fonts';
import { LoginManager, AccessToken } from "react-native-fbsdk";
import * as firebase from 'firebase';
const {height, width} = Dimensions.get('window');

export default class LoginScreen extends React.Component {
  _isMounted = false;
  constructor(){
    super()
    this.state={
      email : '',
      password: '',
      response: '',
    }
    this.singUp = this.singUp.bind(this)
    this.login = this.login.bind(this)
  }
  async singUp(){
    this._isMounted = true;
    try{
      await firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password);
      if (this._isMounted){
        this.setState({response: 'Su cuenta se ha creado satisfactoriamente.'})
        console.log(this.state.response)
        setTimeout(()=>{this.props.navigation.navigate('Dashboard')},3500)
      }
    }catch(error){
      if (this._isMounted){
        this.setState({response:error.toString()})
        console.log(this.state.response)
      }
    }
  }
  async login(){
    this._isMounted = true;
    try{
      await firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      if (this._isMounted){
        this.setState({response: 'Inicio de sensión exitoso.'});
        console.log(this.getUserToken());
        console.log(this.state.response);
        setTimeout(()=>{this.props.navigation.navigate('Dashboard')},1500);
      }
    }catch(error){
      if (this._isMounted){
        this.setState({response:error.toString()});
        console.log(this.state.response);
      }
    }
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
  async fbAuth(){
      LoginManager
      .logInWithPermissions(['public_profile','email'])
      .then((result) => {
        if (result.isCancelled){
          return alert("Login fue cancelado");
        }
        console.log("LOGIN DE FB FUNCIONO CON PERMISOS"+ result.grantedPermissions.toString());
        setTimeout(()=>{this.props.navigation.navigate('Dashboard')},1500);
        return AccessToken.getCurrentAccessToken();
      })
      .then(data =>{
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        return firebase.auth().signInWithCredential(credential)
      })
      .then((currentUser) => {
        console.log("IMPRIMIRE UN TOKEN RARO");
        console.log(this.getUserToken());
        console.log('FACEBOOK+firebase LOGIN CON USUARIO');
      })
      .catch((error) =>{
        console.log('FACEBOOK+firebase LOGIN FALLO');
      })
  }
    
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <ImageBackground
      style={styles.container}
      source={require('../icons/fondo.png')}
      >
        <KeyboardAvoidingView behavior="position">
          <View style={{alignItems:'center'}}>
              <Image
                source={require('../icons/rescatipeticon.png')}/>
              <Image
                style={styles.iconLogin} 
                source={require('../icons/RescatiPet1.png')}/>
          </View>
          <View style={styles.formLogin}>
            <View style={styles.labelLogin}>
              <View style={styles.iconLabel}>
                <Icon name="user" size={32} color="#E9FFFC"/>
              </View>
              <TextInput
                style={styles.input}
                placeholder = {'Correo electronico'}
                placeholderTextColor = {'gray'}
                onChangeText={(email) => this.setState({email})}/> 
            </View>
            <View style={styles.labelLogin}>
              <View style={styles.iconLabel}>
                <Icon name="lock" size={32} color="#E9FFFC"/>
              </View>
              <TextInput
                style={styles.input}
                placeholder = {'Contraseña'}
                placeholderTextColor = {'gray'}
                secureTextEntry = {true}
                onChangeText={(password) => this.setState({password})}/> 
            </View>
            <TouchableOpacity 
              style={styles.buttonLogin}
              onPress={() => this.login()}>
              <Text style={styles.text}> Ingresar </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.buttonLogin}
                onPress={() => this.singUp()}
                >
                <Text style={styles.text}> Registrarme </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.buttonLogin,styles.social]}
                onPress={() => this.fbAuth()}
                >
                <View style={{flexDirection:'row'}}>
                  <Icon name="facebook-square" size={32} color="white"/>
                  <Text style={[styles.text,{fontSize:21}]}> Ingresar con Facebook </Text>
                </View> 
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    paddingTop: 70
},
iconLogin:{
 width: width*0.7,
 height: 45,
 marginTop:10,
 marginBottom: 10,
},
formLogin: {
  paddingVertical:20,
},
iconLabel:{
  width: 50,
  backgroundColor:'#66D2C5',
  borderBottomLeftRadius: 8,
  borderTopLeftRadius: 8,
  alignItems: "center",
  justifyContent:'center',
},
labelLogin:{
  width:width*0.8,
  backgroundColor:'#E9FFFC',
  borderRadius:8,
  flexDirection: 'row',
  marginBottom: 10,
},
buttonLogin:{
  marginTop: 10,
  backgroundColor:'#66D2C5',
  borderRadius: 8,
  alignItems: "center",
  justifyContent:'center',
  height: 45,
},

  text: {
    color: 'white',
    alignSelf: 'center',
    fontSize:26,
    fontFamily: Fonts.OpenSansBold
  },
  input:{
    width:width*0.6,
    height:40,
    fontSize:18,
    marginVertical: 3,
    paddingLeft: 10,
    color:'gray'
  },
  social:{
    backgroundColor:'#3b5998',
    marginTop:30
  }
});
