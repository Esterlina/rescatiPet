import React from 'react';
import { StyleSheet,YellowBox, ActivityIndicator, Text,View, Modal, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Header from '../components/Header';
import Tag from '../components/Tag';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Avatar } from 'react-native-elements'
import Helpers from '../../lib/helpers'
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
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

export default class DetailNotice extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      images_base64:[],
      loading: true,
    };
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

urlToBase64(url) { 
  return new Promise(resolve => {
    console.log("ESTOY DENTRO DEL AWAIT")
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
    return(
      <View style={styles.container}>
        <Header {...this.props}/>
        <ScrollView>
        <View style={styles.notice}>
          <View style={{paddingHorizontal:8}}>
          <View style={{flexDirection:'row',paddingTop:10,}}>
            <Avatar
            size={40}
                rounded
                icon={{name: 'user', type: 'font-awesome'}}
                containerStyle={{ borderWidth: 1,borderColor: '#66D2C5'}}
            />
            <View style={{marginHorizontal: 10}}>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.semiBold} numberOfLines={1}>
                {notice.usuario.length < 20
                ? `${notice.usuario}`
                : `${notice.usuario.substring(0, 21)}...`}</Text>
              </View>
              <View style={[styles.text,{flexDirection:'row'}]}>
                <Text>Hace 2h - </Text>
                {notice.estado == 'Abierto' ?
                <Text style={[styles.semiBold,{color:'#19c9d4'}]}>Caso abierto</Text>:
                <Text style={[styles.semiBold,{color:'red'}]}>Caso cerrado</Text>
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
            : <ActivityIndicator size="large" color="#66D2C5" />}
          </View>
          <View style={{flexDirection:'row'}}>
            <Icon name="map-marker-alt" size={20} color='gray' style={{marginRight:4}} regular/>
                <Text numberOfLines={1}>{notice.dir.length < 45
                ? `${notice.dir}`
                : `${notice.dir.substring(0, 45)}...`}</Text>
          </View>
          {notice.detalles ?  <Text style={[styles.text,styles.parrafo]}>{notice.detalles}</Text> : null}
          <View style={[styles.parrafo]}>
            {notice.visto? <Text>Visto durante el {Moment().format('YYYY') == Moment(notice.visto).format('YYYY')? <Text style={styles.semiBold}>{Moment(notice.visto).format('dddd D MMMM')}</Text>: <Text style={styles.semiBold}>{Moment(notice.visto).format('dddd D MMMM YYYY')}</Text>} cerca de las <Text style={styles.semiBold}>{Moment(notice.visto).format('HH:MM')}</Text> hrs. </Text> : null}
            {notice.visto?<Text>Por <Text style={styles.semiBold}>{notice.direccion} </Text></Text>  : null} 
          </View>
          <View style={styles.parrafo}>
            <Text style={[styles.semiBold,{fontSize:16,color:'#19c9d4'}]}>Características</Text> 
            <View style={styles.parrafo}>
              
              <View style={{flexDirection:'row'}}>
                <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                <Text style={styles.semiBold}>{notice.animal}</Text>
                {notice.raza? <Text> {notice.raza}</Text> : null }
              </View>
              {notice.nombre?
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                  <Text style={styles.semiBold}>Nombre: </Text>
                  <Text>{notice.nombre}</Text>               
                </View>
              :null}
              <View style={{flexDirection:'row'}}>
                <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                <Text style={styles.semiBold}>Sexo: {notice.sexo}</Text>
                {notice.edad? <Text>, {notice.edad}</Text> : null }
              </View>
              {notice.tamaño?
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                  <Text style={styles.semiBold}>Tamaño: </Text>
                  <Text>{notice.tamaño}</Text>               
                </View>
              :null}
              {notice.colores?
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                  <Text style={styles.semiBold}>Colores: </Text>
                  <Text>{notice.colores}</Text>               
                </View>
              :null}
              {notice.collar || notice.ropa || notice.microship?
                <View style={{flexDirection:'row'}}>
                  <Icon name="paw" size={16} color='#19c9d4' style={{marginRight:4}} regular/>
                  {notice.collar || notice.ropa? <Text>Lleva puesto </Text>: <Text>Tiene microship </Text> }
                  {notice.collar? <Text>Collar</Text> : null}
                  {notice.ropa? <Text> Ropa/chaleco</Text> : null}             
                </View>
              :null}
              {notice.emergencia?
                <View style={{flexDirection:'row'}}>
                  <Icon name="first-aid" size={16} color='#ee1212' style={{marginRight:4}} regular/>
                  <Text>Encontrado/a en situacion de</Text>   
                  <Text style={styles.semiBold}>{notice.emergencia}</Text>             
                </View>
              :null}
              {notice.solicitud?
                <View style={{flexDirection:'row'}}>
                  <Icon name="first-aid" size={16} color='#ee1212' style={{marginRight:4}} regular/> 
                  <Text style={[styles.semiBold,{color:'#ee1212'}]}> Se solicita colaboradores urgente</Text>             
                </View>
              :null}
            </View> 
          </View>
          </View>
          <View style={styles.socialButtons}>

            <TouchableOpacity 
            style={styles.socialButton}
              onPress={() =>console.log("holita")}
            >
              <Icon name="arrow-alt-circle-right" size={18} color='#929292' regular/> 
              <Text style={{color:'#929292'}}>seguir</Text>
            </TouchableOpacity>      
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="comments" size={18} color='#929292' regular/> 
              <Text style={{color:'#929292'}}>comentar</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="hands-helping" size={18} color='#929292' regular/> 
              <Text style={{color:'#929292'}}>match</Text>
            </TouchableOpacity> 
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
    notice:{
      paddingTop:10,
      marginHorizontal:5,
      marginBottom:10,
      borderWidth: 1.8,
      borderColor: '#66D2C5',
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
    borderTopColor:'#66D2C5',
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