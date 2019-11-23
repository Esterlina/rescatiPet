import React from 'react';
import { StyleSheet,YellowBox, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,AsyncStorage,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Header from '../components/Header';
import Tag from '../components/Tag';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import UserAvatar from 'react-native-user-avatar';
import Helpers from '../../lib/helpers'
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import Modal from "react-native-modal";
import Match from '../components/Match'
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
import firebase from 'react-native-firebase'
import { API} from '../keys';

const fs = RNFetchBlob.fs;
let imagePath = null;
const {height, width} = Dimensions.get('window');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class DetailNotice extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      images_base64:[],
      loading: true,
      modalMatch:false,
      modalRequest:false,
      token:'',
    };
}
componentDidMount(){
  console.log("VOY A IMPRIMIR LO Q TRAIGO DE PROPS")
  console.log(this.props.request_sos)
  if(this.props.navigation.getParam('request_sos')){
    request = this.props.navigation.getParam('request_sos')
    this.setState({rejected: request.rechazado, accepted: request.aceptado})
  }
  this.firebaseToken();
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
componentWillMount(){  
  console.log(this.props.navigation.getParam('notice'))
  notice = this.props.navigation.getParam('notice');
  for (i=0; i < notice.img_num ; i++) {
    try{
      let url = notice.img_dir + 'image_' + i + '.jpg'
      Helpers.getImageUrl(url, (imageUrl)=>{
        this.setState({
          images:this.state.images.concat([imageUrl]),
          loading: false
        })
      })
    }
    catch(error){
      console.log(error)
    }
  } 
}

_renderItem = ( {item, index} ) => {
  console.log("rendering,", index, item)
  return (
    <View >
      <Image style={styles.image} source={{ uri: item }} />
    </View>
  );
}
updateModalMatch(modalMatch){
  this.setState({modalMatch:modalMatch})
  this.setState({modalRequest:modalMatch})
}
updateRequest(){
  this.setState({accepted:true, rejected:false})
}
updateMatchRequest(request_id){
  console.log("ESTOY EN EL UPDATE MATCH REQUESTTTTTTTTTTTTT" + request_id)
  fetch(API + 'matches/' + request_id, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.state.token,
    },
    body: JSON.stringify({
      rejected: true,
      accepted: false,
    }),
  });
}
displayRequest(request_id,name){
  if(this.state.rejected == true){
    return(
      <View style={[styles.notice,{borderColor: Colors.lightGray,padding:10}]}>
      <Text style={appStyle.textSemiBold}>Haz rechazado esta solicitud.</Text>
    </View>
    )
  }
  if(this.state.accepted == true){
    return(
      <View style={[styles.notice,{borderColor: Colors.lightGray,padding:10}]}>
      <Text style={appStyle.textSemiBold}>Usted ha aceptado la solicitud.</Text>
    </View>
    )
  }
  return(
    <View style={[styles.notice,{borderColor: Colors.lightGray,padding:10}]}>
      <Text style={appStyle.textSemiBold}>¿Desea aceptar la solicitud para colaborar y contactarse con {name}?</Text>
      <View style={{justifyContent: 'center',flexDirection:'row', alignSelf: 'stretch'}}>
          <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal]}
          onPress={() => this.setState({rejected:true,accepted:false},()=>{this.updateMatchRequest(request_id)})}>
              <Text style={appStyle.TextModalButton}>Rechazar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[appStyle.buttonModal,appStyle.buttonsModal,{backgroundColor: Colors.primaryColor,borderWidth: 0}]}
              onPress={() => this.setState({modalRequest:true})}>
              <Text style={[appStyle.TextModalButton,{color:'white'}]}>Aceptar</Text>
          </TouchableOpacity>
      </View>
    </View>  
  )
}

urlToBase64(url) { 
  return new Promise(resolve => {
    RNFetchBlob.config({
      fileCache: true
    })
      .fetch("GET", url)
      .then(resp => {
        imagePath = resp.path();
        return resp.readFile("base64");
      })
      .then(base64Data => {
        console.log(base64Data);
        let base64 = "data:image/jpeg;base64,"+base64Data
        this.setState({images_base64:this.state.images_base64.concat([base64])}) 
        fs.unlink(imagePath);
        resolve(this.state.images_base64.length);
      });  
  });
}

