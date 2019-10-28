import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'
import {Fonts} from '../utils/Fonts';
import appStyle from '../styles/app.style'

const {width,height} = Dimensions.get('window')
export default class Tag extends Component{

    constructor(props) {
        super(props);
      }

    render(){
        const type = this.props.type;
        return(
                <View style={{flex:1}}> 
                    
                    { type === 'SOS' ?
                        <View style={styles.tag}>
                            <View style={[styles.subTag,{backgroundColor:'#ee1212'}]}>
                            <Image
                                    style={{width:22,height:22,marginHorizontal:10}} 
                                    tintColor='white'
                                    source={require('../icons/notice/siren.png')}
                                /> 
                                <Text style={appStyle.textTag}>SOS</Text>
                            </View>
                        </View>
                        :   
                        type === 'Busqueda' ?
                        <View style={styles.tag}>
                            <View style={[styles.subTag,{backgroundColor:'#ffa41c'}]}>
                                <Image
                                style={{width:20,height:20,marginHorizontal:2}} 
                                tintColor='white'
                                source={require('../icons/notice/magnifier.png')}
                                /> 
                                <Text style={[appStyle.textTag,{fontSize:16}]}>Se Busca</Text>
                            </View>
                        </View>
                       :
                       <View style={styles.tag}>
                        <View style={[styles.subTag,{backgroundColor:'#81ab81'}]}>
                            <Text style={[appStyle.textTag,{fontSize:16}]}>Encontrado</Text>
                        </View>
                    </View>
                    }                                                
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

