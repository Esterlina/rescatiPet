import React from 'react';
import { StyleSheet,Switch, Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Camera from '../../components/Camera';
import Map from '../../components/Map';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker';
import {API_KEY, API} from '../../keys';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';
import Moment from 'moment';
import 'moment/locale/es'

const {height, width} = Dimensions.get('window');
export default class EventFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: [],
      image_dir: '',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      name:'',
      details:'',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      modalSend:false,
      loading: false,
      map: false,
      deadline:false,
      event:{},
      token: ''
    };
}
componentDidMount(){
    this.firebaseToken()
}

uploadImage = async (uri,name)=> {
  console.log("ESTOY SUBIENDO LA FOTO " + name);
  firebase.storage().ref(name).putFile(uri)
  .then(file => file.ref)
  .catch(error => console.log(error));
}

validate(){
  if (this.state.image.length == 0){
    alert("Debes subir una imagen para el evento")
    return false
  }
  if (this.state.address == ''){
    alert("Debe completar el campo de dirección, puede abrir el mapa o ingresar una dirección cercana.")
    return false
  }
  if (this.state.name == ''){
    alert("Debes ingresar un nombre para el evento.")
    return false
  }
  if (this.state.details == ''){
    alert("Debes agregar una descripción para el evento.")
    return false
  }
  if (this.state.start_date == '' || this.state.start_time == ''){
    alert("Debes ingresar la fecha y hora de inicio del evento.")
    return false
  }
  if ((this.state.start_date == this.state.end_date) && (this.state.start_time > this.state.end_time)){
    alert("La hora de inicio no puede ser después que la hora de fin.")
    return false
  }
  this.sendEvent();
  return true
}
async firebaseToken() {
  const currentUser = firebase.auth().currentUser
   if (currentUser) {
    const idToken = await currentUser.getIdToken();
    console.log("IMPRIMIRE EL TOKEN A ENVIAR:");
    console.log(idToken);
  this.setState({token: idToken})
  return idToken
  }
}
sendEvent(){
  this.setState({modalSend:true,loading:true})
  fetch(API + 'events', {
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
    name: this.state.name,
    start_date: this.state.start_date,
    start_time: this.state.start_time,
    end_date: this.state.end_date,
    end_time: this.state.end_time,
    details: this.state.details,
  }), 
}).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.setState({event: responseJson},()=>{
        this.uploadImage(this.state.image[0].uri, this.state.event.image + ".jpg");
        this.setState({loading:false})
    });   
    
  }).catch((error) =>{
    console.error(error);
  });
}

