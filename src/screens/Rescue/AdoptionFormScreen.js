import React from 'react';
import { StyleSheet,Switch, Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Camera from '../../components/Camera';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {API_KEY, API} from '../../keys';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';
import { StackActions,NavigationActions } from 'react-navigation';

const {height, width} = Dimensions.get('window');
export default class AdoptionFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      img_dir: '',
      details:'',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      name:'',
      specie: 0,
      specieName:'',
      sex:'',
      race: 0,
      age:'',
      size: '',
      color:'',
      sexList:[],
      specieList:[],
      raceList:[],
      ageList:[],
      sizeList:[],
      colorList:[],
      notice:{},
      token:'',
      modalColors: false,
      colors:[],
      modalSend:false,
      loading: false,
      sterile: false,
      dewormed: false,
      vaccinated: false,
      microship: false
    };
}

reset(){
  console.log("PROBANDO EL RESEEET x222222222222 ADOPCIOOOON")
    const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Rescue', // Call home stack
        action: NavigationActions.navigate({
          routeName: 'Options', // Navigate to this screen
        }),
      }),
    ],
    key: 'DashboardTabNavigator',
  });
  this.props.navigation.dispatch(resetAction);
  this.GooglePlacesRef.setAddressText("")
  this.setState({
    images: [],
      img_dir: '',
      details:'',
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
      name:'',
      specie: 0,
      specieName:'',
      sex:'',
      race: 0,
      age:'',
      size: '',
      color:'',
      modalColors: false,
      colors:[],
      modalSend:false,
      loading: false,
      sterile: false,
      dewormed: false,
      vaccinated: false,
      microship: false
  })
};
componentDidMount(){
  return fetch(API + 'notices/info_notice')
  .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        specieList: responseJson['tipos_adoptivos'],
        raceList: responseJson['razas'],
        sexList: responseJson['sexos'],
        ageList: responseJson['edades'],
        sizeList: responseJson['tamaños'],
        colorList: responseJson['colores'],
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
  if (this.state.address == ''){
    alert("Debe completar el campo de dirección,ingresar una dirección cercana o la comuna.")
    return false
  }
  if (this.state.specie == 0){
    alert("Por favor, ingrese el tipo de animal.")
    return false
  }
  if(this.state.sex == '' || this.state.age == '' || this.state.size == '' || this.state.colorList == []){
    alert("Aún faltan campos por completas")
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
    type: "Adopcion",
    lat: this.state.marker.latitude,
    lng: this.state.marker.longitude,
    street: this.state.address,
    name: this.state.name,
    animal_type_id: this.state.specie,
    sex: this.state.sex,
    race_id: this.state.race,
    age: this.state.age,
    size: this.state.size,
    colors: this.state.colors,
    vaccinated: this.state.vaccinated,
    microship: this.state.microship,
    sterile: this.state.sterile,
    dewormed: this.state.dewormed,
    details: this.state.details,
    img_num: this.state.images.length,
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
          this.reset();
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

renderMoreInformation() {
  return(
    <View style={styles.moreInformation}>
      <Text style={[styles.textWhite,{marginLeft:5}]}>CARACTERISTICAS</Text>
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
              <Text style={{paddingTop:3,fontSize:15,color:'gray'}}>{this.state.colors.length != 0? this.state.colors : 'Color(es)'}</Text>
              <Icon name="sort-down" size={16} color='gray' style={{right:15,position:'absolute',alignSelf:'center'}} regular/>
          </TouchableOpacity>
        </View>
      </View>
      <View>
      <View style={[styles.pickersInfo,{marginTop:8}]}>
        <View style={{flexDirection:'row',width:width*0.42}}>
          <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Vacunado/a</Text>
          <Switch
              onValueChange={(value) =>
              this.setState({vaccinated: value})
            }
            thumbColor="white" 
            style= {{position: "absolute",right:-10, alignSelf:'center'}}
            trackColor={{
              true: Colors.violet,
              false: Colors.lightGray,
            }} 
            value = {this.state.vaccinated}/>
        </View>
        <View style={{flexDirection:'row',width:width*0.42}}>
          <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Desparacitado/a</Text>
          <Switch
              onValueChange={(value) =>
              this.setState({dewormed: value})
            }
            thumbColor="white" 
            style= {{position: "absolute",right:-10, alignSelf:'center'}}
            trackColor={{
              true: Colors.violet,
              false: Colors.lightGray,
            }} 
            value = {this.state.dewormed}/>
        </View>
      </View>
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
              true: Colors.violet,
              false: Colors.lightGray,
            }} 
            value = {this.state.sterile}/>
        </View>
        <View style={{flexDirection:'row',width:width*0.42}}>
          <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Microship</Text>
          <Switch
              onValueChange={(value) =>
              this.setState({microship: value})
            }
            thumbColor="white" 
            style= {{position: "absolute",right:-10, alignSelf:'center'}}
            trackColor={{
              true: Colors.violet,
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
                <Text style={{textAlign:'center',fontSize:14}}>Tu aviso de adopción ha sido publicado con exito.</Text>
                <Text style={{textAlign:'center',fontSize:14}}>Ya puedes ir a hecharle un vistazo.</Text>
                <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                  onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('DetailAdoption', { adoption: this.state.notice})}) }>
                  <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                </TouchableOpacity>
              </View>
              }
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
        <Camera update = {this.updateImages.bind(this)} images = {this.state.images} type = {"Adopcion"} />
        <View style={styles.containerForm}>
          <View style={{flexDirection:'row',marginVertical:10, marginTop:20}}>
            <Text style={[appStyle.textSemiBold,{alignSelf:'center',marginHorizontal:5}]}>Nombre </Text>
            <TextInput
              style = {[styles.input,{color:'gray', width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}
              //placeholder = {'Nombre mascota (Opcional)'}
              //placeholderTextColor = {'gray'}
              value={this.state.name}
              onChangeText={(value) => this.setState({name: value})}                         
            /> 
          </View>
          <View style={{flexDirection:'row',marginVertical:10,marginBottom:0}}>
            <Text style={[appStyle.textSemiBold,{alignSelf:'center',marginHorizontal:5}]}>Comuna </Text>
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
                //position:'absolute',
                //right:0,
                alignSelf:'flex-end'
              },
              textInput: {
                backgroundColor:'white',
                borderWidth: 1.3,
                borderColor: Colors.violet,
                borderRadius: 8,
                margin:10,
                marginBottom:0,
                paddingVertical:5,
                paddingHorizontal:10,
                height: 34,
                color: 'gray',
                fontSize: 14,
                fontFamily: Fonts.OpenSans,
                width:width*0.65,
                position:'absolute',
                right:-8,
                alignSelf:'center'
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
            }}
          />
        </View>
          {this.renderMoreInformation()}
        </View>

          <View style={styles.containerForm}>     
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
              style={[appStyle.buttonLarge,{backgroundColor:Colors.violet}]}
              onPress={() => this.validate()}
            >
              <Text style={appStyle.buttonLargeText}> Publicar adopción </Text>
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
    borderColor: Colors.violet,
    borderRadius: 8,
    marginVertical:10,
    marginHorizontal:0,
    paddingVertical:1,
    paddingHorizontal:10,
  },
  pickerContainer:{
    borderWidth: 1.3,
    borderColor: Colors.violet,
    borderRadius: 8,
    width: width*0.42,
  },
  picker:{
    height: 28,
    width: width*0.42,
    color: 'gray',
    },
  textWhite:{
    color:'white',
    fontFamily:Fonts.OpenSansBold,
    marginVertical:5,
    marginLeft:2
  },
  moreInformation:{
    backgroundColor: Colors.violet,
    marginTop:10,
    marginVertical:2,
    padding:2,
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
    marginBottom:8,
    marginHorizontal:5
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