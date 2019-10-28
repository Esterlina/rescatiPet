import React from 'react';
import {Text,Image,View,TouchableOpacity,ImageBackground,KeyboardAvoidingView,TextInput,Alert, Dimensions} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux'
import authStyle from '../styles/auth.style'
import appStyle from '../styles/app.style'
import Icon from 'react-native-vector-icons/FontAwesome';
import {API} from '../keys';

const {width} = Dimensions.get('window');

class RegisterScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
      email : '',
      password: '',
      passwordRepeat: '',
    }
    this.singUp = this.singUp.bind(this)
  }

  validate(){
    if(this.state.password == '' || this.state.passwordRepeat == '' || this.state.email == ''){
      Alert.alert(
        'Datos incompletos',
        'Faltan campos por completar.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable:false}
      )
    }
    else if(this.state.password == this.state.passwordRepeat){
        if(this.state.password.length < 6){
          Alert.alert(
            'Datos incorrectos',
            'La contraseña debe contener mínimo 6 carácteres',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable:false}
          )
        }
        else{
          this.singUp()
        }
    }
  }

  async singUp(){
    this._isMounted = true;
    try{
      await firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password);
      if (this._isMounted){
        Alert.alert(
          'Felicidades',
          'Su cuenta se ha creado satisfactoriamente.',
          [{text: 'OK', onPress: () => this.setState({response: 'Su cuenta se ha creado satisfactoriamente.'},() => {this.firebaseToken();setTimeout(()=>{this.props.navigation.navigate('Dashboard')},1500)})}],
          {cancelable:false}
        )
      }
    }catch(error){
      if (this._isMounted){
        console.log(error)
        this.setState({response:error.toString()})
        //console.log("CAÍ EN EL ERROR")
        //console.log(this.state.response)
        Alert.alert(
          'ha ocurrido un error',
          this.state.response,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable:false}
        )
      }
    }
  }
  //Obetener Token de Firebase
  async firebaseToken() {
    const currentUser = firebase.auth().currentUser
     if (currentUser) {
      const idToken = await currentUser.getIdToken();
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
      this.setState({user: user},() => {this.props.updateUser(this.state.user); } )
    }).catch((error) =>{
      console.error(error);
    });
  }
  render(){  
    return(
      <ImageBackground style={{flex:1,padding: 10}} source={require('../icons/fondo.png')}>
        <KeyboardAvoidingView behavior="position">
          <TouchableOpacity 
            style={authStyle.backButton}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Icon
              name="angle-left"
              color= "white"
              size={24}
            />
          </TouchableOpacity>
          <View style={{alignItems:'center'}}>
            <Image
              source={require('../icons/rescatipeticon.png')}/>
            <Image
              style={authStyle.iconLogin} 
              source={require('../icons/RescatiPet1.png')}/>
          </View>
          <View style={[authStyle.formLogin,{alignItems:'center'}]}>
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
            <Text style={authStyle.passwordText}>Contraseña con Mínimo 6 cáracteres</Text>
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
            <View style={authStyle.labelLogin}>
              <View style={authStyle.iconLabel}>
                <Icon name="lock" size={32} color="#E9FFFC"/>
              </View>
              <TextInput
                style={authStyle.input}
                placeholder = {'Repetir contraseña'}
                placeholderTextColor = {'gray'}
                secureTextEntry = {true}
                onChangeText={(passwordRepeat) => this.setState({passwordRepeat})}/> 
            </View>
            <TouchableOpacity 
              style={[appStyle.buttonLarge,{alignItems:'stretch',width: width*0.8}]}
              onPress={() => this.validate()}>
              <Text style={authStyle.text}> Crear cuenta </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);