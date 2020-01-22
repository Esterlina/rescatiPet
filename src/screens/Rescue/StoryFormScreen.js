import React from 'react';
import {Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,ActivityIndicator} from 'react-native';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Camera from '../../components/Camera';
import SelectProfile from '../../components/SelectProfle'
import {API} from '../../keys';
import firebase from 'react-native-firebase'
import Modal from "react-native-modal";
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style';
import 'moment/locale/es'
import {connect} from 'react-redux'

const {height, width} = Dimensions.get('window');
class StoryFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      image_dir: '',
      name:'',
      details:'',
      modalSend:false,
      loading: false,
      story:{},
      token: '',
      rescueds: []
    };
}
componentDidMount(){
    this.firebaseToken()
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

uploadImages = (uri, name) => firebase.storage().ref(this.state.story.img_dir + name).putFile(uri)


updateImages(images){
    this.setState({images:images})
}
updateRescueds(rescueds){
    this.setState({rescueds:rescueds})
    }
validate(){
  if (this.state.images.length == 0){
    alert("Debes subir al menos una imagen para la historia")
    return false
  }
  if (this.state.name == ''){
    alert("Debes ingresar un nombre para la historia.")
    return false
  }
  if (this.state.details == ''){
    alert("Debes agregar una descripción.")
    return false
  }
  this.sendStory();
  return true
}

sendStory(){
    this.setState({modalSend:true,loading:true})
    fetch(API + 'stories', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.token,
    },
    body: JSON.stringify({
        name: this.state.name,
        details: this.state.details,
        img_num: this.state.images.length,
        rescueds: this.state.rescueds
    }), 
    }).then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({story: responseJson},()=>{
            this.waitImages()
        });
    }).catch((error) =>{
        console.error(error);
    });
}
waitImages(){
    this.state.images.map((item,i) => {
      this.uploadImages(item.uri, "image_" + i + ".jpg").then(file => {
        if (file.ref) {
          if (i == this.state.images.length - 1) {
            this.setState({loading:false})
          }
        }
      })
    })
  }


  render(){ 
    return(
        <ScrollView style={{flex:1}}>
            <Modal isVisible={this.state.modalSend} style={{margin:20}}>
                <View style={{backgroundColor:'white',height:height*0.27,borderRadius:8}}>
                <View style={[appStyle.headerModal,{position:'absolute',top:0,width:width-40}]}>
                    <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.state.loading? "Publicando...": "Publicado"}</Text>
                </View>
                {this.state.loading?
                    <View style={{alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>Estamos publicando tu Historia.</Text>
                    <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                    <ActivityIndicator size="large" color= {Colors.primaryColor} />
                    </View>
                :
                <View style={{marginBottom:30,alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Tu historia ha sido publicado con exito.</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Ya puedes ir a hecharle un vistazo.</Text>
                    <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                    onPress={() =>this.setState({modalSend:false } ,()=>{this.props.navigation.navigate('DetailStory', { story: this.state.story})}) }>
                    <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
                }
                </View>
            </Modal>
            <Header {...this.props} stack='true'/> 
            <Text style={[appStyle.textTitle,{alignSelf:'center',marginTop:10}]}>Publicar historia</Text>
            <Camera update = {this.updateImages.bind(this)} images = {this.state.images} />
            <View style={{paddingHorizontal:10,paddingBottom:10}}>
                <View style={{marginTop:10}}>
                    <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Titulo </Text>
                    <TextInput
                    style = {[appStyle.input,{color:'gray',borderColor: Colors.lightGray}]}
                    value={this.state.name}
                    onChangeText={(value) => this.setState({name: value})}                         
                    /> 
                </View>
                <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Descripción</Text>    
                <TextInput
                    style = {[appStyle.inputArea, appStyle.textRegular]}
                    placeholder = {'Ingrese texto ...'}
                    placeholderTextColor = {'gray'}
                    multiline={true}
                    numberOfLines={5}
                    value = {this.state.details}
                    onChangeText={(value) => this.setState({details: value})}
                />
                <View style={{marginTop:10}}>
                    <Text style={[appStyle.textTitleCalipso,{fontSize:14}]}>Etiquetar a rescatado(s)</Text>  
                    <SelectProfile type = {'rescued'} placeholder = {"Buscar rescatado"} multiple={true} selectedItem={this.state.rescueds} update = {this.updateRescueds.bind(this)} color = {Colors.primaryColor}/>
                </View>
                 <TouchableOpacity style={[appStyle.buttonLarge]} onPress={() => this.validate()}>
                    <Text style={appStyle.buttonLargeText}> Publicar </Text>
                </TouchableOpacity> 
            </View>   
        </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
    console.log('State:');
    console.log(state);  // Redux Store --> Component
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
}
export default connect(mapStateToProps)(StoryFormScreen);