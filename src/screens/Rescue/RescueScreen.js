import React from 'react';
import { StyleSheet, Text,View,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../../components/Header';
import {connect} from 'react-redux'
import appStyle from '../../styles/app.style'

class RescueScreen extends React.Component {
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
              <TouchableOpacity>
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
              <TouchableOpacity>
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
              <TouchableOpacity>
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
              <TouchableOpacity>
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
          {this.options(this.props.user.tipo)}
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
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