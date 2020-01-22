import React from 'react';
import { StyleSheet, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,Image,TextInput,Switch,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../components/Header';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements'
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
import Modal from "react-native-modal";
import {Fonts} from '../utils/Fonts';
import {API_KEY, API} from '../keys';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Map from '../components/Map';
const {height, width} = Dimensions.get('window');
class SettingsUser extends React.Component {
  constructor(props) {
    super(props);
    this.isMounted = true;
    this.state = {
      loading: true,
      loadingRequest:false,
      settings: '',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      map: false,
      new_address: false,
    };
}
componentDidMount(){
    this.getSettings()
}
getSettings(){
    return fetch(API + 'users/' + this.props.user.id + '/settings' )
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
        settings: responseJson['usuario'],loading:false});
      })
      .catch((error) =>{
      console.error(error);
    });
}

validate(){
  if(this.state.new_address){
    if(this.state.address == ''){
        Alert.alert(
          'Actualizar dirección',
          "No ha ingresado la nueva dirección ¿Deseas seguir editando la nueva dirección? Recuerde que este dato es importante en caso de que tenga habilitada las notificaciones de emergencia",
          [{text: 'Sí', onPress: () =>console.log("SEGUIR EDITANDO DIRECCIÓN")},
          {text: 'No', onPress: () => {this.setState({new_address:false},()=> this.updateSettings())}}],
          {cancelable:false}
        ) 
        return true
    }
  }
  this.updateSettings()
  return true
}
  updateSettings(){
    this.setState({loadingModal:true,modalSend:true})
    fetch(API + 'users/' + this.props.user.id + '/settings', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        phone: this.state.settings.telefono,
        situations: this.state.settings.situaciones,
        animals: this.state.settings.animales,
        available_sos: this.state.settings.sos_habilitado,
        new_address:this.state.new_address,
        lat: this.state.marker.latitude,
        lng: this.state.marker.longitude,
        street: this.state.address,
      })
  }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({settings: responseJson['usuario'],loadingModal:false});
    }).catch((error) =>{
      console.error(error);
    });
  }
  updateLocation(marker,address){
    this.setState({marker:marker,address:address,map:false}, () =>{this.locationRef.setAddressText(this.state.address);})
  }
  updateSituation(index){
    const situations = this.state.settings.situaciones.slice() //copy the array
    //index = colors.findIndex(item => item.id === color.id);
    situations[index].experiencia = !this.state.settings.situaciones[index].experiencia
    this.setState(prevState => ({settings: {...prevState.settings, situaciones: situations}}))
  }
  updateAnimal(index){
    const animals = this.state.settings.animales.slice() //copy the array
    //index = colors.findIndex(item => item.id === color.id);
    animals[index].experiencia = !this.state.settings.animales[index].experiencia
    this.setState(prevState => ({settings: {...prevState.settings, animales: animals}}))
  }
  render(){ 
    settings = this.state.settings
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
                    <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Configurando datos</Text>
                </View>
                {this.state.loadingModal?
                    <View style={{alignSelf:'center',marginTop:50}}>
                        <Text style={{textAlign:'center',fontSize:16}}>Estamos actualizando tus datos.</Text>
                        <Text style={{textAlign:'center',fontSize:14,marginBottom:10}}>Por favor, espera unos segundos.</Text>
                        <ActivityIndicator size="large" color= {Colors.primaryColor} />
                    </View>
                :
                <View style={{marginTop:50,alignSelf:'center'}}>
                    <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Datos actualizados con exito.</Text>
                    <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                        onPress={() =>this.setState({modalSend:false }) }>
                        <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        </Modal>
        <Header {...this.props} stack={'true'}/> 
        {!this.state.loading?
         <ScrollView style={styles.container}>
            <View style={{marginTop:10}}>
            <View>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <Text style={[appStyle.textSemiBold, {color: Colors.primaryColor, fontSize:20,alignSelf:'center'}]}>CONFIGURAR DATOS</Text>
                    <Image
                        source={require('../icons/rescue/ajustes.png')}
                        style= {{width:30,height:30,marginLeft:4}}
                    />
                </View>
                <View style={[appStyle.containerPublication,{borderColor: Colors.primaryColor,padding:5,marginTop:10}]}>
                    <Text style={[appStyle.textTitleCalipso]}>Datos personales</Text>
                    <View style={{flexDirection:'row', marginVertical:10}}>
                        <Text style={appStyle.textSemiBold}>Teléfono</Text>
                        <TextInput
                        style = {[appStyle.input,appStyle.inputRight,{borderColor:Colors.lightGray}]}
                        keyboardType = 'numeric'
                        value={this.state.settings.telefono}
                        onChangeText={(value) => this.setState(prevState => ({settings: {...prevState.settings, telefono: value}}))}                         
                        /> 
                    </View>
                    <View style={{flexDirection:'row', marginVertical:10}}>
                        <Text style={appStyle.textSemiBold}>Dirección</Text>
                        {this.state.settings.direccion?
                        <Text style = {[appStyle.inputRight]}>{this.state.settings.direccion}</Text>
                        : <Text style = {[appStyle.inputRight]}>Sin direccion registrada.</Text>}
                    </View> 
                    <View style={{flexDirection:'row', marginVertical:10}}>
                      <Text style={appStyle.textSemiBold}>¿Deseas {this.state.settings.direccion? "editar la ":"agregar una "} dirección?</Text>
                      <TouchableOpacity style={[appStyle.buttonLarge2,appStyle.inputRight,{flexDirection:'row',marginTop:0,width:100}]} onPress={() => {this.setState({new_address:true})}}>
                        {this.state.settings.direccion? 
                        <Icon name="edit" size={14} color={'white'} style={{marginRight:5}} regular/>
                        :
                        <Icon name="plus" size={14} color={'white'} style={{marginRight:5}} regular/>
                        }
                        <Text style={appStyle.buttonLargeText2}>{this.state.settings.direccion? "Editar":"Agregar"}</Text>
                      </TouchableOpacity> 
                    </View> 
                    {this.state.new_address?
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
                    :null}
                    <Text style={[appStyle.textTitleCalipso]}>Experiencia</Text>
                    {this.state.settings.situaciones.map((situation,index)=>{
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
                    <Text style={[appStyle.textTitleCalipso]}>Afinidad</Text>
                {this.state.settings.animales.map((animal,index)=>{
                    return(
                        <View key={animal.id} style={{flexDirection:'row', marginVertical:10}}>
                        <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>{animal.nombre}</Text>
                        <View style={{flexDirection:'row',position:'absolute', right:-10,alignSelf:'center'}}>
                            <CheckBox
                            title='Sí'
                            checked={animal.experiencia}
                            onPress={() => this.updateAnimal(index)}
                            textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                            checkedColor = {Colors.primaryColor}
                            fontFamily = {Fonts.OpenSansSemiBold}
                            containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                            />
                            <CheckBox
                            title='No'
                            checked={!animal.experiencia}
                            onPress={() =>  this.updateAnimal(index)}
                            textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
                            checkedColor = {Colors.primaryColor}
                            fontFamily = {Fonts.OpenSansSemiBold}
                            containerStyle = {{borderWidth:0,backgroundColor:'white',height:34,justifyContent:'center',margin:0,padding:0}}
                            />
                        </View>
                    </View>
                    )
                })}
                    <View style={{flexDirection:'row',marginTop:15}}>
                        <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Recibir notificaciones sos</Text>
                        <Switch
                            onValueChange={(value) =>
                              this.setState(prevState => ({settings: {...prevState.settings, sos_habilitado: value}}))
                            }
                            thumbColor="white" 
                            style= {{position: "absolute",right:0, alignSelf:'center'}}
                            trackColor={{true: Colors.primaryColor,false: Colors.lightGray}} 
                            value = {this.state.settings.sos_habilitado}
                        />
                    </View>
                </View>
                <View style={{marginHorizontal:10,marginBottom:10}}>
                    <Text style={[appStyle.textRegular,{color:Colors.gray,textAlign:'center'}]}>Tus datos de contacto como correo o telefono, solo serán visibles para otros usuarios en casos necesarios.</Text>
                        <TouchableOpacity 
                        style={[appStyle.buttonLarge]}
                        onPress={() => {console.log("VAMOS A ACTUALIZAR DATOS");this.validate()}}
                        >
                        <Text style={appStyle.buttonLargeText}> Actualizar </Text>
                    </TouchableOpacity>   
                </View>   
            </View>
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
export default connect(mapStateToProps)(SettingsUser);