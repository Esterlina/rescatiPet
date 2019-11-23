import React from 'react';
import { StyleSheet,YellowBox, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,AsyncStorage,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Header from '../components/Header';
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
class DetailAdoption extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      images_base64:[],
      loading: true,
      modalMatch:false,
      token:'',
    };
}
componentDidMount(){ 

    if(this.props.adoption == undefined){
        adoption = this.props.navigation.getParam('adoption')
    }
    else{
        adoption = this.props.adoption
    }
  for (i=0; i < adoption.img_num ; i++) {
    try{
      let url = adoption.img_dir + 'image_' + i + '.jpg'
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
  const adoption = this.props.navigation.getParam('adoption')
  const shareOptions = {
    title: 'Share file',
    message: adoption.share,
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
    console.log(this.props.adoption)
    
    if(this.props.adoption == undefined){
         adoption = this.props.navigation.getParam('adoption')
    }
    else{
         adoption = this.props.adoption
    }
    var date_adoption = Moment(adoption.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_adoption == today || date_adoption ==  yesterday){
      date_create = Moment(adoption.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_adoption
    }
    return(
      <View style={styles.container}>
          {this.props.adoption == undefined? <Header {...this.props} stack='true' home='Home'/> :null}
        <ScrollView>
        <Modal isVisible={this.state.modalMatch} style={{margin:20}}>
          <Match update = {this.updateModalMatch.bind(this)} notice = {adoption}/>
        </Modal>
        <View style={[appStyle.containerPublication,{marginTop:10}]}>
        <View style={appStyle.header}>
                <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>En adopción</Text>
              </View>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
              {adoption.usuario.perfil?
              <UserAvatar size="45" name={adoption.usuario.nombre} src={adoption.usuario.perfil}/>
              :
              <UserAvatar size="45" name={adoption.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {adoption.usuario.nombre.length < 20
                  ? `${adoption.usuario.nombre}`
                  : `${adoption.usuario.nombre.substring(0, 21)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>{date_create} - </Text>
                  {adoption.estado == 'Abierto' ?
                  <Text style={appStyle.textRegular}>{(adoption.comuna + ", " + adoption.provincia).length < 24
                    ? `${(adoption.comuna + ", " + adoption.provincia)}`
                    : `${(adoption.comuna + ", " + adoption.provincia).substring(0, 21)}...`}</Text>:
                  <Text style={[appStyle.textSemiBold,{color: Colors.violet}]}>Adoptado</Text>
                }
                </View>
              </View>
              <Image
                source={require('../icons/rescue/adoption.png')}
                style= {{width:35,height:35,right:0,top:10, position:'absolute'}}
              />
            </View>  
            <View style={styles.carousel}>
              {!this.state.loading ?
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.images}
                renderItem={this._renderItem}
                sliderWidth={width*0.92}
                itemWidth={width*0.92}
              />
              : <ActivityIndicator size="large" color={Colors.violet} />}
            </View>
 
            
            <View style={styles.parrafo}>
             <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet}]}>Características de {adoption.nombre}</Text> 
              <View style={styles.parrafo}>
                
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color={Colors.violet} style={{marginRight:4}} regular/>
                  <Text style={appStyle.textSemiBold}>{adoption.animal}</Text>
                  {adoption.raza? <Text style={appStyle.textRegular}> {adoption.raza}</Text> : null }
                </View>
                <View style={{flexDirection:'row'}}>
                  {adoption.sexo == "Hembra"? 
                    <Icon name="venus" size={20} color= {Colors.violet} style={{marginRight:4}} regular/>
                    :<Icon name="mars" size={20} color= {Colors.violet} style={{marginRight:4}} regular/>
                  }
                  <Text style={appStyle.textSemiBold}>{adoption.sexo}</Text>
                  {adoption.edad? <Text style={appStyle.textRegular}>, {adoption.edad}</Text> : null }
                </View>
                {adoption.tamaño?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="paw" size={16} color={Colors.violet} style={{marginRight:4}} regular/>
                    <Text style={appStyle.textSemiBold}>Tamaño: </Text>
                    <Text style={appStyle.textRegular}>{adoption.tamaño}</Text>               
                  </View>
                :null}
                {adoption.colores?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="palette" size={16} color={Colors.violet} style={{marginRight:4}} regular/>
                    <Text style={appStyle.textSemiBold}>Colores: </Text>
                    <Text style={appStyle.textRegular}>{adoption.colores}</Text>               
                  </View>
                :null}
                {adoption.vacunado?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="check-square" size={18} color={Colors.lightGreen} style={{marginRight:4}} solid/>
                    {adoption.sexo == "Macho"?
                     <Text style={appStyle.textSemiBold}>Vacunado</Text>:
                     <Text style={appStyle.textSemiBold}>Vacunada</Text>
                    }
                  </View>
                :null}
                {adoption.desparacitado?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="check-square" size={18} color={Colors.lightGreen} style={{marginRight:4}} solid/>
                    <Text style={appStyle.textSemiBold}>Desparacitado</Text>
                  </View>
                :null}
                {adoption.esteril?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="check-square" size={18} color={Colors.lightGreen} style={{marginRight:4}} solid/>
                    {adoption.sexo == "Macho"?
                     <Text style={appStyle.textSemiBold}>Castrado</Text>:
                     <Text style={appStyle.textSemiBold}>Esterlizada</Text>
                    }
                   
                  </View>
                :null}
                {adoption.microship?
                  <View style={{flexDirection:'row'}}>
                    <Icon name="check-square" size={18} color={Colors.lightGreen} style={{marginRight:4}} solid/>
                    <Text style={appStyle.textSemiBold}>Microchip</Text>
                  </View>
                :null}
                
              </View> 
            </View>
            {adoption.detalles ?  <Text style={[appStyle.textRegular,styles.parrafo]}>{adoption.detalles}</Text> : null}
          </View>
          <View style={styles.socialButtons}>
            {this.props.user.id != adoption.usuario.id?
              <TouchableOpacity style={styles.socialButton} onPress={() => this.setState({modalMatch:true})}>
                <Icon name="hands-helping" size={18} color='#929292' regular/> 
                <Text style={{color:'#929292'}}>¡Adoptar!</Text>
              </TouchableOpacity>
            : null }   
            
            <TouchableOpacity style={styles.socialButton} onPress={() => this.share()}>
              <Icon name="share-square" size={18} color='#929292' regular/> 
              <Text style={{color:'#929292'}}>compartir</Text>
            </TouchableOpacity> 
          </View>
        </View>
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
    image:{
      height: height*0.45,
      width:width * 0.95,
    },
    carousel:{
     justifyContent: 'center',
     alignItems:'center',
     marginVertical:10,
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
    height: 45,
    paddingVertical:5,
    borderTopWidth: 1,
    borderTopColor: Colors.violet,
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
export default connect(mapStateToProps)(DetailAdoption);