import React from 'react';
import { StyleSheet, Text,View,ActivityIndicator,TouchableOpacity,Dimensions, ScrollView,Image, TextInput,Picker,Switch} from 'react-native';
import {API_KEY, API} from '../../keys';
import Header from '../../components/Header';
import {connect} from 'react-redux'
import appStyle from '../../styles/app.style'
import Modal from "react-native-modal";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Map from '../../components/Map';
import {Colors} from '../../styles/colors'
import {Fonts} from '../../utils/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CheckBox } from 'react-native-elements'
import firebase from 'react-native-firebase'
import UserRequest from '../../components/UserRequest'
const {height, width} = Dimensions.get('window');
class UserRequestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_request:{},
      loading:true,
      info: false,
      phone:'',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      map: false,
      role: '',
      available_sos: false,
      modalSend:false,
      roles:[],
      situations:[],
      comment:'' ,
      token:''     
    };
}
updateLocation(marker,address){
    this.setState({marker:marker,address:address,map:false}, () =>{this.locationRef.setAddressText(this.state.address);})
}
async firebaseToken() {
    const currentUser = firebase.auth().currentUser
     if (currentUser) {
    // reaches here
      const idToken = await currentUser.getIdToken();
      console.log("IMPRIMIRE EL TOKEN A ENVIAR:");
      console.log(idToken);
    // never reaches here
    this.setState({token: idToken})
    return idToken
    }
}
getInfo(){
    return fetch(API + 'users/info_request' )
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
        situations: responseJson['situaciones'],roles:responseJson['roles']});
      })
      .catch((error) =>{
      console.error(error);
    });
}
componentDidMount(){
    return fetch(API + 'users/' + this.props.user.id + '/request')
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
        user_request: responseJson['solicitud'],loading:false},()=>{
            if(!this.state.user_request){
                this.firebaseToken()
                this.getInfo();
            }
        });
      })
      .catch((error) =>{
      console.error(error);
    });
}
sendRequest(){
    this.setState({modalSend:true,loading:true})
    fetch(API + 'users/change_user', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.state.token,
    },
    body: JSON.stringify({
      lat: this.state.marker.latitude,
      lng: this.state.marker.longitude,
      street: this.state.address,
      role: this.state.role,
      phone: this.state.phone,
      situations: this.state.situations,
      available_sos: this.state.available_sos,
      comment: this.state.comment,
    }), 
  }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({user_request: responseJson['solicitud'],loading:false});
    }).catch((error) =>{
      console.error(error);
    });
  }
