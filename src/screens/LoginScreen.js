import React from 'react';
import { View, StyleSheet, Text,TouchableOpacity,Image, ImageBackground,Dimensions,KeyboardAvoidingView, Button,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Fonts} from '../utils/Fonts';
const {height, width} = Dimensions.get('window');

export default class LoginScreen extends React.Component {
  constructor(){
    super()
  }

  go(){
    this.props.navigation.navigate('Dashboard');  
  }
  registro(){
    this.props.navigation.navigate('Register');  
  }

  render() {
    return (
      <ImageBackground
      style={styles.container}
      source={require('../icons/fondo.png')}
      >
           <KeyboardAvoidingView
                    behavior="position"
            >
      <View style={{alignItems:'center'}}>
          <Image
            source={require('../icons/rescatipeticon.png')}
        />
        <Image
          style={styles.iconLogin} 
          source={require('../icons/RescatiPet1.png')}
        />
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
            onChangeText={(value) => this.setState({pass: value})}                         
          /> 
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
            onChangeText={(value) => this.setState({pass: value})}                         
          /> 
        </View>
        
        <TouchableOpacity 
          style={styles.buttonLogin}
          onPress={() => this.go()}
          >
          <Text style={styles.text}> Ingresar </Text>
      </TouchableOpacity>
      <TouchableOpacity 
          style={styles.buttonLogin}
          onPress={() => this.registro()}
          >
          <Text style={styles.text}> Registrarme </Text>
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
});
