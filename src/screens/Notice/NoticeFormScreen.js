import React from 'react';
import { StyleSheet,Switch, Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Map from '../../components/Map';
import Camera from '../../components/Camera';
import DatePicker from 'react-native-datepicker';
import { CheckBox } from 'react-native-elements'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {API_KEY, API} from '../../keys';
import Helpers from '../../../lib/helpers'
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';

const {height, width} = Dimensions.get('window');
export default class NoticeFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      more_info : this.props.navigation.getParam('info'),
      images: [],
      img_dir: '',
      map: false,
      collar: false,
      clothes: false,
      rescue_request: false,
      details:'',
      time_last_seen:'',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      name:'',
      specie: 0,
      specieName:'',
      situation: 0,
      sex:'',
      race: 0,
      age:'',
      size: '',
      color:'',
      json:'',
      sexList:[],
      specieList:[],
      raceList:[],
      ageList:[],
      sizeList:[],
      pelagesList:[],
      colorList:[],
      situationList:[],
      notice:'',
      token:'',
      modalColors: false,
      colors:[],
      modalSend:false,
      loading: false,
    };
}
componentDidMount(){
  return fetch(API + 'notices/info_notice')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        specieList: responseJson['tipos'],
        raceList: responseJson['razas'],
        sexList: responseJson['sexos'],
        ageList: responseJson['edades'],
        sizeList: responseJson['tamaños'],
        pelagesList: responseJson['pelajes'],
        colorList: responseJson['colores'],
        situationList: responseJson['situaciones']
      },()=> this.firebaseToken());
    })
    .catch((error) =>{
      console.error(error);
    });
}
getRaceBySpecie(){
  if(this.state.specie != 0){
    return fetch(API + 'notices/races/'+ this.state.specie)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        raceList: responseJson,
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }
}

