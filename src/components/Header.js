import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native'
import {Colors} from '../styles/colors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase'
import { API} from '../keys';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
const {width,height} = Dimensions.get('window')
class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {
          stack:this.props.navigation.state.stack,
          inbox:this.props.navigation.state.inbox,
          notifications: 0,
        }
        this.signOut = this.signOut.bind(this)
      }
    renderIcon(){
        if(this.props.stack == 'true')
            return <Text>data</Text>;
        return null;
    }
    openInbox(){
        this.props.navigation.navigate('Inbox')
    }
    componentDidMount(){
        console.log("VOY A BUSCAR LAS NOTIFICACIONES")
        if(this.props.inbox === 'true'){
            console.log("voy a buscar lasnotifiacionesssssss ")
            return fetch(API + 'users/' + this.props.user.id + '/notifications')
            .then( (response) => response.json() )
            .then( (responseJson ) => {
                console.log("LA NOTIFICACION DELA API ES ")
                console.log(responseJson)
                this.setState({
                    notifications: responseJson['notificaciones'],
                })
            })
            .catch((error) => {
                console.log("HA OCURRIDO UN ERROR DE CONEXION")
                console.log(error)
                this.setState({notifications:0})
            });
        }
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
    render(){
        console.log(this.props.home)
        console.log("LAS NOTIFICACIONES SON:")
        console.log(this.state.notifications)
        console.log("DEL USUARIO " + this.props.user.id)
        const { goBack } = this.props.navigation;
        return(
            
                <View style={styles.container}> 
                <NavigationEvents onDidFocus={() => {console.log("RENDERIZANDO SCREEN DESDE CERO EN HEADER");this.componentDidMount()}} />
                    { this.props.stack === 'true' ?
                        <View style={{position:'absolute',left:0}}>
                        <TouchableWithoutFeedback
                        onPress={() =>{this.props.home? this.props.navigation.navigate(this.props.home) :goBack()} }>
                            <Icon
                                style ={styles.icon}
                                name="angle-left"
                                color= "white"
                                size={24}
                            />
                        </TouchableWithoutFeedback>
                        </View>
                        :   
                        null
                    }    
                    <View style={styles.title}>
                        <Image
                            style={styles.iconHeader} 
                            source={require('../icons/RescatiPet.png')}
                        />  
                    </View>
                {this.props.inbox === 'true'?
                    <View style={{position:'absolute',right:0,}}>
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.openInbox()}>
                            <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'center',height:40}}>
                                <Icon
                                    style ={styles.icon}
                                    name="bell"
                                    color= "white"
                                    size={22}
                                    solid
                                />
                                {this.state.notifications > 0? 
                                <View style={[styles.circle,{backgroundColor: 'red',position:'absolute',right:2,top:1}]}>
                                    <Text style={{color:'white'}}>{this.state.notifications}</Text>
                                </View>
                                :null}
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                    </View>
                    :   null
                }
                {this.props.signout?
                    <View style={{position:'absolute',right:0}}>
                    <TouchableOpacity
                        onPress={() => this.signOut()}>
                        <Icon
                            style ={styles.icon}
                            name="sign-out-alt"
                            color= "white"
                            size={22}
                            solid
                        />
                    </TouchableOpacity>
                    </View>
                    :   null
                }                                 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconHeader: {
       width: 120,
       height:20,
    },
    title:{
       // width:width*0.75,
        alignItems: 'center',
        alignSelf:'center',
        justifyContent: 'center',
    },
    container:{
        backgroundColor: Colors.primaryColor,
        height:40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'center'
        //marginBottom:10,
    },
    icon: {
        paddingHorizontal:15,
        alignSelf:'center'

    },
    circle:{
        width:25,height:25,borderRadius:13,
        alignItems:'center',justifyContent:'center',alignSelf:'center'
      }
})

const mapStateToProps = (state) => {
    return {
      user: state.userReducer,
    };
  };
  export default connect(mapStateToProps)(Header);