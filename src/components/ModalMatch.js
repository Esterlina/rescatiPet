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

const {width,height} = Dimensions.get('window')
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
            <View style={{backgroundColor:'white',height:height*0.7,maxHeight:height*0.8,borderRadius:8,paddingVertical:15}}>
            <View style={{flex:1}}>
                <SmallNotice notice = {match.notice} navigation={this.props.navigation} update = {this.props.update.bind(this)}/>
                <View style={{flex:1,marginHorizontal:15}}>
                    <View style={{flexDirection:'row'}}>
                        <UserAvatar size="65" name={match.emisor.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                        <View style={{justifyContent:'center',marginHorizontal:4}}>
                            <Text style={{color:'gray',fontFamily:Fonts.OpenSansBold,fontSize:16}}>{match.emisor.nombre}</Text>
                            <Text style={{color:'#66D2C5',fontFamily:Fonts.OpenSansBold,fontSize:14}}>
                                {match.hora_creacion}
                            </Text>
                        </View>
                    </View>
                    <ScrollView style={{height:height*0.22,padding:5}}>
                        <View style={{marginBottom:5}}>
                            <Text style={{color:'gray',fontFamily:Fonts.OpenSans,fontSize:14,textAlign:'justify'}}>{match.mensaje}</Text>
                            <Text style={{marginTop:5,textAlign:'justify',fontFamily:Fonts.OpenSans,fontSize:14}}>Puedes contactarte con <Text style={{fontFamily:Fonts.OpenSansBold}}  selectable>{match.emisor.nombre}</Text>  mediante su correo <Text style={{textDecorationLine:'underline',color:'#66D2C5',fontFamily:Fonts.OpenSansSemiBold}}>{match.emisor.correo}</Text>
                                {match.emisor.telefono? <Text style={{textAlign:'justify',fontFamily:Fonts.OpenSans,fontSize:14}}> o por su número telefónico <Text style={{textDecorationLine:'underline',color:'#66D2C5',fontFamily:Fonts.OpenSansSemiBold}}>{match.emisor.telefono}</Text></Text>: null}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
                <View style={{justifyContent: 'center',alignItems:'center'}}>
                    <TouchableOpacity style={[styles.buttonLitle,styles.buttonsModal]}
                    onPress={() => this.props.update(false)}>
                        <Text style={{fontSize:18}}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>    
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
    text: {
        color:'white',
        fontFamily:Fonts.OpenSansBold,
        fontSize:16,
        textAlign:'center'
    },
    buttonLitle:{
        borderWidth: 1.3,
        borderColor: '#d6d7da',
        borderRadius: 8,
        margin:10,
        marginBottom:0,
        paddingVertical:5,
        paddingHorizontal:10,
      },
    buttonsModal:{
        backgroundColor:'white',
        width:width*0.35,
        alignItems:'center'
    },
    headerModal:{
        //backgroundColor:'#66d2c5',
        borderTopEndRadius:8,
        borderTopStartRadius:8,
        height:height*0.06,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10
    },inputArea:{
        color:'gray',
        fontSize:14,
        borderColor: '#d6d7da',
        textAlignVertical: "top",
        borderWidth: 1.3,
        maxHeight: 100,
        //borderColor: '#66D2C5',
        borderRadius: 8,
        marginVertical:5,
        marginHorizontal:0,
        paddingVertical:1,
        paddingHorizontal:10,
      }
})

