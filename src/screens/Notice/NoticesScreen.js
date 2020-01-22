import React from 'react';
import { StyleSheet, Text,View, Image, Dimensions,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
const {height, width} = Dimensions.get('window');
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style'

export default class NoticesScreen extends React.Component {
  openFormNotice(type_notice){
    console.log(type_notice);
    if(type_notice == 'SOS'){
      this.props.navigation.navigate('Form', { type: type_notice, info: false})
    }else{
      this.props.navigation.navigate('Form', { type: type_notice, info: true})
    }
  }
  openForo(){
    this.props.navigation.navigate('Login')
  }
  render(){ 
    
    return(
        <View style={{flex: 1}}>
          <Header {...this.props}/> 
          <View style={styles.noticesTitle}>
            <Text style={appStyle.textTitle}>Publicar Aviso</Text>
            <Text style={appStyle.textRegular}>¿Qué tipo de aviso deseas realizar?</Text>
          </View>
          <View style={[styles.notices,{marginTop:10}]}>
          <TouchableOpacity onPress={() => this.openFormNotice('Busqueda')}>
                <View style={styles.notice}>
                  <Image
                    style={styles.noticeIcon} 
                    source={require('../../icons/notice/wanted.png')}
                  /> 
                  <Text style={[styles.noticeTitle,{color:'#ffd492'}]}>Aviso de Búsqueda</Text>
                </View>
              </TouchableOpacity>   
              <TouchableOpacity onPress={() => this.openFormNotice('SOS')}>
                <View style={styles.notice}>
                  <Image
                    style={styles.noticeIcon} 
                    source={require('../../icons/notice/sos.png')}
                  /> 
                  <Text style={[styles.noticeTitle,{color:'#ff8a8a'}]}>Aviso de Emergencia</Text>
                </View>
              </TouchableOpacity>   
              
          </View>
          <View style={styles.notices}>
          <TouchableOpacity onPress={() => this.openFormNotice('Hallazgo')}>
                <View style={styles.notice}>
                <Image
                    style={styles.noticeIcon}
                    tintColor='#739973'
                    source={require('../../icons/notice/pet-found2.png')}
                  /> 
                  <Text style={[styles.noticeTitle,{color:'#81ab81'}]}>Aviso de Hallazgo</Text>
                </View>
              </TouchableOpacity>   
              <TouchableOpacity onPress={() => this.openForo()}>
                <View style={styles.notice}>
                <Image
                    style={styles.noticeIcon} 
                    tintColor='#540b78'
                    source={require('../../icons/notice/question-mark.png')}
                  /> 
                  <Text style={[styles.noticeTitle,{color:'#9E8ABC'}]}>Publicar en Foro</Text>
                </View>
              </TouchableOpacity>   
          </View>
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    noticesTitle:{
      marginTop:10,
      paddingBottom:10,
      marginHorizontal:20,
      paddingHorizontal:10,
      alignItems: 'center',
    },
    notices:{
      paddingVertical:10,
      marginHorizontal:20,
      paddingHorizontal:10,
      alignItems: 'center',
      flexDirection: 'row',
      height: height*0.32
    },
    notice:{
      borderWidth: 1.3,
      borderColor: Colors.lightGray,
      borderRadius: 4,
      marginHorizontal:10,
      paddingHorizontal:4,
      paddingVertical:4,
      width: width*0.36,
      height: height*0.28,
      alignItems: 'center',
      justifyContent: 'center'
    },
    noticeIcon:{
      width: 90,
      height: 90
    },
    noticeTitle:{
      fontSize: 16,
      textAlign: 'center',
      marginTop: 6,
      marginBottom:4,
      fontFamily: Fonts.OpenSansBold
    },
  });