validate(){
    if(this.state.phone == ''){
        alert("Debe agregar un teléfono de contacto")
        return false
    }
    if(this.state.street == ''){
        alert("Debe agregar un dirección (puede ser una dirección cercana o la comuna)")
        return false
    }
    if(this.state.comment == ''){
        alert("Debes agregar el motivo de tu solicitud.")
        return false
    }
    this.sendRequest()
}
updateSituation(index){
    const situations = this.state.situations.slice() //copy the array
    //index = colors.findIndex(item => item.id === color.id);
    situations[index].experiencia = !this.state.situations[index].experiencia
    this.setState({situations: situations}) 
  }
  displayForm(){
      console.log("Imprimiré las situaciones")
      console.log(this.state.situations)
    return(
        <View >
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Text style={[appStyle.textSemiBold, {color: Colors.primaryColor, fontSize:20,alignSelf:'center'}]}>SOLICITUD PERFIL</Text>
                <Image
                    source={require('../../icons/rescue/human.png')}
                    style= {{width:30,height:30,marginLeft:4}}
                />
           </View>
           <View style={{margin:10}}>
                <TouchableOpacity style={styles.buttonInfo} onPress={() => this.setState({info:this.state.info? false:true})}>
                    <Text style={appStyle.textSemiBold}>¿Qué significa ser rescatista/fundación en RescatiPet? <Icon name="info-circle" size={16} color={Colors.primaryColor} regular/></Text>
                </TouchableOpacity>
                {this.state.info?
                <Text style={[appStyle.textRegular,{textAlign:'justify',marginRight:10,marginVertical:5}]}>Tener un perfil de rescatista/fundación, te permite registrar a tus rescatados, publicar historia sobre ellos, avisos de adopción, solicitar hogar temporar para ellos, publicar campañas de donación, y recibir notificaciones de emergencia en caso de que lo desees. Si eres una fundación, tambien puedes publicar tus eventos y compartir material informativo en el foro.</Text>
                :null}
               
            </View>
            <View style={[appStyle.containerPublication,{borderColor: Colors.primaryColor,padding:5}]}>
                <Text style={[appStyle.textTitleCalipso]}>Datos personales</Text>
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Teléfono</Text>
                    <TextInput
                    style = {[appStyle.input,appStyle.inputRight,{borderColor:Colors.lightGray}]}
                    keyboardType = 'numeric'
                    value={this.state.phone}
                    onChangeText={(value) => this.setState({phone: value})}                         
                    /> 
                </View>    
                <View style={{flexDirection:'row', marginVertical:10}}>
                    <Text style={appStyle.textSemiBold}>Dirección</Text>
                    <GooglePlacesAutocomplete
                    ref={(instance) => { this.locationRef = instance }}
                    query={{ key: API_KEY,language: 'es',components: 'country:cl'}}
                    placeholder=''
                    minLength={2} 
                    autoFocus={false}
                    returnKeyType={'default'}
                    fetchDetails={true}
                    listViewDisplayed={false}
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    this.setState({marker:
                    {latitude:details.geometry.location.lat,longitude: details.geometry.location.lng},
                    address: details.formatted_address});
                    }}
                    styles={{
                    textInputContainer: {
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        borderBottomWidth:0,
                        width:width*0.65,
                    },
                    textInput: {
                        backgroundColor:'white',
                        borderWidth: 1.3,
                        borderColor: Colors.lightGray,
                        borderRadius: 8,
                        margin:10,
                        marginTop:0,
                        marginBottom:0,
                        paddingVertical:5,
                        paddingHorizontal:10,
                        height: 34,
                        color: 'gray',
                        fontSize: 14,
                        fontFamily: Fonts.OpenSans,
                        width:width*0.65,
                        position:'absolute',
                        right:-45,
                        top:-5,
                        alignSelf:'center'
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    },
                    }}
                    />
                    <TouchableOpacity style={[appStyle.buttonMap,{top:10}]}
                        onPress={() => this.setState({map:true})}>
                        <View style={{flexDirection:'row'}}>
                            <Icon name="map-marker-alt" size={14} color={Colors.primaryColor} style={{marginRight:5}} regular/>
                            <Text style={[appStyle.textRegular,{color: Colors.primaryColor}]}>Ver mapa</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
                <Text style={[appStyle.textTitleCalipso]}>Experiencia</Text>
                {this.state.situations.map((situation,index)=>{
                    return(
                        <View key={situation.id} style={{flexDirection:'row', marginVertical:10}}>
                        <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>{situation.nombre}</Text>
                        <View style={{flexDirection:'row',position:'absolute', right:-10,alignSelf:'center'}}>
                            <CheckBox
                            title='Sí'
                            checked={situation.experiencia}
                            onPress={() => this.updateSituation(index)}
                            textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                            checkedColor = {Colors.primaryColor}
                            fontFamily = {Fonts.OpenSansSemiBold}
                            containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                            />
                            <CheckBox
                            title='No'
                            checked={!situation.experiencia}
                            onPress={() =>  this.updateSituation(index)}
                            textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                            checkedColor = {Colors.primaryColor}
                            fontFamily = {Fonts.OpenSansSemiBold}
                            containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                            />
                        </View>
                    </View>
                    )
                })}
                <Text style={[appStyle.textTitleCalipso]}>Motivo</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>¿Qué tipo de perfil solicitas?</Text>
                    <View style={[appStyle.pickerContainer,{backgroundColor:'white',width:140,position:'absolute',right:0,alignSelf:'center'}]}>
                        <Picker
                            selectedValue={this.state.role}
                            style={[appStyle.picker,{width:140}]}
                            onValueChange={(itemValue, itemIndex) =>
                            this.setState({role: itemValue})
                            }>
                            { this.state.roles.map( (role,i) => (<Picker.Item key={i} color="gray" label={role} value={role} />) ) }
                        </Picker>
                    </View>
                </View>
                <View style={{flexDirection:'row',marginTop:15}}>
                    <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>¿Habilitar recibo de notificaciones sos?</Text>
                    <Switch
                        onValueChange={(value) =>
                        this.setState({available_sos: value})
                        }
                        thumbColor="white" 
                        style= {{position: "absolute",right:0, alignSelf:'center'}}
                        trackColor={{true: Colors.primaryColor,false: Colors.lightGray}} 
                        value = {this.state.available_sos}
                    />
                </View>
                <TextInput
                    style = {[appStyle.inputArea, appStyle.textRegular,{marginTop:15}]}
                    placeholder = {'Ingresar motivo de solicitud ...'}
                    placeholderTextColor = {'gray'}
                    multiline={true}
                    numberOfLines={8}
                    onChangeText={(value) => this.setState({comment: value})}
                ></TextInput> 
            </View>
            <View style={{marginHorizontal:10,marginBottom:10}}>
                <Text style={[appStyle.textRegular,{color:Colors.gray,textAlign:'center'}]}>Tus datos solo serán visibles para el administrador, quién evaluará tu solicitud.</Text>
                    <TouchableOpacity 
                    style={[appStyle.buttonLarge]}
                    onPress={() => this.validate()}
                    >
                    <Text style={appStyle.buttonLargeText}> Enviar </Text>
                </TouchableOpacity>   
            </View>   
        </View>
    )
  }   
  displayRequest(){
    return(
        <UserRequest  user_request={this.state.user_request}
            navigation={this.props.navigation}
        /> 
    )
  }   

  render(){ 
    return(
        <View style={styles.container}>
            <Modal isVisible={this.state.map} style={{margin:0}}
                onRequestClose={()=>console.log("cerrando")}> 
                <View style={{width:width,height:height}}>
                    <Map marker={this.state.marker} update = {this.updateLocation.bind(this)}/> 
                    <View style={appStyle.mapClose}>
                        <TouchableOpacity style={[appStyle.buttonModal,{backgroundColor:'white'}]}
                            onPress={() => this.setState({map:false})}>
                            <View style={{flexDirection:'row'}}>
                            <Icon name="arrow-left" size={14} color='gray' style={{marginRight:5,marginTop:3}} regular/>
                            <Text style={[appStyle.textRegular,{fontSize:16}]}>Volver</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={this.state.modalSend} style={{margin:20}}>
          
                <View style={{backgroundColor:'white',height:height*0.27,borderRadius:8}}>
                    <View style={[appStyle.headerModal,{position:'absolute',width:width-40,top:0}]}>
                        <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Enviando solicitud</Text>
                    </View>
                    {this.state.loading?
                        <View style={{alignSelf:'center',marginTop:50}}>
                            <Text style={{textAlign:'center',fontSize:16}}>Estamos enviando la solicitud.</Text>
                            <Text style={{textAlign:'center',fontSize:14,marginBottom:10}}>Por favor, espera unos segundos.</Text>
                            <ActivityIndicator size="large" color= {Colors.primaryColor} />
                        </View>
                    :
                    <View style={{marginTop:50,alignSelf:'center'}}>
                        <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                        <Text style={{textAlign:'center',fontSize:14}}>La solicitud fue enviada con exito. Ya puedes revisar el estado de tu solicitud.</Text>
                        <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                            onPress={() =>this.setState({modalSend:false }) }>
                            <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            </Modal>
            <Header {...this.props}/> 
            
            {!this.state.loading?
             <ScrollView style={styles.container}>
                <View style={{marginTop:10}}>
                    {!this.state.user_request? this.displayForm(): this.displayRequest()}
                </View>
            </ScrollView>
            : 
            <View style={{justifyContent:'center',flex:1}}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View> }
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
  
  export default connect(mapStateToProps)(UserRequestScreen);