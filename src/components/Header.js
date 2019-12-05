import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native'
import {Colors} from '../styles/colors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase'
const {width,height} = Dimensions.get('window')
export default class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
          stack:this.props.navigation.state.stack,
          inbox:this.props.navigation.state.inbox,
        }
      }
    renderIcon(){
        if(this.props.stack == 'true')
            return <Text>data</Text>;
        return null;
    }
    openInbox(){
        this.props.navigation.navigate('Inbox')
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
        const { goBack } = this.props.navigation;
        return(
            
                <View style={styles.container}> 
                    { this.props.stack === 'true' ?
                        <TouchableWithoutFeedback
                        onPress={() =>{this.props.home? this.props.navigation.navigate(this.props.home) :goBack()} }>
                            <Icon
                                style ={styles.icon}
                                name="angle-left"
                                color= "white"
                                size={24}
                            />
                        </TouchableWithoutFeedback>
                        :   
                        <TouchableWithoutFeedback
                            onPress={() => {
                            const { navigate } = this.props.navigation.openDrawer();
                            }}>
                            <Icon
                                style ={styles.icon}
                                name="bars"
                                color= "white"
                                size={20}
                            />
                        </TouchableWithoutFeedback>
                    }    
                    <View style={styles.title}>
                        <Image
                            style={styles.iconHeader} 
                            source={require('../icons/RescatiPet.png')}
                        />  
                    </View>
                {this.props.inbox === 'true'?
                    <TouchableWithoutFeedback
                        onPress={() => this.openInbox()}>
                        <Icon
                            style ={styles.icon}
                            name="bell"
                            color= "white"
                            size={22}
                            solid
                        />
                    </TouchableWithoutFeedback>
                    :   null
                }
                {this.props.signout?
                    <TouchableWithoutFeedback
                        onPress={() => this.signOut()}>
                        <Icon
                            style ={styles.icon}
                            name="sign-out-alt"
                            color= "white"
                            size={22}
                            solid
                        />
                    </TouchableWithoutFeedback>
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
        width:width*0.75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container:{
        backgroundColor: Colors.primaryColor,
        height:40,
        alignItems: 'center',
        flexDirection: 'row',
        //marginBottom:10,
    },
    icon: {
        paddingHorizontal:15,

    },
})

