import React from 'react';
import { StyleSheet, Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,ActivityIndicator} from 'react-native';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Camera from '../../components/Camera';
import {API} from '../../keys';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';
import NumericInput from 'react-native-numeric-input'

const {height, width} = Dimensions.get('window');
export default class CampaignFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      img_dir: '',
      details:'',
      textInput : [1],
      items : [{quantity: 0, item: ''}],
      donation_campaign:{},
      token: '',
    };
}

;
componentDidMount(){
  this.firebaseToken()
}


uploadImages = async (uri,name)=> {
  firebase.storage().ref(this.state.donation_campaign.img_dir + name).putFile(uri)
  .then(file => file.ref)
  .catch(error => console.log(error));
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

validate(){
  if(this.state.images.length == 0){
    alert("Seleccione al menos una imagen del rescatado.")
    return false
  }
  if(this.state.details == ''){
      alert("Hay datos sin completar en el formulario.")
      return false
  }
  if(this.state.items[0].item == ''){
    alert("Ingrese al menos un item.")
  }
  this.sendCampaign()
  return true
}
sendCampaign(){
  this.setState({modalSend:true,loading:true})
  fetch(API + 'donation_campaigns', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': this.state.token,
  },
  body: JSON.stringify({
    details: this.state.details,
    img_num: this.state.images.length,
    donation_items: this.state.items
  }), 
}).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.setState({donation_campaign: responseJson},()=>{
        console.log("IMPRIMIRE EL RESULTADO")
        console.log(this.state.donation_campaign)
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
addTextInput(){
    let textInput = this.state.textInput;
    textInput.push(this.state.textInput.length + 1);
    items = this.state.items
    items.push({quantity: 0, item: ''})
    this.setState({ textInput : textInput })
  }
updateItemNumber(index,number){
  let items = this.state.items
  item = {quantity: number, item: items[index].item}
  items[index] = item
  this.setState({items: items})
}
updateItem(index,name){
  let items = this.state.items
  item = {quantity: items[index].quantity, item: name }
  items[index] = item
  this.setState({items: items})
}
renderMoreInformation() {
    let Arr = this.state.textInput.map((a, index) => {
        return (
        <View key={index} style={{flexDirection:'row', marginVertical:10}}>
            <NumericInput onChange={value => this.updateItemNumber(index,value)} totalHeight={34} iconSize={25} valueType='real' minValue={0} totalWidth={width*0.24} borderColor={Colors.violet} rounded/>
            <TextInput 
                    style = {[appStyle.input,{color:'gray', width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'}]}
                    placeholder = {'Item ' + a}
                    placeholderTextColor = {'gray'}
                    value={this.state.items[index].item}
                    onChangeText={(value) => this.updateItem(index,value)}                         
            /> 
        </View>
      )}) 
  return(
    <View style={styles.moreInformation}>
      <Text style={[appStyle.buttonLargeText2,{margin:5}]}>LISTA DE DONATIVOS</Text>
      <View style={{backgroundColor:'white',padding:5}}>
        
        {Arr? Arr:null}
        <TouchableOpacity 
              style={[appStyle.buttonLarge2,{backgroundColor:'white',borderColor: Colors.gray,borderWidth:1.3}]}
              onPress={() => this.addTextInput(this.state.textInput.length)}
            >
              <Text style={[appStyle.textSemiBold, {fontSize:16}]}> + Agregar producto </Text>
            </TouchableOpacity>     
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
                  <Text style={{textAlign:'center',fontSize:16}}>Estamos publicando tu campaña.</Text>
                  <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                  <ActivityIndicator size="large" color= {Colors.primaryColor} />
                </View>
              :
              <View style={{marginBottom:30,alignSelf:'center'}}>
                <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                <Text style={{textAlign:'center',fontSize:14}}>Tu campaña de donación ha sido publicada con exito.</Text>
                <Text style={{textAlign:'center',fontSize:14}}>Ya puedes ir a hecharle un vistazo.</Text>
                <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                  onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('DetailDonationCampaign', { donation_campaign: this.state.donation_campaign})}) }>
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
  moreInformation:{
    backgroundColor: Colors.violet,
    marginTop:10,
    marginVertical:2,
    padding:2,
    borderRadius:4
  },
  containerForm2:{
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10,
    marginTop:5,
  },
});