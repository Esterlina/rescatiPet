import React from 'react';
import { StyleSheet,Switch, Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,ActivityIndicator,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Helpers from '../../../lib/helpers'
import Camera from '../../components/Camera';
import {API} from '../../keys';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';
import Moment from 'moment';
import 'moment/locale/es'
import DatePicker from 'react-native-datepicker';


const {height, width} = Dimensions.get('window');
export default class RescuedFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image:[],
      url_image: '',
      name:'',
      birthday: '',
      specie: 0,
      specieName:'',
      sex:'',
      race: 0,
      size: '',
      state: '',
      details: '',
      colors:[],
      microship:false,
      sterile: false,
      sexList:[],
      specieList:[],
      raceList:[],
      sizeList:[],
      colorList:[],
      stateList:[],
      rescued:{},
      modalColors: false,
      modalSend:false,
      loading: false,
      token: ''
    };
}
componentDidMount(){
    return fetch(API + 'rescueds/animal_feature')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        specieList: responseJson['tipos_adoptivos'],
        raceList: responseJson['razas'],
        sexList: responseJson['sexos'],
        sizeList: responseJson['tamaños'],
        colorList: responseJson['colores'],
        stateList: responseJson['estados']
      },()=> this.firebaseToken());
    })
    .catch((error) =>{
      console.error(error);
    });
}

updateImage(images){
  this.setState({image:images})
}

async uploadImage(uri) {
  console.log("ESTOY SUBIENDO LA FOTO " );
  const name = "rescued_" + this.state.rescued.id
  firebase.storage().ref("images/profiles/rescueds/" + name ).putFile(uri)
  .then(file => {
    Helpers.getImageUrl(file.ref, (imageUrl)=>{
      this.setState({
        url_image: imageUrl
      },()=> {this.updateRescued()})
  });
  console.log(file.ref)})
  .catch(error => console.log(error));
}