async share() {
  if(this.state.images_base64.length > 0){
    this.shareToSocial()
  }else{
    for (i=0; i < this.state.images.length ; i++){
      const largo  = await this.urlToBase64(this.state.images[i])
      if(this.state.images_base64.length == this.state.images.length){
          this.shareToSocial()
      }
    }
  }
}
async shareToSocial(){
  const notice = this.props.navigation.getParam('notice')
  const shareOptions = {
    title: 'Share file',
    message: notice.share,
    urls: this.state.images_base64,
    failOnCancel: true,
  };
  try {
    const ShareResponse = await Share.open(shareOptions);
    setResult(JSON.stringify(ShareResponse, null, 2));
  } catch (error) {
    console.log('Error =>', error);
    setResult('error: '.concat(getErrorString(error)));
  }
}

  render(){ 
    Moment.locale('es')
    const notice = this.props.navigation.getParam('notice')
    const request_sos = this.props.navigation.getParam('request_sos')
    var date_notice = Moment(notice.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_notice == today || date_notice ==  yesterday){
      date_create = Moment(notice.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_notice
    }
    return(
      <View style={styles.container}>
        <Header {...this.props} stack='true'/> 
        <ScrollView>
        <Modal isVisible={this.state.modalMatch} style={{margin:20}}>
          <Match updateRequest = {this.updateRequest.bind(this)} update = {this.updateModalMatch.bind(this)} notice = {notice}/>
        </Modal>
        <Modal isVisible={this.state.modalRequest} style={{margin:20}}>
          <Match updateRequest = {this.updateRequest.bind(this)} update = {this.updateModalMatch.bind(this)} notice = {notice} request = {request_sos}/>
        </Modal>
        <View style={styles.notice}>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
              {notice.usuario.perfil?
              <UserAvatar size="45" name={notice.usuario.nombre} src={notice.usuario.perfil}/>
              :
              <UserAvatar size="45" name={notice.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.semiBo} numberOfLines={1}>
                  {notice.usuario.nombre.length < 20
                  ? `${notice.usuario.nombre}`
                  : `${notice.usuario.nombre.substring(0, 21)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text>{date_create} - </Text>
                  {notice.estado == 'Abierto' ?
                  <Text style={[appStyle.textSemiBold,{color:'#19c9d4'}]}>Caso abierto</Text>:
                  <Text style={[appStyle.textSemiBold,{color:'red'}]}>Caso cerrado</Text>
                }
                </View>
              </View>
              <Tag type={notice.tipo}/>
            </View>  
            <View style={styles.carousel}>
              {!this.state.loading ?
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.images}
                renderItem={this._renderItem}
                sliderWidth={width*0.95}
                itemWidth={width*0.95}
              />
              : <ActivityIndicator size="large" color={Colors.primaryColor} />}
            </View>
            <View style={{flexDirection:'row'}}>
              <Icon name="map-marker-alt" size={20} color='gray' style={{marginRight:4}} regular/>
                  <Text numberOfLines={1}>{notice.dir.length < 45
                  ? `${notice.dir}`
                  : `${notice.dir.substring(0, 45)}...`}</Text>
            </View>
            {notice.detalles ?  <Text style={[appStyle.textRegular,styles.parrafo]}>{notice.detalles}</Text> : null}
            <View style={[styles.parrafo]}>
              {notice.visto? <Text>Visto durante el {Moment().format('YYYY') == Moment(notice.visto).format('YYYY')? <Text style={styles.semiBo}>{Moment(notice.visto).format('dddd D MMMM')}</Text>: <Text style={styles.semiBo}>{Moment(notice.visto).format('dddd D MMMM YYYY')}</Text>} cerca de las <Text style={styles.semiBo}>{Moment(notice.visto).format('HH:MM')}</Text> hrs. </Text> : null}
              {notice.visto?<Text>Por <Text style={styles.semiBo}>{notice.direccion} </Text></Text>  : null} 
            </View>
            <View style={styles.parrafo}>
              <Text style={[appStyle.textSemiBold,{fontSize:16,color:'#19c9d4'}]}>Características</Text> 
              <View style={styles.parrafo}>
                
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                  <Text style={styles.semiBo}>{notice.animal}</Text>
                  {notice.raza? <Text> {notice.raza}</Text> : null }
                </View>
                {notice.nombre?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                    <Text style={styles.semiBo}>Nombre: </Text>
                    <Text>{notice.nombre}</Text>               
                  </View>
                :null}
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                  <Text style={styles.semiBo}>Sexo: {notice.sexo}</Text>
                  {notice.edad? <Text>, {notice.edad}</Text> : null }
                </View>
                {notice.tamaño?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                    <Text style={styles.semiBo}>Tamaño: </Text>
                    <Text>{notice.tamaño}</Text>               
                  </View>
                :null}
                {notice.colores?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                    <Text style={styles.semiBo}>Colores: </Text>
                    <Text>{notice.colores}</Text>               
                  </View>
                :null}
                {notice.collar || notice.ropa || notice.microship?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                    {notice.collar || notice.ropa? <Text>Lleva puesto </Text>: <Text>Tiene microchip </Text> }
                    {notice.collar? <Text>Collar</Text> : null}
                    {notice.ropa? <Text> Ropa/chaleco</Text> : null}             
                  </View>
                :null}
                {notice.emergencia?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="first-aid" size={16} color='#ee1212' style={{marginRight:4}} regular/>
                    <Text>Encontrado/a en situacion de </Text>   
                    <Text style={styles.semiBo}>{notice.emergencia}</Text>             
                  </View>
                :null}
                {notice.solicitud?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="first-aid" size={16} color='#ee1212' style={{marginRight:4}} regular/> 
                    <Text style={[appStyle.textSemiBold,{color:'#ee1212'}]}> Se solicita colaboradores urgente</Text>             
                  </View>
                :null}
              </View> 
            </View>
          </View>
          <View style={styles.socialButtons}>
            {this.props.user.id != notice.usuario.id ? 
              <TouchableOpacity style={styles.socialButton} onPress={() =>console.log("holita")}>
                <Icon name="arrow-alt-circle-right" size={18} color='#929292' regular/> 
                <Text style={{color:'#929292'}}>seguir</Text>
              </TouchableOpacity>   
            :null}
            {this.props.user.id != notice.usuario.id?
              <TouchableOpacity style={styles.socialButton} onPress={() => this.setState({modalMatch:true})}>
                <Icon name="hands-helping" size={18} color='#929292' regular/> 
                <Text style={{color:'#929292'}}>match</Text>
              </TouchableOpacity>
            : null }   
            
            <TouchableOpacity style={styles.socialButton} onPress={() => this.share()}>
              <Icon name="share-square" size={18} color='#929292' regular/> 
              <Text style={{color:'#929292'}}>compartir</Text>
            </TouchableOpacity> 
          </View>
        </View>
        {request_sos? 
          this.displayRequest(request_sos.id,notice.usuario.nombre)
        :null}
      </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text:{
      fontSize: 14,
      color: 'gray',
      fontFamily: Fonts.OpenSans
    },
    semiBold:{
      fontSize: 14,
      color: 'gray',
      fontFamily: Fonts.OpenSansSemiBold
    },
    notice:{
      paddingTop:10,
      marginTop:10,
      marginHorizontal:5,
      marginBottom:10,
      borderWidth: 1.8,
      borderColor: Colors.primaryColor,
      borderRadius: 4,
    },
    image:{
      height: height*0.45,
      width:width * 0.95,
    },
    carousel:{
     justifyContent: 'center',
     alignItems:'center',
     marginVertical:10
    },
    parrafo:{
      marginLeft:5,
      marginRight: 8,
      marginVertical:5,
      textAlign:'justify'
    },
    socialButtons:{
    flexDirection:'row',
    //alignContent: 'flex-end', 
    height:height*0.065,
   // paddingVertical:5,
    borderTopWidth:0.8,
    borderTopColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  socialButton:{
    alignSelf: 'stretch',
    //backgroundColor: '#2980B9',
    justifyContent:'center',
    alignItems:'center' ,
  }
  
});

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};
export default connect(mapStateToProps)(DetailNotice);