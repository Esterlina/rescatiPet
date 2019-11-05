import React from 'react';
import { StyleSheet, Text,View,ActivityIndicator,ScrollView,Dimensions,TouchableOpacity} from 'react-native';
import Header from '../components/Header';
import {Fonts} from '../utils/Fonts' ;
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SearchBar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import {API} from '../keys';
import Modal from "react-native-modal";
import ModalMatch from "../components/ModalMatch";
import Moment from 'moment';
import 'moment/locale/es';
import _ from "lodash";
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window');
import {Colors} from '../styles/colors';

class InboxScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          matches:[], 
          loading: true,
          search: '',
          currentDate: new Date(),
          modalMatch: false,
          match :'',
        }
        this.arrayholder = [];
      }
  getInbox(){
    return fetch(API+'matches/matches_recipients/' + this.props.user.id)
    .then( (response) => response.json() )
      .then( (responseJson ) => {
        this.setState({
          matches: responseJson['matches'],
          loading:false,
        }, function() {
        this.arrayholder = responseJson['matches'];
      })
    })
    .catch((error) => {
      console.log(error)
      this.setState({loading: false})
    });
  }
  componentDidMount() {
      this.getInbox()
  }

  updateModalMatch(modalMatch){
    this.setState({modalMatch:modalMatch})
    const new_matches = this.state.matches.slice() //copy the array
    index = new_matches.findIndex(item => item.id === this.state.match.id);
    new_matches[index].leido = true
    this.setState({matches: new_matches})
  }

  openMatch(match_id){
    console.log(match_id)
    return fetch(API+'matches/'+ match_id)
      .then( (response) => response.json() )
      .then( (responseJson ) => {
        console.log(responseJson)
        this.setState({
          match: responseJson['match'],
        },()=> this.setState({modalMatch:true}))
      })
      .catch((error) => {
        console.log("HA OCURRIDO UN ERROR DE CONEXION")
        console.log(error)
      });
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(match) {
      //applying filter for the inserted text in search bar
      const itemData = match.emisor.nombre ? match.emisor.nombre.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      matches: newData,
      search: text,
    });
  }    

  subTitle(type, read){
    console.log(type)
    if(type == "Usuario-Avisos"){
      return(
        <Text style={{fontFamily: read? Fonts.OpenSansSemiBold : Fonts.OpenSansBold,fontSize:14}}>Te envio un mensaje por tu aviso</Text>
      )
    }
    if(type == "Sugerencias-Rescatistas"){
      return(
        <Text style={{fontFamily: read? Fonts.OpenSansSemiBold : Fonts.OpenSansBold,fontSize:14}}>Información sobre solicitud SOS</Text>
      )
    }
    if(type == "Sugerencias-Avisos" ){
      return(
        <Text style={{fontFamily: read? Fonts.OpenSansSemiBold : Fonts.OpenSansBold,fontSize:14}}>Nuevas coincidencias encontradas</Text>
      )
    }
    if(type == "Solicitud-SOS"){
      return(
        <Text style={{fontFamily: read? Fonts.OpenSansSemiBold : Fonts.OpenSansBold,fontSize:14}}>Nueva solicitud SOS</Text>
      )
    }
    if(type == "Solicitud-Aceptada"){
      return(
        <Text style={{fontFamily: read? Fonts.OpenSansSemiBold : Fonts.OpenSansBold,fontSize:14}}>Solicitud SOS aceptada</Text>
      )
    }
  }
  render(){ 
    Moment.locale('es')
    return(
        <View style={{flex:1}}>
          <Header {...this.props} stack='true'/> 
          <Modal isVisible={this.state.modalMatch} style={{margin:20}}>
            <ModalMatch update = {this.updateModalMatch.bind(this)} match = {this.state.match} navigation={this.props.navigation}/>
          </Modal>
          <View style={{height:24,backgroundColor:'#5FB4A9',marginTop:-10,alignContent:'center',alignItems:'center'}}>
            <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:14}}> Bandeja de entrada</Text>
          </View>
          {!this.state.loading ?
            this.state.matches.length == 0 && this.state.search.length == 0?
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Icon name="bell-slash" size={height*0.2} color='gray' style={{marginBottom:20}} solid/>
                    <Text style={{fontFamily:Fonts.OpenSansBold,fontSize:16,color:'gray'}}>Usted no tiene ningún mensaje.</Text>
                </View>
            :
            <View>
                <SearchBar
                    placeholder="Buscar mensaje..."
                    onChangeText={text => this.SearchFilterFunction(text)}
                    onClear={text => this.SearchFilterFunction('')}
                    value={this.state.search}
                    containerStyle={{backgroundColor:'white'}}
                    inputContainerStyle={styles.searchInput}
                    inputStyle={{fontSize:16, fontFamily:Fonts.OpenSansSemiBold}}
                    lightTheme
                />
                <ScrollView style={{marginHorizontal:10,marginVertical:10,height:height*0.75}}>
                  {this.state.matches.map((match) => {
                  return (
                    <TouchableOpacity key={match.id} onPress={() => this.openMatch(match.id)}>
                      <View key={match.id} style={[styles.matchContainer,{borderWidth:match.leido? 1 : 1.5,borderColor: match.leido? Colors.lightGray : (match.tipo == "Solicitud-SOS"? Colors.red : Colors.primaryColor)}]}>
                        <View key={match.id} style={{flexDirection:'row'}}>
                          {match.emisor.perfil?
                          <UserAvatar size="60" name={match.emisor.nombre} src={match.emisor.perfil}/>
                          :
                          <UserAvatar size="60" name={match.emisor.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
                          }
                            
                            <View style={{alignContent:'center',justifyContent:'center',marginLeft:5}}>
                              <View style={{flexDirection:'row',width:width-96,justifyContent: 'space-between',}}>
                                <Text style={{fontFamily: match.leido? Fonts.OpenSansSemiBold : Fonts.OpenSansBold,fontSize:16}}>
                                  {match.emisor.nombre.length < 20
                                  ? `${match.emisor.nombre}`
                                  : `${match.emisor.nombre.substring(0, 21)}...`}
                                </Text>
                                <Text style={{fontFamily: match.leido? Fonts.OpenSans : Fonts.OpenSansBold,color: match.leido? 'gray' : Colors.primaryColor }}>
                                  {match.hora_creacion}
                                </Text>
                              </View>
                              {this.subTitle(match.tipo,match.leido)}
                             
                            </View>
                        </View>
                      </View>     
                    </TouchableOpacity>    
                  )
                })} 
                </ScrollView>
            </View>
            :<View style={{flex:1,justifyContent:'center'}}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View> 
            }
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
    searchInput:{
        height:30,
        borderWidth:1,
        borderBottomWidth:1,
        borderColor: Colors.lightGray,
        backgroundColor:'white'
    },
    matchContainer:{
      height:70,
      paddingHorizontal:2,
      paddingVertical:5,
      borderRadius:4,
      marginBottom:10,
    }
  });

  const mapStateToProps = (state) => {
    return {
      user: state.userReducer,
    };
  };
  export default connect(mapStateToProps)(InboxScreen);