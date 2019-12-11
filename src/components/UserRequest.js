import React from 'react';
import { StyleSheet, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../components/Header';
import UserAvatar from 'react-native-user-avatar';
import _ from 'lodash';
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
import {API} from '../keys';
const {height, width} = Dimensions.get('window');
class UserRequest extends React.Component {
  constructor(props) {
    super(props);
    this.isMounted = true;
    this.state = {
      loading: true,
      user_request: this.props.user_request
    };
}


  render(){ 
    user_request = this.state.user_request
    return(
      <View style={styles.container}>
        <ScrollView>
        <View style={[appStyle.containerPublication,{borderColor:Colors.primaryColor}]}>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
            <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {user_request.user_id == this.props.user.id? this.props.navigation.navigate('Perfil'):this.props.navigation.navigate('User', { user_id: user_request.user_id})}}>
              {user_request.profile_picture?
              <UserAvatar size="45" name={user_request.nombre} src={user_request.profile_picture}/>
              :
              <UserAvatar size="45" name={user_request.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {user_request.nombre.length < 30
                  ? `${user_request.nombre}`
                  : `${user_request.nombre.substring(0, 30)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>
                      {(user_request.comuna + ", " + user_request.provincia).length < 24
                    ? `${(user_request.comuna + ", " + user_request.provincia)}`
                    : `${(user_request.comuna + ", " + user_request.provincia).substring(0, 21)}...`}
                  </Text>          
                </View>
              </View>
              </TouchableOpacity>
              <Image
                source={require('../icons/rescue/human.png')}
                style= {{width:35,height:35,right:0,top:10, position:'absolute'}}
              />
            </View>  
            <View style={styles.parrafo}>
             <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.primaryColor}]}>Solicitud</Text> 
              <View style={styles.parrafo}>
                <Text style={appStyle.textSemiBold}>Estado: <Text style={[appStyle.textRegular,{color: Colors.primaryColor}]}>{user_request.estado}</Text></Text>
                <Text style={appStyle.textSemiBold}>Rol solicitado: <Text style={[appStyle.textRegular]}>{user_request.rol_solicitado}</Text></Text>
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.primaryColor,marginVertical:5}]}>Experiencia</Text> 
                {user_request.length == 0?
                <Text>El usuario no seleccionó tener experiencia en las situaciones presentadas</Text>
                :
                user_request.situaciones.map((situacion,i) => {
                    return(
                    <View key={i} style={{flexDirection:'row',marginVertical:2}}>
                        <Icon name="check" size={18} color={Colors.primaryColor} style={{marginRight:8}} regular/>
                        <Text style={appStyle.textRegular}>{situacion.nombre}</Text>
                    </View>
                    )
                })
                }
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.primaryColor,marginVertical:5}]}>Contacto</Text> 
                    <View style={{flexDirection:'row',marginVertical:2}}>
                        <Icon name="envelope" size={18} color={Colors.gray} style={{marginRight:8}} regular/>
                        <Text style={appStyle.textRegular}>{user_request.email}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginVertical:2}}>
                        <Icon name="phone" size={18} color={Colors.gray} style={{marginRight:8}} solid/>
                        <Text style={appStyle.textRegular}>{user_request.telefono}</Text>
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
export default connect(mapStateToProps)(UserRequest);