import React from 'react';
import {PermissionsAndroid,Text,View, Dimensions,TouchableOpacity, ScrollView,TextInput,ActivityIndicator,Switch} from 'react-native';
import {Fonts} from '../utils/Fonts';
import Header from './Header';
import Camera from './Camera';
import {API} from '../keys';
import firebase from 'react-native-firebase'
import DocumentPicker from 'react-native-document-picker';
import Modal from "react-native-modal";
import {Colors} from '../styles/colors';
import appStyle from '../styles/app.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import 'moment/locale/es'
import {connect} from 'react-redux'


const {height, width} = Dimensions.get('window');
async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.warn(err)
    }
}

class BackgroundForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      files: [],
      files_dir: '',
      image_dir: '',
      details:'',
      vaccinated: false,
      dewormed: false,
      modalSend:false,
      loading: false,
      upload_images:false,
      upload_files:false,
      background:{},
      token: '',
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

async getPathForFirebaseStorage (uri) {
    if(uri.includes("raw%3A")){
        const filePath = uri.split('raw%3A')[1].replace(/\%2F/gm, '/');
        return filePath
    }else{return uri}
}
uploadImage = async (uri,name)=> {
    console.log("INGRESAR EL ARCHIVO " + name)
    firebase.storage().ref(this.state.background.img_dir + name).putFile(uri)
    .then(file => file.ref)
    .catch((error) => {console.log(error);})
} 
uploadDocument = async (uri,name,i)=> {
    console.log("INGRESAR EL ARCHIVO " + name)
    const fileUri = await this.getPathForFirebaseStorage(uri)
    path = this.state.background.file_dir + "file_" + i
    firebase.storage().ref(path).putFile(fileUri,{customMetadata: {
        file_name: name
    }})
    .then(file => {
        file.ref
    })
    .catch((error) => {console.log(error);})
}  

updateImages(images){
    this.setState({images:images})
}
async pickerFiles(){
    permission = await requestStoragePermission()
    if(permission){
        try {
            const results = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.pdf,DocumentPicker.types.plainText],
            });
            for (const res of results) {
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );
            var document = {name: res.name, type:res.type, uri: res.uri}
            this.setState({
                files:this.state.files.concat([document]),
            })
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
            } else {
            throw err;
            }
        }
    }else{
        alert("No se puede seleccionar archivos. Para solucionarlo, vaya a la configuración de la aplicación y otorgue los permisos de almacenamiento.")
    }
}

