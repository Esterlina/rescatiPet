import React, {Component} from 'react';
import {
    View,
    Alert,
    Dimensions,
    Text,
    TouchableOpacity,
    
} from 'react-native'
import {Fonts} from '../utils/Fonts';
import UserAvatar from 'react-native-user-avatar';
import SmallNotice from '../components/SmallNotice';
import Moment from 'moment';
import 'moment/locale/es';
import { ScrollView } from 'react-native-gesture-handler';
import { API} from '../keys';
import {Colors} from '../styles/colors';
import appStyle from '../styles/app.style'
import { CheckBox } from 'react-native-elements'
import {connect} from 'react-redux';
const {height,width} = Dimensions.get('window')
class ModalMatch extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            donated_items:(this.props.match.tipo_publicacion == 'DonationCampaign'? this.props.match.campaign.donaciones : [])
          };
      }

    updateUp(){
            this.setState({modalSend:true,loading:true})
            fetch(API + 'donation_campaigns/approve_up', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                campaign_id: this.props.match.campaign.id,
                donated_items: this.state.donated_items,
            }), 
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                Alert.alert(
                    'Up listo',
                    responseJson['mensaje'],
                    [{text: 'OK', onPress: () => this.props.update(false)}],
                    {cancelable:false}
                )
            }).catch((error) =>{
                this.setState({response: error})
                console.error(error);
            });
    }
    updateItem(index,value){
        var newItems = this.state.donated_items.map((item,i) => {
            nuevoItem = {...item}
            if(i == index){nuevoItem.aprobado = value} 
            return nuevoItem
        })
        this.setState({donated_items: newItems})
    }  
    displayContact(type,match){
        if(type == "Usuario-Avisos" || type == "Solicitud-Aceptada"){
            return(
                <Text style={[appStyle.textRegular,{marginTop:5,textAlign:'justify'}]}>Puedes contactarte con <Text style={{fontFamily:Fonts.OpenSansBold}}  selectable>{match.emisor.nombre}</Text>  mediante su correo <Text style={{textDecorationLine:'underline',color: Colors.primaryColor,fontFamily:Fonts.OpenSansSemiBold}}>{match.emisor.correo}</Text>
                    {match.emisor.telefono? <Text style={[appStyle.textRegular,{textAlign:'justify'}]}> o por su número telefónico <Text style={{textDecorationLine:'underline',color: Colors.primaryColor,fontFamily:Fonts.OpenSansSemiBold}}>{match.emisor.telefono}</Text></Text>: null}
                </Text>
            )
        }
    }
    displayNotices(notices){
        return(
            <ScrollView style = {{backgroundColor: 'white', height: height*0.5}}>
                <View style = {{borderTopWidth:1, borderTopColor: Colors.lightGray}}>
                    {notices.map((notice) => {
                        return(
                        <View key={notice.id} style={{borderBottomColor: Colors.lightGray, borderBottomWidth:1}}>
                            <TouchableOpacity key={notice.id} onPress={() => {this.props.update(false);this.props.navigation.navigate('DetailNotice', { notice: notice})}}>
                                <SmallNotice key={notice.id} suggestion= {true} notice= {notice} navigation={this.props.navigation} update = {this.props.update.bind(this)}/>
                            </TouchableOpacity>
                           
                        </View>
                    )
                    })}
                </View>
            </ScrollView>
        )
    }
    displayItems(){
        return(
        <ScrollView style = {{backgroundColor: 'white', height: height*0.5}}>
            <View style={{flexDirection:'row',marginTop:10}}>
                <View style={{width:width*0.6}}>
                    <Text style={[appStyle.textBold,{alignSelf:'center'}]}> Donación </Text>
                </View>
                <View style={{alignSelf:'center',width:width*0.2}}>
                    <Text style={[appStyle.textBold,{alignSelf:'center'}]}> Aprobar </Text>
                </View>
            </View>
            <View style = {{borderTopWidth:1, borderTopColor: Colors.lightGray, marginTop: 10}}>
                {this.state.donated_items.map((item,index) => {
                    var color = Colors.green
                    var estado = "Aceptada" 
                    if(!this.state.donated_items[index].aprobado){
                        color = Colors.red
                        estado = "Rechazada"
                    }
                    return(
                    <View key={item.id} style={{borderBottomColor: Colors.lightGray, borderBottomWidth:1, padding:5, flexDirection: 'row', alignItems:'center'}}>
                        <View style={{ width: width*0.6}}>
                            <Text style={[appStyle.textSemiBold,{marginLeft:10}]}>{item.cantidad} {item.item}.</Text>
                        </View>
                        <View style={{ width:width*0.2, alignItems:'center'}}>
                            {this.props.match.campaign.listo? 
                            <View style={{alignSelf: 'flex-end' , backgroundColor: color, padding:4,width:90, alignItems:'center'}}>
                                <Text style={[appStyle.textSemiBold,{color:'white'}]}>{estado}</Text>
                            </View>
                            :
                            <CheckBox
                            checked={this.state.donated_items[index].aprobado}
                            onPress={() => this.updateItem(index,(!this.state.donated_items[index].aprobado))}
                            checkedColor = {Colors.green}
                            size={35}
                            containerStyle = {{borderWidth:0,margin:0,padding:0}}
                            />
                            }
                            
                        </View>
                    </View>
                )
                })}
            </View>
        </ScrollView>
        )
    }

    displayRescuer(rescuers){
        return(
            <ScrollView style = {{backgroundColor: 'white', height: height*0.5}}>
                <View style = {{borderTopWidth:1, borderTopColor: Colors.lightGray, marginTop: 10}}>
                    {rescuers.map((rescuer) => {
                        var color = Colors.calipso
                        var estado = "Pendiente"
                        if(rescuer.solicitud.aceptado == true){
                            color = Colors.green
                            estado = "Aceptada"
                        }
                        if(rescuer.solicitud.rechazado == true){
                            color = Colors.red
                            estado = "Rechazada"
                        }
                        return(
                        <View key={rescuer.id} style={{borderBottomColor: Colors.lightGray, borderBottomWidth:1, padding:5, flexDirection: 'row', alignItems:'center'}}>
                            <UserAvatar size="45" name={rescuer.nombre} colors={[ '#ccaabb']}/>
                            <View style={{width:width - 220}}>
                            <Text key={rescuer.id} style={[appStyle.textSemiBold,{marginLeft:10,textAlign:'left'}]}>
                            {rescuer.nombre}</Text>
                            </View>
                            <View style={{alignSelf: 'flex-end', position: "absolute", right:5, top:14 , backgroundColor: color, padding:4,width:90, alignItems:'center'}}>
                                <Text style={[appStyle.textSemiBold,{color:'white'}]}>{estado}</Text>
                            </View>
                        </View>
                    )
                    })}
                </View>
            </ScrollView>
        )
    }

    render(){
        const match = this.props.match;
        const type = match.tipo
        console.log(match)
        Moment.locale('es')
        return(
            <View style={[appStyle.modalContainer,{paddingVertical:15, height: (type == "Sugerencias-Rescatistas" && match.rescatistas_sugeridos.length > 0 )|| (type == "Sugerencias-Avisos"  && match.avisos_sugeridos.length > 0)? height*0.85 : height*0.7}]}>
            <View style={{flex:1}}>
                {match.tipo_publicacion == 'Notice' ?
                    <SmallNotice request_sos = {match.solicitud} notice = {match.notice} navigation={this.props.navigation} update = {this.props.update.bind(this)}/>
                :null}
                <View style={{flex:1,marginHorizontal:15}}>
                    <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {this.props.update(false);match.emisor.id == this.props.user.id? this.props.navigation.navigate('Perfil'):this.props.navigation.navigate('User', { user_id: match.emisor.id})}}>
                        {match.emisor.perfil?
                        <UserAvatar size="60" name={match.emisor.nombre} src={match.emisor.perfil}/>
                        :
                        <UserAvatar size="60" name={match.emisor.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                        }
                        <View style={{justifyContent:'center',marginHorizontal:4}}>
                            <Text style={[appStyle.textBold,{fontSize:16}]}>{match.emisor.nombre}</Text>
                            <Text style={[appStyle.textBold,{color:Colors.primaryColor}]}>
                                {match.hora_creacion}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={{height:height*0.22,padding:5}}>
                        <View style={{marginBottom:5}}>
                            <Text style={[appStyle.textRegular,{textAlign:'justify'}]}>{match.mensaje}</Text>
                            {this.displayContact(type,match)}
                        </View>
                    </ScrollView>
                {type == "Sugerencias-Rescatistas" && match.rescatistas_sugeridos.length > 0 ? this.displayRescuer(match.rescatistas_sugeridos) : null}
                {type == "Sugerencias-Avisos" && match.avisos_sugeridos.length > 0? this.displayNotices(match.avisos_sugeridos) : null}
                {type == "Up-Campaña" && match.campaign.donaciones.length > 0 ? this.displayItems() :null}
                </View>
                {type == 'Up-Campaña' && !match.campaign.listo?
                    <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
                        <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                        onPress={() => this.props.update(false)}>
                            <Text style={appStyle.TextModalButton}>Cerrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal,{backgroundColor: Colors.primaryColor,borderWidth: 0}]}
                            onPress={() => {this.updateUp()}}>
                            <Text style={[appStyle.TextModalButton,{color:'white'}]}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                        <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                        onPress={() => this.props.update(false)}>
                            <Text style={appStyle.TextModalButton}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>        
                }
               
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
  export default connect(mapStateToProps)(ModalMatch);