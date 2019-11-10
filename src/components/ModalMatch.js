import React, {Component} from 'react';
import {
    View,
    StyleSheet,
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
import {Colors} from '../styles/colors';
import appStyle from '../styles/app.style'

const {height} = Dimensions.get('window')
export default class ModalMatch extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
          };
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
                            <Text key={rescuer.id} style={[appStyle.textSemiBold,{marginLeft:10}]}>
                            {rescuer.nombre}</Text>
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
                <SmallNotice request_sos = {match.solicitud} notice = {match.notice} navigation={this.props.navigation} update = {this.props.update.bind(this)}/>
                <View style={{flex:1,marginHorizontal:15}}>
                    <View style={{flexDirection:'row'}}>
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
                    </View>
                    <ScrollView style={{height:height*0.22,padding:5}}>
                        <View style={{marginBottom:5}}>
                            <Text style={[appStyle.textRegular,{textAlign:'justify'}]}>{match.mensaje}</Text>
                            {this.displayContact(type,match)}
                        </View>
                    </ScrollView>
                {type == "Sugerencias-Rescatistas" && match.rescatistas_sugeridos.length > 0 ? this.displayRescuer(match.rescatistas_sugeridos) : null}
                {type == "Sugerencias-Avisos" && match.avisos_sugeridos.length > 0? this.displayNotices(match.avisos_sugeridos) : null}
                </View>
                <View style={{justifyContent: 'center',alignItems:'center'}}>
                    <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                    onPress={() => this.props.update(false)}>
                        <Text style={appStyle.TextModalButton}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>    
          </View>
        )
    }
}