sendBackground(){
    const rescued = this.props.navigation.getParam('rescued')
   this.setState({modalSend:true,loading:true,upload_files:(this.state.files.length == 0? true:false),upload_images:(this.state.images.length == 0? true:false)})
    fetch(API + 'rescueds/'+ rescued.id + '/background', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.token,
    },
    body: JSON.stringify({
        details: this.state.details,
        img_num: this.state.images.length,
        file_num: this.state.files.length,
        vaccinated: this.state.vaccinated,
        dewormed: this.state.dewormed
    }), 
    }).then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            background: responseJson["background"],
        },() => {
            if(this.state.images.length == 0 && this.state.files.length == 0){
                this.setState({loading:false})
            }else{
                this.state.images.map((item,i) => {
                    this.uploadImage(item.uri,"image_" + i + ".jpg")
                    if (i == this.state.images.length -1){
                        this.setState({upload_images:true},()=>{
                            if(this.state.upload_files){
                                this.setState({loading:false})
                            }
                        })
                    }
                })
                this.state.files.map((item,i) => {
                    this.uploadDocument(item.uri,item.name,i)
                    if (i == this.state.files.length -1){
                        this.setState({upload_files:true},()=>{
                            if(this.state.upload_images){
                                this.setState({loading:false})
                            }
                        })
                    }
                })   
            };
        })
    }).catch((error) =>{
        console.error(error);
    });
}

  render(){ 
    const rescued = this.props.navigation.getParam('rescued')
    return(
        <ScrollView style={{flex:1}}>
            <Modal isVisible={this.state.modalSend} style={{margin:20}}>
                <View style={{backgroundColor:'white',height:height*0.27,borderRadius:8}}>
                <View style={[appStyle.headerModal,{position:'absolute',top:0,width:width-40}]}>
                    <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.state.loading? "Publicando...": "Publicado"}</Text>
                </View>
                {this.state.loading?
                    <View style={{alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>Estamos agregando los datos.</Text>
                    <Text style={{textAlign:'center',fontSize:14,marginBottom:30}}>Por favor, espera unos segundos.</Text>
                    <ActivityIndicator size="large" color= {Colors.primaryColor} />
                    </View>
                :
                <View style={{marginBottom:30,alignSelf:'center',marginTop:50}}>
                    <Text style={{textAlign:'center',fontSize:16}}>¡Enhora buena!</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Datos ingresados con exitos</Text>
                    <Text style={{textAlign:'center',fontSize:14}}>Ya puedes ver la actualización.</Text>
                    <TouchableOpacity style={[appStyle.buttonModal,{width:width*0.3,alignSelf:'center'}]}
                    onPress={() =>this.setState({modalSend:false } ,()=>{console.log(this.state.background);this.props.navigation.navigate('Rescued', { rescued_id: rescued.id, background: this.state.background})}) }>
                    <Text style={{fontSize:16,textAlign:'center'}}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
                }
                </View>
            </Modal>
            <Header {...this.props} stack='true'/> 
            <Text style={[appStyle.textTitle,{marginTop:10,textAlign:'center'}]}>Agregar antecedentes y datos veterinarios</Text>
            <Camera update = {this.updateImages.bind(this)} images = {this.state.images} />
            <TouchableOpacity style={[appStyle.buttonLarge2,{marginHorizontal:10,marginTop:10,marginBottom:5}]} onPress={() => this.pickerFiles()}>
                <Text style={[appStyle.buttonLargeText2]}> + Adjuntar documento(s)</Text>
            </TouchableOpacity>
            <View style={{paddingHorizontal:10,paddingBottom:10}}>
            {this.state.files.length > 0? 
                this.state.files.map((file,i) => {
                    return(
                        <View key={i} style={{flexDirection:'row',borderWidth:1,borderColor:Colors.lightGray,padding:5,marginVertical:5}}>
                            {file.type == "application/pdf" || file.type == "com.adobe.pdf"? 
                                <Icon name="file-pdf" size={25} color={Colors.red} style={{marginRight:4,alignSelf:'center'}}  solid/>
                            :
                            <Icon name="file-alt" size={25} color={Colors.gray} style={{marginRight:4,alignSelf:'center'}}  regular/>
                            }
                            <Text style={[appStyle.textRegular,{flexWrap:'wrap',flex:1}]}>{file.name}</Text>
                        </View>
                    )
                })
            :null}  
            <View style={[appStyle.moreInformation,{backgroundColor:'white',borderWidth:1.3,borderColor:Colors.primaryColor}]}>
                <View style={[appStyle.pickersInfo,{marginTop:8}]}>
                    <View style={{flexDirection:'row',width:width*0.42}}>
                        <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Desparacitado</Text>
                        <Switch
                            onValueChange={(value) =>
                            this.setState({dewormed: value})
                        }
                        thumbColor="white" 
                        style= {{position: "absolute",right:-10, alignSelf:'center'}}
                        trackColor={{
                            true: Colors.primaryColor,
                            false: Colors.lightGray,
                        }} 
                        value = {this.state.dewormed}/>
                    </View>
                    
                    <View style={{flexDirection:'row',width:width*0.42}}>
                        <Text style={[appStyle.textSemiBold,{alignSelf:'center'}]}>Vacunado</Text>
                        <Switch
                            onValueChange={(value) =>
                            this.setState({vaccinated: value})
                        }
                        thumbColor="white" 
                        style= {{position: "absolute",right:-10, alignSelf:'center'}}
                        trackColor={{
                            true: Colors.primaryColor,
                            false: Colors.lightGray,
                        }} 
                        value = {this.state.vaccinated}/>
                    </View>
                    </View>
                </View>
                <Text style={[appStyle.textRegular],{marginTop:8}}>Aquí puedes ingresar antecedentes médicos y otros datos relevantes sobre tu rescatado.</Text>    
                <TextInput
                    style = {[appStyle.inputArea, appStyle.textRegular,appStyle.two]}
                    placeholder = {'Ingrese texto ...'}
                    placeholderTextColor = {'gray'}
                    multiline={true}
                    numberOfLines={10}
                    value = {this.state.details}
                    onChangeText={(value) => this.setState({details: value})}
                />
                 <TouchableOpacity style={[appStyle.buttonLarge]} onPress={() => this.sendBackground()}>
                    <Text style={appStyle.buttonLargeText}> Agregar </Text>
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
export default connect(mapStateToProps)(BackgroundForm);