import React from 'react';
import { StyleSheet, Text,View,Image,TouchableOpacity} from 'react-native';
import {API} from '../../keys';
import Header from '../../components/Header';
import {connect} from 'react-redux'
import appStyle from '../../styles/app.style'

class RescueScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temporary_home:{},
    };
}
  getTemporaryHome(){
    console.log("CHECKEANDO SI HAY HOGAR TEMPORAL")
    return fetch(API + 'temporary_homes/user/' + this.props.user.id)
      .then((response) => response.json())
      .then((responseJson) => {
          console.log("IMPRIMIRE LA RESPUESTA")
          console.log(responseJson)
      this.setState({
          temporary_home: responseJson['temporary_homes'],
      },()=> {
        console.log("VAMOS A DIRIGIR LA RESPUESTA")
        if(this.state.temporary_home.length == 0){
          console.log("EL LARGO ES CERO")
          this.props.navigation.navigate('TemporaryHomeForm')
        }
        else{
          console.log("TE ENVIAREMOS AL DETALLE")
          this.props.navigation.navigate('DetailTemporaryHome',{ temporary_home: this.state.temporary_home[0]})
        }
      });
      })
      .catch((error) =>{
      console.error(error);
    });
  }
  options(type){
    console.log(type)
    if(type == "Fundacion" || type == "Rescatista"){
      return(
        <View style={{marginHorizontal:15}}>
          <Text style={[appStyle.textBold,{alignSelf:'center',fontSize: 18}]}> Publicar </Text>
          <View style = {appStyle.lineTop}>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/notepad.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Historia/Estado</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('CampaignForm')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/donation.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Campaña de donación</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('RequestTemporaryHome')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/house.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Solicitar hogar temporal</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity  onPress={() => this.props.navigation.navigate('AdoptionForm')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/adoption.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Dar en adopción</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity  onPress={() => this.props.navigation.navigate('EventForm')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/calendar.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Crear evento</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    else{
      return(
      <View style={{marginHorizontal:15}}>
          <Text style={[appStyle.textBold,{alignSelf:'center',fontSize: 18}]}> ¿Deseas ayudar? </Text>
          <View style = {appStyle.lineTop}>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity onPress={() => this.getTemporaryHome()}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/house.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Disponer hogar temporal</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[appStyle.lineBottom]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Adoptions')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/adoption.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Adoptar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </View>
      )
    }
  }   

  render(){ 
    return(
        <View style={styles.container}>
          <Header {...this.props}/> 
          <View style={{marginTop:10}}>
            {this.options(this.props.user.tipo)}
          </View>
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const mapStateToProps = (state) => {
    console.log('State:');
    console.log(state);  // Redux Store --> Component
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
  }
  
  export default connect(mapStateToProps)(RescueScreen);