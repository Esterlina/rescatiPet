import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import {Fonts} from '../utils/Fonts';
import appStyle from '../styles/app.style'
import {Colors} from '../styles/colors'
import UserAvatar from 'react-native-user-avatar';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome';

const {width,height} = Dimensions.get('window')
export default class TagRescued extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modal:false
        };
      }

    render(){
        const rescueds = this.props.rescueds;
        return(
            <View>
                <Modal isVisible={this.state.modal} style={{margin:20}}>
                <View style={{backgroundColor:'white',height:height*0.65,borderRadius:8}}>
                    <View style={[appStyle.headerModal,{position:'absolute',top:0,width:width-40}]}>
                        <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Rescatados</Text>
                    </View>
                    <ScrollView style={{height:height*0.6,marginTop:50}}>
                        <View style={[appStyle.lineTop]}>
                        {rescueds.map((rescued) => {
                            return(
                                <View key={rescued.id} style={[appStyle.lineBottom]}>
                                    <TouchableOpacity onPress={() => this.setState({modal:false},()=>{this.props.navigation.navigate('Rescued',{rescued_id: rescued.id})}) }>
                                        <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                                            <UserAvatar size="40" name={rescued.nombre} src={rescued.profile_picture}/>
                                            <Text style={[appStyle.textSemiBold,{marginLeft:10}]}>{rescued.nombre}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                        </View>
                    </ScrollView>
                    <View style={{marginBottom:10,alignSelf:'center'}}>
                        <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                        onPress={() =>this.setState({modal:false })}>
                        <Text style={{fontSize:16,textAlign:'center'}}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.primaryColor}]}>Etiquetas</Text> 
                <TouchableOpacity style={{flexDirection:'row'}} onPress={() =>this.setState({modal:true })}>
                    <UserAvatar size="25" name={rescueds[0].nombre} src={rescueds[0].profile_picture}/>
                    <Text style={[appStyle.textRegular],{marginLeft:4,textDecorationLine:'underline'}}>{rescueds[0].nombre}{rescueds.length==1? null : " y " + (rescueds.length-1).toString() + " rescatado(s) más"}</Text>
                </TouchableOpacity>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    tag:{
        alignSelf: 'flex-end',
        position: "absolute",
        top: -10,
        right: 0,
        width: width*0.3,
        height:30
    },
    subTag:{
        flexDirection:'row',
        paddingHorizontal:5,
        paddingVertical:2,
    }
})

