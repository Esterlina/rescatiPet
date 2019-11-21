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
const {width,height} = Dimensions.get('window')

class MatchDonation extends Component{

    constructor(props) {
        super(props);
        this.state = {
            phone: this.props.user.telefono,
            donated_items: [],
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

      validateDonation(){
        for (i = 0; i < this.state.donated_items.length; i++) {
            if(this.state.donated_items[i].cantidad != 0){
                this.sendMatch()
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
    updateItemNumber(index,number){
        let items = this.state.donated_items
        item = {cantidad: number, item: items[index].item}
        items[index] = item
        this.setState({donated_items: items})
    }  
    render(){
        campaign = this.props.campaign
        console.log(this.props.user.telefono)
        return(
            <View style={[appStyle.modalContainer,{height:height*0.6}]}>
            <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
                <View style={[appStyle.headerModal,{backgroundColor:'white'}]}>
                    <Text style={appStyle.textTitle}>¡HE DONADO!</Text>
                </View>
                <View style={{marginHorizontal:15,position:'absolute',top:60}}>
                    <Text style={appStyle.textRegular,{textAlign:'justify'}}>Si haz realizado un aporte a esta campaña y la publicación no se encuentra actualizada, puedes enviar un UP para que el dueño edite la publicación.</Text>
                    <ScrollView style={{alignContent:'center',marginVertical:20,height:height*0.2}}>
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
                </View>
                <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                    onPress={() => this.props.update(false)}>
                        <Text style={appStyle.TextModalButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal,{backgroundColor: Colors.primaryColor,borderWidth: 0}]}
                        onPress={() => {this.validateDonation()}}>
                        <Text style={[appStyle.TextModalButton,{color:'white'}]}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>    
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
