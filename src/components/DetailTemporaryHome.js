import React from 'react';
import { StyleSheet, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../components/Header';
import UserAvatar from 'react-native-user-avatar';
import _ from 'lodash';
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';

class DetailTemporaryHome extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      loading: true,
    };
}

  render(){ 
    console.log(this.props.temporary_home)
    if(this.props.temporary_home == undefined){
         temporary_home = this.props.navigation.getParam('temporary_home')
    }
    else{
         temporary_home = this.props.temporary_home
    }
    return(
      <View style={styles.container}>
          {this.props.temporary_home == undefined? <Header {...this.props} stack='true' home='Home'/> :null}
        <ScrollView>
        <View style={appStyle.containerPublication}>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
              {temporary_home.usuario.perfil?
              <UserAvatar size="45" name={temporary_home.usuario.nombre} src={temporary_home.usuario.perfil}/>
              :
              <UserAvatar size="45" name={temporary_home.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {temporary_home.usuario.nombre.length < 30
                  ? `${temporary_home.usuario.nombre}`
                  : `${temporary_home.usuario.nombre.substring(0, 30)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>
                      {(temporary_home.tipo_hogar + " en " + temporary_home.comuna).length < 24
                    ? `${(temporary_home.tipo_hogar + " en " + temporary_home.comuna)}`
                    : `${(temporary_home.tipo_hogar + " en " + temporary_home.comuna).substring(0, 21)}...`}
                  </Text>          
                </View>
              </View>
              <Image
                source={require('../icons/rescue/house.png')}
                style= {{width:35,height:35,right:0,top:10, position:'absolute'}}
              />
            </View>  
            <View style={styles.parrafo}>
             <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet}]}>Características</Text> 
              <View style={styles.parrafo}>
                <View style={{flexDirection:'row',marginVertical:2}}>
                  <Icon name="user-clock" size={16} color={Colors.violet} style={{marginRight:6}} regular/>
                  <Text style={appStyle.textRegular}>Ocupacion: {temporary_home.ocupacion}</Text>
                </View>
                {temporary_home.niños?
                  <View style={{flexDirection:'row',marginVertical:2}}>
                    <Icon name="child" size={20} color={Colors.violet} style={{marginRight:10}} regular/>
                    <Text style={appStyle.textRegular}>Convive con niños</Text>               
                  </View>
                :null}
                {temporary_home.adultos_mayores?
                  <View style={{flexDirection:'row',marginVertical:2}}>
                    <Icon name="user" size={20} color={Colors.violet} style={{marginRight:8}} solid/>
                    <Text style={appStyle.textRegular}>Convive con adultos mayores</Text>               
                  </View>
                :null}
                {temporary_home.mascotas?
                  <View style={{flexDirection:'row',marginVertical:2}}>
                    <Icon name="paw" size={20} color={Colors.violet} style={{marginRight:6}} solid/>
                    <Text style={appStyle.textRegular}>Convive con {temporary_home.cantidad_mascotas} mascotas ({temporary_home.tipo_mascota}) </Text>               
                  </View>
                :null}
                <View style={{flexDirection:'row',marginVertical:2}}>
                  <Image
                  source={require('../icons/rescue/house.png')}
                  style= {{width:20,height:20,marginRight:6}}
                  />
                  <Text style={appStyle.textRegular}>Puede recibir a {temporary_home.tipo_rescatado} {temporary_home.tiempo == "Indefinido"? "Por tiempo indefinido": ("Durante " + temporary_home.tiempo + " Aproximadamente")}</Text>
                </View>
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet,marginVertical:5}]}>Contacto</Text> 
                    <View style={{flexDirection:'row',marginVertical:2}}>
                        <Icon name="envelope" size={18} color={Colors.gray} style={{marginRight:8}} regular/>
                        <Text style={appStyle.textRegular}>{temporary_home.usuario.correo}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginVertical:2}}>
                        <Icon name="phone" size={18} color={Colors.gray} style={{marginRight:8}} solid/>
                        <Text style={appStyle.textRegular}>{temporary_home.telefono}</Text>
                    </View>
                </View> 
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    parrafo:{
      marginLeft:5,
      marginRight: 8,
      paddingRight:5,
      marginVertical:5,
      textAlign:'justify'
    },
});

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};
export default connect(mapStateToProps)(DetailTemporaryHome);