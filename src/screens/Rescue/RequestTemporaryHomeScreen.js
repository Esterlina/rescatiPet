import React from 'react';
import { StyleSheet,Switch, Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,ActivityIndicator} from 'react-native';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Camera from '../../components/Camera';
import {API} from '../../keys';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';

const {height, width} = Dimensions.get('window');
export default class RequestTemporaryHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      img_dir: '',
      details:'',
      home_type:'',
      rescued: '',
      region: '',
      comuna: '',
      number_time: '',
      time: '',
      home_types:[],
      rescued_receive:[],
      regions:[],
      comunas:[],
      times: [],
      request_home:{},
      token: '',
    };
}

;
componentDidMount(){
  this.firebaseToken()
  return fetch(API + 'temporary_homes/info')
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
        rescued_receive: responseJson['animales_temporales'],
        home_types: responseJson['tipo_hogar_termporal'],
        times: responseJson['tiempo'],
        regions: responseJson['regiones']
      });
      })
      .catch((error) =>{
      console.error(error);
  });
}

getComunasByRegion(){
  if(this.state.region_id != 0){
      return fetch(API + 'temporary_homes/comunas/' + this.state.region_id)
      .then((response) => response.json())
      .then((responseJson) => {
          console.log("IMPRIMIRE LA RESPUESTA")
          console.log(responseJson)
      this.setState({
          comunas: responseJson['comunas'],
      },()=> {console.log(this.state.region_id)});
      })
      .catch((error) =>{
      console.error(error);
  });
  }
}

uploadImages = async (uri,name)=> {
  console.log("ESTOY SUBIENDO LA FOTO " + name);
  firebase.storage().ref(this.state.request_home.img_dir + name).putFile(uri)
  .then(file => file.ref)
  .catch(error => console.log(error));
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

validate(){
  if(this.state.images.length == 0){
    alert("Seleccione al menos una imagen del rescatado.")
    return false
  }
  if(this.state.comuna == '' || this.state.home_type == '' || this.state.time == '' || this.state.details == ''){
      alert("Hay datos sin completar en el formulario.")
      return false
  }
  if(this.state.number_time == 0 && this.state.time != 'Indefinido'){
      alert("Por favor, ingrese la cantidad de " + this.state.time)
      return false
  }
  if(this.state.rescued  == ""){
      alert("Ingrese para que tipo de rescatado es el hogar temporal.")
      return false
  }
  this.sendRequestHome()
  return true
}
sendRequestHome(){
  this.setState({modalSend:true,loading:true})
  fetch(API + 'temporary_homes/requests', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': this.state.token,
  },
  body: JSON.stringify({
    comuna: this.state.comuna,
    home_type: this.state.home_type,
    rescued: this.state.rescued,
    number_time: this.state.number_time,
    time: this.state.time,
    details: this.state.details,
    img_num: this.state.images.length,
  }), 
}).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.setState({request_home: responseJson},()=>{
        console.log("IMPRIMIRE EL RESULTADO")
        console.log(this.state.request_home)
        this.state.images.map((item,i) => {
          this.uploadImages(item.uri,"image_" + i + ".jpg")
          if (i == this.state.images.length -1){
            console.log("lA ULTIMA IMAGEN ES ");
            console.log(i)
            this.setState({loading:false})
          }
        }) 
    });   
  }).catch((error) =>{
    console.error(error);
  });
}

updateImages(images){
  this.setState({images:images})
}

