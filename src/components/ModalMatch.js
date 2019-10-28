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

    render(){
        const match = this.props.match;
        Moment.locale('es')
        return(
            <View style={[appStyle.modalContainer,{paddingVertical:15}]}>
            <View style={{flex:1}}>
                <SmallNotice notice = {match.notice} navigation={this.props.navigation} update = {this.props.update.bind(this)}/>
                <View style={{flex:1,marginHorizontal:15}}>
                    <View style={{flexDirection:'row'}}>
                        <UserAvatar size="65" name={match.emisor.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
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
                            <Text style={[appStyle.textRegular,{marginTop:5,textAlign:'justify'}]}>Puedes contactarte con <Text style={{fontFamily:Fonts.OpenSansBold}}  selectable>{match.emisor.nombre}</Text>  mediante su correo <Text style={{textDecorationLine:'underline',color: Colors.primaryColor,fontFamily:Fonts.OpenSansSemiBold}}>{match.emisor.correo}</Text>
                                {match.emisor.telefono? <Text style={[appStyle.textRegular,{textAlign:'justify'}]}> o por su número telefónico <Text style={{textDecorationLine:'underline',color: Colors.primaryColor,fontFamily:Fonts.OpenSansSemiBold}}>{match.emisor.telefono}</Text></Text>: null}
                            </Text>
                        </View>
                    </ScrollView>
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


