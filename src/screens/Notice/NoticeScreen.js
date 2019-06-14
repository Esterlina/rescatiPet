import React from 'react';
import { StyleSheet, Text,View, Image, Dimensions,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
const {height, width} = Dimensions.get('window');

export default class NoticeScreen extends React.Component {
  openFormNotice(type_notice){
    //this.props.navigation.navigate('Form');  
    this.props.navigation.navigate('Form', { type: type_notice})
  }
  openForo(){
    this.props.navigation.navigate('Login')
  }
  render(){ 
    
    return(
        <View style={styles.container}>
          <Header {...this.props}/> 
          <View style={styles.noticesTitle}>
            <Text style={styles.title}>Publicar Aviso</Text>
            <Text style={styles.text}>¿Qué tipo de aviso deseas realizar?</Text>
          </View>
          <View style={[styles.notices,{marginTop:10}]}>
          <TouchableOpacity onPress={() => this.openFormNotice('busqueda')}>
                <View style={styles.notice}>
                  <Image
                    style={styles.noticeIcon} 
                    source={require('../../icons/notice/wanted.png')}
                  /> 
                  <Text style={[styles.noticeTitle,{color:'#ffd492'}]}>Aviso de Búsqueda</Text>
                </View>
              </TouchableOpacity>   
              <TouchableOpacity onPress={() => this.openFormNotice('emergencia')}>
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
          <TouchableOpacity onPress={() => this.openFormNotice('hallazgo')}>
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
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    noticesTitle:{
      paddingTop:25,
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
      borderColor: '#d6d7da',
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
    title:{
      fontSize: 24,
      color: 'gray',
      fontFamily: Fonts.OpenSansBold
    },
    text:{
      fontSize: 14,
      color: 'gray',
      fontFamily: Fonts.OpenSans
    },

  });