validate(){
  console.log(this.state.image[0])
  console.log(this.state.name)
  console.log(this.state.birthday)
  console.log(this.state.specie)
  console.log(this.state.race)
  console.log(this.state.state)
  console.log(this.state.size)
  console.log(this.state.sex)
  console.log(this.state.colors)

  if (this.state.image.length == 0){
    alert("Debes subir una imagen para el perfil")
    return false
  }
  if (this.state.name == ''){
    alert("Debes ingresar un nombre para el rescatado.")
    return false
  }
  if (this.state.birthday == ''){
    alert("Debes ingresar una fecha de nacimiento aproximada.")
    return false
  }
  if (this.state.specie == 0){
    alert("Debe definir la especie del rescatado.")
    return false
  }
  if (this.state.race == 0){
    alert("Debe definir la raza del rescatado.")
    return false
  }
  if (this.state.sex == ''){
    alert("Debe definir el sexo del rescatado.")
    return false
  }
  if (this.state.size == '' || this.state.state == '' || this.state.colors.length == 0){
    console.log(this.state.size)
    console.log(this.state.state)
    console.log(this.state.colors)
    alert("Debes completas todos los campos de caracteristicas.")
    return false
  }
  this.sendRescued();
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

sendRescued(){
  this.setState({modalSend:true,loading:true})
  fetch(API + 'rescueds', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': this.state.token,
  },
  body: JSON.stringify({
    name: this.state.name,
    birthday: this.state.birthday,
    animal_type_id: this.state.specie,
    sex: this.state.sex,
    race_id: this.state.race,
    state: this.state.state,
    size: this.state.size,
    colors: this.state.colors,
    microship: this.state.microship,
    sterile: this.state.sterile,
    details: this.state.details,
  }), 
}).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.setState({rescued: responseJson},()=>{
      this.uploadImage(this.state.image[0].uri)
    });
  }).catch((error) =>{
    console.error(error);
  });
}
updateRescued(){
  fetch(API + 'rescueds/' + this.state.rescued.id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.state.token,
    },
    body: JSON.stringify({
      profile_picture: this.state.url_image
    }),
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson)
    this.setState({rescued: responseJson,loading:false})
  }).catch((error) =>{
    console.error(error);
    alert(error)
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
renderMoreInformation() {
    return(
      <View style={styles.moreInformation}>
        <Text style={[appStyle.buttonLargeText2,{marginLeft:5}]}>CARACTERISTICAS</Text>
        <View style={{backgroundColor:'white',padding:5}}>
        <View style={styles.pickersInfo}>
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
              { this.state.specieList.map( specie => (
              <Picker.Item key={specie.id} color="gray" label={specie.name} value={specie.name} />
              ) ) }
            </Picker>
          </View>
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
        </View>
        <View style={styles.pickersInfo}>
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
          <View style={[styles.pickerContainer,{backgroundColor:'white'}]}>
            <Picker
              selectedValue={this.state.state}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({state: itemValue})
              }>
              <Picker.Item key={0} color= "#a0a0a0" label="Estado" value="" />
              {this.state.stateList.map( state => (<Picker.Item key={state} color="gray" label={state} value={state} />))}              
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
                <Text style={{paddingTop:3,fontSize:15,color:'gray'}}>{this.state.colors.length != 0? this.state.colors : 'Color(es)'}</Text>
                <Icon name="sort-down" size={16} color='gray' style={{right:15,position:'absolute',alignSelf:'center'}} regular/>
            </TouchableOpacity>
          </View>
        </View>
        <View>
        <View style={[styles.pickersInfo,{marginTop:8}]}>
          <View style={{flexDirection:'row',width:width*0.42}}>
            <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Esterlizado/a</Text>
            <Switch
                onValueChange={(value) =>
                this.setState({sterile: value})
              }
              thumbColor="white" 
              style= {{position: "absolute",right:-10, alignSelf:'center'}}
              trackColor={{
                true: Colors.primaryColor,
                false: Colors.lightGray,
              }} 
              value = {this.state.sterile}/>
          </View>
          <View style={{flexDirection:'row',width:width*0.42}}>
            <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Microchip</Text>
            <Switch
                onValueChange={(value) =>
                this.setState({microship: value})
              }
              thumbColor="white" 
              style= {{position: "absolute",right:-10, alignSelf:'center'}}
              trackColor={{
                true: Colors.primaryColor,
                false: Colors.lightGray,
              }} 
              value = {this.state.microship}/>
          </View>
        </View>
        </View>
        </View>      
      </View>
    ) 
  }

  render(){ 
    Moment.locale('es')
    const today = Moment(new Date()).format('DD/MM/YYYY');
    return(
        <ScrollView style={{flex:1}}>
            <Modal isVisible={this.state.modalSend} style={{margin:20}}>
                <View style={{backgroundColor:'white',height:height*0.27,borderRadius:8}}>
                <View style={[appStyle.headerModal,{width:width-40,position:'absolute',top:0}]}>
                    <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.state.loading? "Registrando rescatado...": "Rescatado ingresado"}</Text>
                </View>
                {this.state.loading?
                    <View style={{alignSelf:'center',marginTop:50}}>
                      <Text style={{textAlign:'center',fontSize:16}}>Estamos ingresando a tu rescatado.</Text>
                      <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                      <ActivityIndicator size="large" color= {Colors.primaryColor} />
                    </View>
                :
                <View style={{marginBottom:30,alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Tu rescatado ha sido registrado con exito.</Text>
                    <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                    onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('Rescued',{rescued: this.state.rescued})}) }>
                    <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
                }
                </View>
            </Modal>
            <Modal isVisible={this.state.modalColors}
                hasBackdrop={true} style={{margin:20}}> 
                <View style={{backgroundColor:'white',height:height*0.65,borderRadius:8}}>
                    <View style={[appStyle.headerModal,{backgroundColor: Colors.primaryColor,top:0,width:width-40}]}>
                        <Text style={[appStyle.textTitle,{color:'white'}]}>Seleccione los colores</Text>
                    </View>
                    <ScrollView style={{marginTop:50}}>
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
            <Text style={[appStyle.textTitle,{alignSelf:'center',marginTop:10}]}>Registrar rescatado</Text>
            <Camera update = {this.updateImage.bind(this)} images = {this.state.image} type = {"Perfil"} />
            <View style={{marginHorizontal:10,marginBottom:10}}>
                <View style={{flexDirection:'row', marginVertical:20}}>
                    <Text style={appStyle.textSemiBold}>Nombre</Text>
                    <TextInput
                    style = {[appStyle.input,appStyle.inputRight,{borderColor: Colors.lightGray,width:width*0.6}]}
                    value={this.state.name}
                    onChangeText={(value) => this.setState({name: value})}                         
                    /> 
                </View>
                <View style={{flexDirection:'row', marginVertical:20}}>
                    <Text style={appStyle.textSemiBold}>Fecha nacimiento</Text>
                    <DatePicker
                      style={{width: width*0.6, position:'absolute', right:0,alignSelf:'center'}}
                      date={this.state.birthday}
                      maxDate={today}
                      mode="date"
                      placeholder= " "
                      format="DD/MM/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      customStyles={{
                          dateInput: {
                              height:34,
                              borderWidth:1.3,
                              borderRadius:8,
                              borderColor: Colors.lightGray,        
                          },
                          dateText: {
                              color:'gray',
                              fontSize:14,
                              textAlign: 'left',
                              alignSelf: 'flex-start',
                              marginLeft:8,
                              fontFamily: Fonts.OpenSans,
                          },
                      }}
                      onDateChange={(date) => {this.setState({birthday: date})}}
                  />
                </View>
                
                {this.renderMoreInformation()}

                <Text style={[appStyle.textTitleCalipso,{fontSize:14,marginTop:10}]}>Descripción (Opcional)</Text>    
                <TextInput
                style = {[appStyle.inputArea, appStyle.textRegular]}
                placeholder = {'Agregue una descripción breve del rescatado (Max 100 caracteres) ...'}
                placeholderTextColor = {'gray'}
                multiline={true}
                maxLength = {100}
                numberOfLines={5}
                value = {this.state.details}
                onChangeText={(value) => this.setState({details: value})}
                ></TextInput>  
                
                <TouchableOpacity style={[appStyle.buttonLarge]} onPress={() => this.validate()}>
                    <Text style={appStyle.buttonLargeText}> Registrar </Text>
                </TouchableOpacity> 
            </View>   
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
 
  border:{
    borderWidth: 1.3,
    borderColor: Colors.primaryColor,
    borderRadius: 4,
  },
  moreInfo:{
    backgroundColor:'white',
    borderColor: Colors.lightGray,
    flexDirection:'row',
    borderStyle: 'dashed',
    marginTop:10
   },
   pickersInfo:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom:8,
    marginHorizontal:5
  },
  moreInformation:{
    backgroundColor: Colors.primaryColor,
    marginTop:10,
    marginVertical:2,
    padding:2,
    borderRadius:4
  },
  pickerContainer:{
    borderWidth: 1.3,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    width: width*0.42,
  },
  picker:{
    height: 28,
    width: width*0.42,
    color: 'gray',
    },
  });