renderMoreInformation() {
  return(
    <View style={styles.moreInformation}>
      <Text style={[appStyle.buttonLargeText2,{margin:5}]}>CARACTERISTICAS</Text>
      <View style={{backgroundColor:'white',padding:5}}>
        <View style={{flexDirection:'row', marginVertical:10}}>
            <Text style={appStyle.textSemiBold}>Buscar hogar para</Text>
            <View style={[appStyle.input,{height:34,width:width*0.55,position: 'absolute', right: 0, alignSelf:'center'}]}>
                <Picker
                    selectedValue={this.state.rescued}
                    style={{color:'gray',height:30, width:width*0.55, alignSelf:'center'}}
                    onValueChange={(itemValue, itemIndex) =>
                    this.setState({rescued: itemValue})
                    }>
                    <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                    {this.state.rescued_receive.map( rescued => (<Picker.Item key={rescued} color="gray" label={rescued} value={rescued} />))}              
                </Picker>
            </View>
        </View>
        <View style={{flexDirection:'row', marginVertical:10}}>
            <Text style={appStyle.textSemiBold}>Tipo de vivienda</Text>
            <View style={[appStyle.input,{height:34,width:width*0.55,position: 'absolute', right: 0, alignSelf:'center'}]}>
                <Picker
                    selectedValue={this.state.home_type}
                    style={{color:'gray',height:30, width:width*0.55, alignSelf:'center'}}
                    onValueChange={(itemValue, itemIndex) =>
                    this.setState({home_type: itemValue})
                    }>
                    <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                    {this.state.home_types.map( home_type => (<Picker.Item key={home_type} color="gray" label={home_type} value={home_type} />))}              
                </Picker>
            </View>
        </View>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Text style={appStyle.textSemiBold}>Región</Text>
          <View style={[appStyle.input,{height:34,width:width*0.55,position: 'absolute', right: 0, alignSelf:'center'}]}>
              <Picker
                  selectedValue={this.state.region}
                  style={{color:'gray',height:30, width:width*0.55, alignSelf:'center'}}
                  onValueChange={(itemValue, itemIndex) =>
                      {this.setState({region:itemValue,region_id:itemIndex},() => {this.getComunasByRegion();})}
                  }>
                  <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                  {this.state.regions.map( region => (<Picker.Item key={region.id} color="gray" label={region.name} value={region.name} />))}              
              </Picker>
          </View>
        </View>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Text style={appStyle.textSemiBold}>Comuna</Text>
          <View style={[appStyle.input,{height:34,width:width*0.55,position: 'absolute', right: 0, alignSelf:'center'}]}>
              <Picker
                  selectedValue={this.state.comuna}
                  style={{color:'gray',height:30, width:width*0.55, alignSelf:'center'}}
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({comuna: itemValue})
                  }>
                  <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                  {this.state.comunas.map( comuna => (<Picker.Item key={comuna.id} color="gray" label={comuna.name} value={comuna.name} />))}              
              </Picker>
          </View>
        </View>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Text style={appStyle.textSemiBold}>Tiempo</Text>
          <View style={{flexDirection:'row',position: 'absolute', right: 0,alignSelf:'center'}}>
          <TextInput
              style = {[appStyle.input,{color:'gray', width:35, alignSelf:'center',backgroundColor:'white', marginVertical:0,marginHorizontal:5}]}
              keyboardType = 'numeric'
              value={`${this.state.number_time}`}
              onChangeText={(value) => this.setState({number_time: value})}                         
          />
          <View style={[appStyle.input,{height:34,width:width*0.44, alignSelf:'center'}]}>
              <Picker
                  selectedValue={this.state.time}
                  style={{color:'gray',height:30, width:width*0.44, alignSelf:'center'}}
                  onValueChange={(itemValue, itemIndex) =>
                  this.setState({time: itemValue})
                  }>
                  <Picker.Item key={0} color= "#a0a0a0" label="" value="" />
                  {this.state.times.map( time => (<Picker.Item key={time} color="gray" label={time} value={time} />))}              
              </Picker>
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
                  onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('DetailRequestHome', { request_home: this.state.request_home})}) }>
                  <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                </TouchableOpacity>
              </View>
              }
            </View>
        </Modal>
        <Header {...this.props} stack='true'/> 
        <Camera update = {this.updateImages.bind(this)} images = {this.state.images} type = {"Adopcion"} />
        <View style={styles.containerForm}>
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
              <Text style={appStyle.buttonLargeText}> Publicar </Text>
            </TouchableOpacity>     
          </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    containerForm:{
      paddingHorizontal:10,
      paddingBottom:10,
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
  moreInformation:{
    backgroundColor: Colors.violet,
    marginTop:10,
    marginVertical:2,
    padding:2,
    borderRadius:4
  },
  pickersInfo:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom:8,
    marginHorizontal:5
  },
  containerForm2:{
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10,
    marginTop:5,
  },
});