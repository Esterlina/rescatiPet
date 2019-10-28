import React, {PureComponent} from 'react';
import { StyleSheet, Text,View,Button,Image, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import Helpers from '../../lib/helpers'
import * as firebase from 'firebase';
import {connect} from 'react-redux'

class PerfilScreen extends PureComponent {
  _isMounted = false;
  constructor(props){
    super(props)
    this.state={
      response: '',
      dataSource:'',
    }
    this.signOut = this.signOut.bind(this)
  }
  static navigationOptions = {
    tabBarIcon:({tintColor}) => (
      <Icon name="user-circle" size={25} color="white"/>
    )
  }
  async signOut(){
    this._isMounted = true;
    try{
      console.log("VOY A DESLOGEARME")
      await firebase.auth().signOut()
      if (this._isMounted){
        this.setState({response: 'Sesión cerrada con exito.'})
        console.log(this.state.response)
       // this.props.authLogout();
        setTimeout(()=>{this.props.navigation.navigate('Auth')},1500)
      }
    }catch(error){
      if (this._isMounted){
        this.setState({response:error.toString()})
        console.log(this.state.response)
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(){ 
    
    return(
        <View style={{flex:1}}>
          <Header {...this.props} /> 
          <Text style={styles.welcome}>PERFIL {this.props.user.nombre}</Text>

          <Button
            backgroundColor="#03A9F4"
            title="CERRAR SESION"
            onPress={() => this.signOut()}
            />
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });

const mapStateToProps = (state) => {
  console.log('State:');
  console.log(state);  // Redux Store --> Component
  console.log(state.userReducer)
  return {
    user: state.userReducer,
  };
}

export default connect(mapStateToProps)(PerfilScreen);