updateImage(images){
  this.setState({image:images})
}
updateLocation(marker,address){
    this.setState({marker:marker,address:address,map:false}, () =>{this.locationRef.setAddressText(this.state.address);})
}

  render(){ 
        Moment.locale('es')
        const today = Moment(new Date()).format('DD/MM/YYYY');
    return(
        <ScrollView style={{flex:1}}>
            <Modal isVisible={this.state.modalSend} style={{margin:20}}>
                <View style={{backgroundColor:'white',height:height*0.27,borderRadius:8}}>
                <View style={[appStyle.headerModal,{position:'absolute',top:0,width:width-40}]}>
                    <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.state.loading? "Publicando aviso...": "Aviso publicado"}</Text>
                </View>
                {this.state.loading?
                    <View style={{alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>Estamos publicando tu Evento.</Text>
                    <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                    <ActivityIndicator size="large" color= {Colors.primaryColor} />
                    </View>
                :
                <View style={{marginBottom:30,alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Tu evento ha sido publicado con exito.</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Ya puedes ir a hecharle un vistazo.</Text>
                    <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                    onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('DetailEvent', { event: this.state.event})}) }>
                    <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
                }
                </View>
            </Modal>
            <Modal isVisible={this.state.map} style={{margin:0}}
                onRequestClose={()=>console.log("cerrando")}> 
                <View style={{width:width,height:height}}>
                <Map marker={this.state.marker} update = {this.updateLocation.bind(this)}/> 
                <View style={styles.mapClose}>
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
            <Header {...this.props} stack='true'/> 
            <Text style={[appStyle.textTitle,{alignSelf:'center',marginTop:10}]}>Crear evento</Text>
            <Camera update = {this.updateImage.bind(this)} images = {this.state.image} type = {"Evento"} />
            <View style={styles.containerForm}>
                <View style={{marginTop:10}}>
                    <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Nombre del evento </Text>
                    <TextInput
                    style = {[styles.input,{color:'gray'}]}
                    //placeholder = {'Nombre mascota (Opcional)'}
                    //placeholderTextColor = {'gray'}
                    value={this.state.name}
                    onChangeText={(value) => this.setState({name: value})}                         
                    /> 
                </View>
                <View style={{marginTop:10}}>
                    <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Lugar del evento </Text>
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
                        width:width-5,
                        alignSelf:'center'
                    },
                    textInput: {
                        backgroundColor:'white',
                        borderWidth: 1.3,
                        borderColor: Colors.lightGray,
                        borderRadius: 8,
                        marginBottom:0,
                        height: 34,
                        color: 'gray',
                        fontSize: 14,
                        fontFamily: Fonts.OpenSans,
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    },
                    }}
                    />
                    <TouchableOpacity style={styles.buttonMap}
                        onPress={() => this.setState({map:true})}>
                        <View style={{flexDirection:'row'}}>
                        <Icon name="map-marker-alt" size={14} color={Colors.primaryColor} style={{marginRight:5}} regular/>
                        <Text style={[appStyle.textRegular,{color: Colors.primaryColor}]}>Ver mapa</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:4}}>
                    <View style={{width:90,justifyContent:'center'}}>
                        <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>{this.state.deadline? "Inicio" : "Fecha/Hora" }</Text>
                    </View>
                    <View style={{flexDirection:'row', width:width-110}}>
                        <View style={{flexDirection:'row',}}>
                            <Icon name='calendar-alt'  size={26} color={Colors.gray} style={{alignSelf:'center',marginRight:5}}/>
                            <DatePicker
                                style={{width: width*0.25}}
                                date={this.state.start_date}
                                mode="date"
                                placeholder= " "
                                format="DD/MM/YYYY"
                                minDate={today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        height:34,
                                        borderWidth:1,
                                        borderRadius:4,
                                        borderColor: Colors.lightGray,        
                                        //paddingBottom:10, 
                                        //paddingHorizontal:8,
                                        //backgroundColor:'red'
                                    },
                                    dateText: {
                                        color:'gray',
                                        fontSize:14,
                                        textAlign: 'left',
                                        alignSelf: 'center',
                                        fontFamily: Fonts.OpenSans,
                                    },
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {this.setState({start_date: date})}}
                            />
                        </View>
                        <View style={{flexDirection:'row',position:'absolute',right:0}}>
                            <Icon name='clock'  size={26} color={Colors.gray} style={{alignSelf:'center',marginRight:5}}/>
                            <DatePicker
                                style={{width: width*0.25}}
                                date={this.state.start_time}
                                mode="time"
                                placeholder= " "
                                format="HH:mm"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        height:34,
                                        borderWidth:1,
                                        borderRadius:4,
                                        borderColor: Colors.lightGray,        
                                        //paddingBottom:10, 
                                        //paddingHorizontal:8,
                                        //backgroundColor:'red'
                                    },
                                    dateText: {
                                        color:'gray',
                                        fontSize:14,
                                        textAlign: 'left',
                                        alignSelf: 'center',
                                        fontFamily: Fonts.OpenSans,
                                    },
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {this.setState({start_time: date})}}
                            />
                        </View>
                        
                    </View>
                </View>
                {this.state.deadline? 
                <View style={{flexDirection:'row',marginVertical:4}}>
                    <View style={{width:90,justifyContent:'center'}}>
                        <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Fin</Text>
                    </View>
                    <View style={{flexDirection:'row', width:width-110}}>
                        <View style={{flexDirection:'row',}}>
                            <Icon name='calendar-alt'  size={26} color={Colors.gray} style={{alignSelf:'center',marginRight:5}}/>
                            <DatePicker
                                style={{width: width*0.25}}
                                date={this.state.end_date}
                                mode="date"
                                placeholder= " "
                                format="DD/MM/YYYY"
                                minDate={this.state.start_date? this.state.start_date:today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        height:34,
                                        borderWidth:1,
                                        borderRadius:4,
                                        borderColor: Colors.lightGray,        
                                        //paddingBottom:10, 
                                        //paddingHorizontal:8,
                                        //backgroundColor:'red'
                                    },
                                    dateText: {
                                        color:'gray',
                                        fontSize:14,
                                        textAlign: 'left',
                                        alignSelf: 'center',
                                        fontFamily: Fonts.OpenSans,
                                    },
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {this.setState({end_date: date})}}
                            />
                        </View>
                        <View style={{flexDirection:'row',position:'absolute',right:0}}>
                            <Icon name='clock'  size={26} color={Colors.gray} style={{alignSelf:'center',marginRight:5}}/>
                            <DatePicker
                                style={{width: width*0.25}}
                                date={this.state.end_time}
                                mode="time"
                                placeholder= " "
                                format="HH:mm"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        height:34,
                                        borderWidth:1,
                                        borderRadius:4,
                                        borderColor: Colors.lightGray,        
                                    },
                                    dateText: {
                                        color:'gray',
                                        fontSize:14,
                                        textAlign: 'left',
                                        alignSelf: 'center',
                                        fontFamily: Fonts.OpenSans,
                                    },
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {this.setState({end_time: date})}}
                            />
                        </View>
                        
                    </View>
                </View>
                :
                <TouchableOpacity style={[styles.buttonMap,{width:150}]} onPress={() => this.setState({deadline:true})}>
                    <View style={{flexDirection:'row'}}>
                        <Icon name="calendar-plus" size={14} color={Colors.primaryColor} style={{marginRight:5}} regular/>
                        <Text style={[appStyle.textRegular,{color: Colors.primaryColor}]}>Agregar finalización</Text>
                    </View>
                </TouchableOpacity>
                }
                
                <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Descripción del evento</Text>    
                <TextInput
                style = {[appStyle.inputArea, appStyle.textRegular]}
                placeholder = {'Agregue una descripción ...'}
                placeholderTextColor = {'gray'}
                multiline={true}
                numberOfLines={5}
                value = {this.state.details}
                onChangeText={(value) => this.setState({details: value})}
                ></TextInput>  
                <TouchableOpacity 
                style={[appStyle.buttonLarge]}
                onPress={() => this.validate()}
                >
                <Text style={appStyle.buttonLargeText}> Publicar </Text>
                </TouchableOpacity> 
              
            </View>   
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    buttonMap:{
      width:80,
      alignSelf: 'flex-end',
      borderBottomWidth: 1.3,
      borderColor: Colors.primaryColor,
      marginTop:5,
    },
    mapClose:{
      position: 'absolute',
      margin:15,
      alignSelf: 'flex-start'
    },

    containerForm:{
      paddingHorizontal:10,
      paddingBottom:10,
    },
    icon: {
      position:'absolute',
      top:10,
      left:8,
  },
  dateTime:{
    width: width*0.90,
    height:34,
    marginTop:8,
    borderWidth: 1.3,
    borderColor: Colors.lightGray,
    borderRadius: 8,
  },
  input:{
    borderWidth: 1.3,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginTop:10,
    marginHorizontal:0,
    paddingVertical:1,
    paddingHorizontal:10,
  },
 
  border:{
    borderWidth: 1.3,
    borderColor: Colors.primaryColor,
    borderRadius: 4,
  },

  containerForm2:{
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10,
    marginTop:5,
  },
  });