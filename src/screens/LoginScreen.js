import React from 'react';
import { View, Text,TouchableOpacity,Image, ImageBackground,KeyboardAvoidingView,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginManager, AccessToken,GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import firebase from 'react-native-firebase';
import authStyle from '../styles/auth.style'
import appStyle from '../styles/app.style'
export default class LoginScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
      email : '',
      password: '',
      response: '',
      picture: '',
      token_device:'',
    }
    this.login = this.login.bind(this)
    this.fbAuth = this.fbAuth.bind(this)
  }
  
  _isMounted = false;
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount(){
    console.log("PRIMERO OBTENDRE EL TOKEN")
    this.getTokenDevice();
  }
  //Login con correo
  async login(){
    this._isMounted = true;
    try{
      await firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
      if (this._isMounted){
        this.setState({response: 'Inicio de sensión exitoso.'},() => {this.props.navigation.navigate('AuthLoading',{token_device:this.state.token_device});});
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
      console.log("IMPRIMIRE AL TOKEN DE Fb?????")
      console.log(data.accessToken);
      this.getPicture(data.accessToken)
      return firebase.auth().signInWithCredential(credential)
    })
    .then((currentUser) => {
      console.log('FACEBOOK+firebase LOGIN CON USUARIO');
      console.log("ENTRARE A LA PANTALLA DE CARGA")
      this.props.navigation.navigate('AuthLoading',{picture: this.state.picture, token_device:this.state.token_device});
    })
    .catch((error) =>{
      console.log(error)
    })
  }

  async getPicture(token){
      const response =  await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=picture.type(large)`);
      const picture = await response.json();
      this.setState({picture: picture.picture.data.url})
  }
  async getTokenDevice(){
    let token_device = await firebase.messaging().getToken();
    this.setState({token_device:token_device})
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
