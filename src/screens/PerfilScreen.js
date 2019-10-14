import React from 'react';
import { StyleSheet, Text,View,Button,Image, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import Helpers from '../../lib/helpers'
import * as firebase from 'firebase';

export default class PerfilScreen extends React.Component {
  _isMounted = false;
  constructor(){
    super()
    this.state={
      response: '',
      dataSource:'',
      user:{}
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
  componentDidMount(){
    this.displayData();
  }

  displayData = async () => {
    try{
      let user_item = await AsyncStorage.getItem('user')
      let user =  JSON.parse(user_item);
      this.setState({user: user},()=> console.log(this.state.user.nombre))
    }catch(error){
      alert(error)
    }
  }
 

  render(){ 
    
    return(
        <View style={styles.container}>
          <Header {...this.props} /> 
          <Text style={styles.welcome}>PERFIL {this.state.user.nombre}</Text>

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
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
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