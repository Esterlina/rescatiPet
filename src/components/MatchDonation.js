import React, {Component} from 'react';
import {
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import { API} from '../keys';
import firebase from 'react-native-firebase'
import {Colors} from '../styles/colors';
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
import NumericInput from 'react-native-numeric-input'
import SelectProfile from '../components/SelectProfle'
import Modal from "react-native-modal";
const {width,height} = Dimensions.get('window')
class MatchDonation extends Component{

    constructor(props) {
        super(props);
        this.state = {
            //phone: this.props.user.telefono,
            donated_items: [],
            donor: '',
            external_donor: false,
          };
      }
      componentDidMount(){
        this.firebaseToken();
        var newItems = this.props.campaign.donation_items.map((item) => {
            nuevoItem = {...item}
            nuevoItem.cantidad = 0
            return nuevoItem
        })
        this.setState({donated_items: newItems})
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



      validateDonation(up){
        if(!up){
            if(!this.state.external_donor && this.state.donor==''){
                alert("Por favor, seleccione un donador.")
                return false 
            }
            else if(this.state.external_donor && this.state.donor != ''){
                this.setState({external_donor:false},() =>{
                    alert("Por favor, solo ingresa una de las opciones de donadores (ingrese el usuario donador o marqué persona externa según corresponda).")
                    return false
                })
            }
        }
        for (i = 0; i < this.state.donated_items.length; i++) {
            if(this.state.donated_items[i].cantidad != 0){
                if(up){
                    this.sendMatch()
                }else{
                    this.sendDonated()
                }
                return true
            }
        }
        alert("No haz seleccionado ningun item para hacer el UP")
        return false 
      }

      sendMatch(){
        this.setState({modalSend:true,loading:true})
        fetch(API + 'matches/up_campaign', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        },
        body: JSON.stringify({
            campaign_id: this.props.campaign.id,
            donated_items: this.state.donated_items,
        }), 
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            Alert.alert(
                'Up enviado',
                responseJson['mensaje'],
                [{text: 'OK', onPress: () => this.props.update(false)}],
                {cancelable:false}
            )
        }).catch((error) =>{
            this.setState({response: error})
            console.error(error);
        });
      }
      sendDonated(){
        this.setState({modalSend:true,loading:true})
        fetch(API + '/donation_campaigns/up_donation', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        },
        body: JSON.stringify({
            campaign_id: this.props.campaign.id,
            donated_items: this.state.donated_items,
            donor_id:this.state.donor.id,
            external_donor: this.state.external_donor
        }), 
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            Alert.alert(
                'Donaciones actualizadas',
                '¡Campaña actualizada con exito!.',
                [{text: 'OK', onPress: () => {this.props.updateCampaign(responseJson);this.props.update(false)}}],
                {cancelable:false}
            )
        }).catch((error) =>{
            this.setState({response: error})
            console.error(error);
        });
      }
    updateDonor(donor){
    this.setState({donor:donor})
    }
    updateItemNumber(index,number){
        let items = this.state.donated_items
        item = {cantidad: number, item: items[index].item}
        items[index] = item
        this.setState({donated_items: items})
    }  
    render(){
        campaign = this.props.campaign
        if(campaign.usuario.id != this.props.user.id){up = true}else{up=false}
        console.log(this.props.user.telefono)
        return(
            <View>
                <Modal isVisible={this.props.isVisible} style={{margin:20}}>
                    <View style={[appStyle.modalContainer,{height:height*0.6,paddingVertical:0}]}>
                        <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
                            <View style={[appStyle.headerModal,{backgroundColor: Colors.violet,top:0,width:width-40}]}>
                                <Text style={[appStyle.textTitle,{color:'white'}]}>{up? "¡He donado!" : "Actualizar donaciones"}</Text>
                            </View>
                            <View style={{marginHorizontal:15,position:'absolute',top:50}}>
                                {up?
                                <Text style={appStyle.textRegular,{textAlign:'justify'}}>Si haz realizado un aporte a esta campaña y la publicación no se encuentra actualizada, puedes solicitar que el dueño edite la publicación.</Text>
                                :
                                <Text style={appStyle.textRegular,{textAlign:'justify'}}>Para agregar una donación, ingrese las cantidades donadas por cada producto.</Text>
                                }
                                <ScrollView style={{alignContent:'center',marginVertical:10,height:(up? height*0.25 : height*0.15 ),backgroundColor:'white'}}>
                                    {campaign.donation_items.map((item,index) => {
                                        return(
                                            this.state.donated_items.length > 0?
                                                <View key={index} style={{flexDirection:'row',marginVertical:5}}>
                                                {item.cantidad == 0? 
                                                <CheckBox
                                                checked={this.state.donated_items[index].cantidad == 1? true: false}
                                                onPress={() => this.updateItemNumber(index,(this.state.donated_items[index].cantidad == 0? 1: 0))}
                                                checkedColor = {Colors.green}
                                                size={35}
                                                containerStyle = {{borderWidth:0,backgroundColor:'white',justifyContent:'center',margin:0,marginLeft:10,marginRight:10,padding:0}}
                                                />
                                                :
                                                <NumericInput onChange={value => this.updateItemNumber(index,value)} value={this.state.donated_items[index].cantidad} type='up-down' totalHeight={30} iconSize={25} valueType='real' minValue={0} totalWidth={width*0.15} rounded/>
                                                }
                                                <Text style={appStyle.textSemiBold,{alignSelf:'center',marginLeft:5,flexWrap:'wrap',flex:1}}>{item.item}.</Text>
                                                </View>
                                            :null
                                        )
                                    })}
                                </ScrollView>
                                {up? null:
                                    <View>
                                        <Text style={[appStyle.textSemiBold]}>¿Quién realizó la donación?</Text>
                                        <SelectProfile type = {'user'} placeholder = {"Buscar usuario"} multiple={false} selectedItem={this.state.donor} update = {this.updateDonor.bind(this)} color = {Colors.violet}/>
                                        <View style={{flexDirection:'row',marginBottom:5,backgroundColor:'white',position:'absolute',top:65}}>
                                            <CheckBox
                                                checked={this.state.external_donor}
                                                onPress={() => this.setState({external_donor: !this.state.external_donor})}
                                                checkedColor = {Colors.green}
                                                size={25}
                                                containerStyle = {{borderWidth:0,backgroundColor:'white',justifyContent:'center',margin:0,marginLeft:0,marginRight:5,padding:0}}
                                                />
                                            <Text style={[appStyle.textRegular,{alignSelf:'center'}]}>Persona(s) externa a la aplicación.</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                        <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch',paddingBottom:10}}>
                            <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                            onPress={() => this.props.update(false)}>
                                <Text style={appStyle.TextModalButton}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal,{backgroundColor: Colors.violet,borderWidth: 0}]}
                                onPress={() => {this.validateDonation(up)}}>
                                <Text style={[appStyle.TextModalButton,{color:'white'}]}>{up? "Enviar": "Aceptar"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
          </Modal>
          </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      user: state.userReducer,
    };
  };
  export default connect(mapStateToProps)(MatchDonation);
