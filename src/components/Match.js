import React, {Component} from 'react';
import {
    View,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native'
import {Fonts} from '../utils/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API} from '../keys';
import firebase from 'react-native-firebase'
import {Colors} from '../styles/colors';
import appStyle from '../styles/app.style'

const {width,height} = Dimensions.get('window')

export default class Match extends Component{

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            message:'',
            token: '',
          };
      }
      componentDidMount(){
        this.firebaseToken();
      }

      async firebaseToken() {
        const currentUser = firebase.auth().currentUser
      
         if (currentUser) {
        // reaches here
          const idToken = await currentUser.getIdToken();
          console.log("IMPRIMIRE EL TOKEN A ENVIAR:");
          console.log(idToken);
        // never reaches here
        this.setState({token: idToken})
        return idToken
        }
      }
      validateMatch(){
          if (this.state.message == ""){
            alert("No tiene ningún mensaje para enviar")
          }
          else{
              this.sendMatch()
          }
      }
      sendMatch(){
        this.setState({modalSend:true,loading:true})
        fetch(API + 'matches', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        },
        body: JSON.stringify({
            notice_id: this.props.notice.id,
            message: this.state.message,
            phone: this.state.phone
        }), 
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            Alert.alert(
                'Match enviado',
                responseJson['mensaje'],
                [{text: 'OK', onPress: () => this.props.update(false)}],
                {cancelable:false}
            )
        }).catch((error) =>{
            this.setState({response: error})
            console.error(error);
        });
      }

    render(){
        return(
            <View style={appStyle.modalContainer}>
            <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
                <View style={[appStyle.headerModal,{backgroundColor:'white'}]}>
                    <Text style={appStyle.textTitle}>ENVIAR MATCH</Text>
                </View>
                <View style={{marginHorizontal:15}}>
                    <Text style={appStyle.textRegular,{textAlign:'justify'}}>Escribe un mensaje explicándole a {this.props.notice.usuario.nombre} el motivo de tu match. Le enviaremos tu correo electrónico para que se ponga en contacto contigo, tambíen puedes agregar tu número tenefónico para contactarte de forma más rápida.</Text>
                    <View style={{flexDirection:'row'}}>
                        <View style={{marginVertical:10,paddingHorizontal:5,paddingTop:16,flexDirection:'row'}}>
                            <Icon name="phone-square" size={28} color='#09d261' style={{marginBottom:0,marginTop:-3,marginRight:5,marginLeft:10,justifyContent:'center'}} solid/>
                            <Text style={{fontSize:14,fontFamily:Fonts.OpenSansSemiBold}}>+56</Text>
                        </View>
                        <TextInput
                            style = {[appStyle.inputArea,appStyle.textRegular,{textAlignVertical:'center',width:width*0.56,marginVertical:20}]}
                            onChangeText={(value) => this.setState({phone: value})}
                            placeholder = {'9'}
                            placeholderTextColor = {'gray'}                         
                        />
                    </View>
                    <TextInput
                        style = {[appStyle.inputArea,{paddingTop:5,}]}
                        placeholder = {'Ingresar mensaje ...'}
                        placeholderTextColor = {'gray'}
                        multiline={true}
                        numberOfLines={5}
                        onChangeText={(value) => this.setState({message: value})}
                    />
                </View>
                <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                    onPress={() => this.props.update(false)}>
                        <Text style={appStyle.TextModalButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal,{backgroundColor: Colors.primaryColor,borderWidth: 0}]}
                        onPress={() => this.validateMatch()}>
                        <Text style={[appStyle.TextModalButton,{color:'white'}]}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>    
          </View>
        )
    }
}