uploadImages = async (uri,name)=> {
  console.log("ESTOY SUBIENDO LA FOTO " + name);
  //const response = await fetch(uri);
  //const blob = await response.blob();
  firebase.storage().ref(this.state.notice.img_dir + name).putFile(uri)
  .then(file => file.ref)
  .catch(error => console.log(error));
  //return ref.put(blob);
}
validate(){
  if (this.state.images.length == 0){
    alert("Debes subir al menos una imagen")
    return false
  }
  if (this.state.time_last_seen == ''){
    alert("Ingrese una fecha aproximada donde sucedio este hecho.")
    return false
  }
  if (this.state.address == ''){
    alert("Debe completar el campo de dirección, puede abrir el mapa o ingresar una dirección cercana.")
    return false
  }
  if (this.state.specie == 0){
    alert("Por favor, para agilizar la busqueda ingrese el tipo de animal.")
    return false
  }
  this.sendNotice();
  return true
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
sendNotice(){
  this.setState({modalSend:true,loading:true})
  fetch(API + 'notices', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': this.state.token,
  },
  body: JSON.stringify({
    type: this.props.navigation.getParam('type'),
    last_seen: this.state.time_last_seen,
    lat: this.state.marker.latitude,
    lng: this.state.marker.longitude,
    street: this.state.address,
    name: this.state.name,
    animal_type_id: this.state.specie,
    sex: this.state.sex,
    race_id: this.state.race,
    age: this.state.age,
    size: this.state.size,
    collar: this.state.collar,
    clothes: this.state.clothes,
    details: this.state.details,
    img_num: this.state.images.length,
    situation_id: this.state.situation,
    rescue_request:this.state.rescue_request,
  }), 
}).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.setState({notice: responseJson},()=>{
      this.state.images.map((item,i) => {
        this.uploadImages(item.uri,"image_" + i + ".jpg")
        if (i == this.state.images.length -1){
          console.log("lA ULTIMA IMAGEN ES ");
          console.log(i)
          this.setState({loading:false})
        }
      }       
      )
    });
  console.log(this.state.notice.img_dir);
  console.log(this.state.notice)
  
  }).catch((error) =>{
    console.error(error);
  });
}
changeColor(color){
  const colors = this.state.colorList.slice() //copy the array
  index = colors.findIndex(item => item.id === color.id);
  colors[index].select = (color.select? false:true)
  this.setState({colorList: colors}) 
}
setColors(){
  const colors = []
  this.state.colorList.map(function(color) {
    if(color.select){
      colors.push(color.name);
    }
  });
  this.setState({colors:colors})
}
keepColors(){
  const seleccionados = this.state.colors.slice()
  const colors = this.state.colorList.slice() //copy the array 
  colors.map(function(color){
    if(seleccionados.length != 0){
      if(seleccionados.includes(color.name)){
        color.select = true;
      }else{
        color.select = false;
      }
    }else{
      color.select = false;
    }
  });
  this.setState({colorList:colors})
}
updateImages(images){
  this.setState({images:images})
}
updateLocation(marker,address){
  this.setState({marker:marker,address:address,map:false}, () =>{this.locationRef.setAddressText(this.state.address);})
}
renderMoreInformation() {
  return(
    <View style={styles.moreInformation}>
      <Text style={styles.textWhite}>AGREGA MÁS CARACTERISTICAS</Text>
      <View style={styles.pickersInfo}>
        <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
          <Picker
            selectedValue={this.state.race}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({race: itemValue})
            }>
            <Picker.Item key={0} color= "#a0a0a0" label="Raza" value="0" />
            { this.state.raceList.map( race => (<Picker.Item key={race.id} color="gray" label={race.name} value={race.id} />) ) }
          </Picker>
        </View>
        <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
          <Picker
            selectedValue={this.state.age}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({age: itemValue})
            }>
            <Picker.Item key={0} color= "#a0a0a0" label="Edad" value="" />
            {this.state.ageList.map( age => (<Picker.Item key={age} color="gray" label={age} value={age} />))}              
          </Picker>
        </View>
      </View>
      <View style={styles.pickersInfo}>
        <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
          <Picker
            selectedValue={this.state.size}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({size: itemValue})
            }>
            <Picker.Item key={0} color= "#a0a0a0" label="Tamaño" value="" />
            {this.state.sizeList.map( size => (<Picker.Item key={size} color="gray" label={size} value={size} />))}  
          </Picker>
        </View>
        <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
          <TouchableOpacity 
            style={{paddingHorizontal:8,flexDirection:'row'}}
            onPress={() => this.setState({modalColors:true})}>  
              <Text style={{paddingTop:3,fontSize:15,color:'gray'}}>{this.state.colors.length != 0? this.state.colors : 'Colores(es)'}</Text>
              <Icon name="sort-down" size={16} color='gray' style={{marginTop:3,marginLeft:45}} regular/>
          </TouchableOpacity>
        </View>
      </View>
      {(this.state.specieName != 'Ave' && this.state.specieName != 'Roedor')?
      <View>
      <Text style={[styles.textWhite,{fontFamily: Fonts.OpenSansSemiBold}]}>Marque los accesorios presentes:</Text>
      <View style={styles.pickersInfo}>
        <CheckBox
          title='Collar y/o correa'
          checked={this.state.collar}
          onPress={() => this.setState({collar: !this.state.collar})}
          textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
          checkedColor = {Colors.primaryColor}
          fontFamily = {Fonts.OpenSansSemiBold}
          containerStyle = {styles.checkbox}
        />
        <CheckBox
          title='Chaleco/ropa'
          checked={this.state.clothes}
          onPress={() => this.setState({clothes: !this.state.clothes})}
          textStyle = {[appStyle.textRegular,{fontWeight:'400', marginLeft:0}]}
          checkedColor = {Colors.primaryColor}
          fontFamily = {Fonts.OpenSansSemiBold}
          containerStyle = {styles.checkbox}
        />
      </View> 
      </View>: null }

           
    </View>
  ) 
}
  render(){ 
    const type = this.props.navigation.getParam('type');
    return(
      <ScrollView style={{flex:1}}>
        <Modal isVisible={this.state.modalSend} style={{margin:20}}>
          
            <View style={{backgroundColor:'white',height:height*0.27,borderRadius:8}}>
              <View style={appStyle.headerModal}>
                <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.state.loading? "Publicando aviso...": "Aviso publicado"}</Text>
              </View>
              {this.state.loading?
                <View style={{alignSelf:'center'}}>
                  <Text style={{textAlign:'center',fontSize:16}}>Estamos publicando tu aviso.</Text>
                  <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                  <ActivityIndicator size="large" color= {Colors.primaryColor} />
                </View>
              :
              <View style={{marginBottom:30,alignSelf:'center'}}>
                <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                <Text style={{textAlign:'center',fontSize:14}}>Tu aviso ha sido publicado con exito.</Text>
                <Text style={{textAlign:'center',fontSize:14}}>Ya puedes ir a hecharle un vistazo.</Text>
                <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                  onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('DetailNotice', { notice: this.state.notice})}) }>
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
        <Modal isVisible={this.state.modalColors}
          hasBackdrop={true} style={{margin:20}}> 
          <View style={{backgroundColor:'white',height:height*0.65,borderRadius:8}}>
            <View style={appStyle.headerModal}>
              <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Seleccione los colores</Text>
            </View>
            <ScrollView>
              { this.state.colorList.map( color => (
                <TouchableOpacity  key={color.id}
                onPress={() => this.changeColor(color)}
                >
                  <View  style={{alignContent:'space-between',backgroundColor:'white',height:35,marginVertical:2,paddingHorizontal:5,justifyContent:'center',marginHorizontal:15,borderBottomWidth:0.8,borderColor: Colors.lightGray}}>
                    <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                      <Text style={{fontFamily:Fonts.OpenSansSemiBold,fontSize:16,}}>{color.name}</Text>
                      <Icon name="check-square" size={24} color={color.select? Colors.primaryColor: Colors.lightGray} style={{marginRight:15}} solid/> 
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
           
            <View style={{justifyContent:'flex-end',marginBottom: 10,flex:1}}>
              <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
              <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                  onPress={() => this.setState({modalColors:false},()=>this.keepColors())}>
                    <Text style={appStyle.TextModalButton}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
                  onPress={() =>this.setState({modalColors:false } ,()=>{this.setColors()}) }>
                  <Text style={appStyle.TextModalButton}>Aceptar</Text>
                </TouchableOpacity>
              </View>
              
            </View>     
          </View>
        </Modal>
        <Header {...this.props} stack='true'/> 
        <Camera update = {this.updateImages.bind(this)} images = {this.state.images} />
        <Text style={styles.textSection}>¿Cuándo y Dondé Fue la ultima vez que lo viste?</Text>
        <View style={[styles.containerForm2,styles.border]}>
          <DatePicker
            style={styles.dateTime}
            date={this.state.time_last_seen}
            mode="datetime"
            placeholder="Ingresa una fecha aproximada"
            format="YYYY-MM-DD HH:mm"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            showIcon={false}
            customStyles={{
                dateInput: {
                  height:10,
                  borderWidth:0,
                  paddingBottom:10, 
                  paddingHorizontal:8
                },
                dateText: {
                    color:'gray',
                    fontSize:14,
                    textAlign: 'left',
                    alignSelf: 'stretch'
                },
                placeholderText: {
                    color: '#a0a0a0',
                    fontFamily: Fonts.OpenSans,
                    fontSize:14,
                    textAlign: 'left',
                    alignSelf: 'stretch'
                }
            }}
            onDateChange={(date) => {this.setState({time_last_seen: date})}}
          />
          <GooglePlacesAutocomplete
            ref={(instance) => { this.locationRef = instance }}
            query={{ key: API_KEY,language: 'es',components: 'country:cl'}}
            placeholder='Ingresa una dirección'
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
                width:width*0.94,
              },
              textInput: {
                backgroundColor:'white',
                borderWidth: 1.3,
                borderColor: Colors.lightGray,
                borderRadius: 8,
                margin:10,
                marginBottom:0,
                paddingVertical:5,
                paddingHorizontal:10,
                height: 34,
                color: 'gray',
                fontSize: 14,
                fontFamily: Fonts.OpenSans
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
          <View style={styles.containerForm}>     
            <TextInput
              style = {[styles.input,{color:'gray'}]}
              placeholder = {'Nombre mascota (Opcional)'}
              placeholderTextColor = {'gray'}
              onChangeText={(value) => this.setState({name: value})}                         
            /> 
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={this.state.specieName}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({specie: itemIndex,specieName:itemValue}, () => {
                    this.getRaceBySpecie();
                  })
                  }>
                  <Picker.Item color= "#a0a0a0" label="Especie" value="0" />
                  { this.state.specieList.map( specie => (<Picker.Item key={specie.id} color="gray" label={specie.name} value={specie.name} />) ) }
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={this.state.sex}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({sex: itemValue})
                  }>
                  <Picker.Item color= "#a0a0a0" label="Sexo" value="" />
                  { this.state.sexList.map( sex => (<Picker.Item key={sex} color="gray" label={sex} value={sex} />) ) }
                </Picker>
              </View>
            </View>
            {this.state.more_info? this.renderMoreInformation():
                <TouchableOpacity 
                style={[styles.buttonPost,styles.border,styles.moreInfo]}
                onPress={() =>this.setState({more_info: true})}
              >
                <Icon name="plus" size={18} color='#9d9c9c' style={{marginRight:5,marginTop:3}} regular/>
                <Text style={[appStyle.textRegular,{fontSize:16}]}> Agregar más información </Text>
              </TouchableOpacity>  
            }
            <TextInput
              style = {[appStyle.inputArea, appStyle.textRegular]}
              placeholder = {'Agregue una descripción ...'}
              placeholderTextColor = {'gray'}
              multiline={true}
              numberOfLines={4}
              onChangeText={(value) => this.setState({details: value})}
            ></TextInput>  
            {type === 'SOS' ?
            <View style={[styles.border, styles.request]}>
              <View>
                <Text style={{fontFamily: Fonts.OpenSansSemiBold,marginBottom:5}}>Situación de emergencia</Text>
                <View style={[styles.pickerContainer,{borderColor : Colors.lightGray}]}>
                  <Picker
                    selectedValue={this.state.situation}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({situation: itemIndex})
                    }>
                    <Picker.Item color= "#a0a0a0" label="Situación" value="0" />
                    { this.state.situationList.map( situation => (<Picker.Item key={situation.id} color="gray" label={situation.name} value={situation.name} />) ) }
                  </Picker>
                </View>
              </View>
              <View style={{ alignItems:'center'}}>
                <Text style={{fontFamily: Fonts.OpenSansSemiBold,marginBottom:5}}>Solicitar ayuda</Text>
                <Switch
                   onValueChange={(value) =>
                    this.setState({rescue_request: value})
                  }
                  thumbColor="white" 
                  trackColor={{
                    true: Colors.primaryColor,
                    false: Colors.lightGray,
                }} 
                  value = {this.state.rescue_request}/>
              </View>
            </View>
              :null
            }
            <TouchableOpacity 
              style={appStyle.buttonLarge}
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
      margin:10,
      marginTop:5,
      marginBottom:10,
      paddingVertical:0,
      paddingHorizontal:2,
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
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    marginVertical:10,
    marginHorizontal:0,
    paddingVertical:1,
    paddingHorizontal:10,
  },
  pickerContainer:{
    borderWidth: 1.3,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    width: width*0.45,
  },
  picker:{
    height: 28,
    width: width*0.44,
    color: 'gray',
    },
  textWhite:{
    color:'white',
    fontFamily:Fonts.OpenSansBold,
    marginVertical:5,
    marginLeft:2
  },
  moreInformation:{
    backgroundColor: Colors.primaryColor,
    marginTop:10,
    marginVertical:5,
    padding:5,
    borderRadius:4
  },
  border:{
    borderWidth: 1.3,
    borderColor: Colors.primaryColor,
    borderRadius: 4,
  },
  pickersInfo:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom:4
  },
  textSection:{
    paddingHorizontal:10,
    marginTop: 10,
    fontFamily: Fonts.OpenSansSemiBold
  },
  containerForm2:{
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10,
    marginTop:5,
  },
  checkbox:{
    height: 30,
    width: width*0.44,
    paddingVertical:3,
    marginLeft:2,
    borderRadius:8,
    borderWidth:0
  },
  textPost:{
    color:'white',
    fontSize:20,
    fontFamily: Fonts.OpenSansBold
  },
  buttonPost:{
    marginTop: 5,
    borderRadius: 8,
    backgroundColor : Colors.primaryColor,
    alignItems: "center",
    justifyContent:'center',
    height: 45,
   },
   request:{
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:5,
    flexDirection:'row',
    justifyContent: 'space-between'
   },
   moreInfo:{
    backgroundColor:'white',
    borderColor: Colors.lightGray,
    flexDirection:'row',
    borderStyle: 'dashed',
    marginTop:10
   },
  });