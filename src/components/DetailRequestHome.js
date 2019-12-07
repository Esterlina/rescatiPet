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
class DetailRequestHome extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      images_base64:[],
      loading: true,
      modalMatch:false,
      request_home: (this.props.request_home == undefined? this.props.navigation.getParam('request_home') :  request_home = this.props.request_home),
      token:'',
    };
}
componentDidMount(){ 
  for (i=0; i < this.state.request_home.img_num ; i++) {
    try{
      let url = this.state.request_home.img_dir + 'image_' + i + '.jpg'
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
  const request_home = this.state.request_home
  const shareOptions = {
    title: 'Share file',
    message: request_home.share,
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
    request_home = this.state.request_home
    var date_request_home = Moment(request_home.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_request_home == today || date_request_home ==  yesterday){
      date_create = Moment(request_home.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_request_home
    }
    return(
      <View style={styles.container}>
          {this.props.request_home == undefined? <Header {...this.props} stack='true' home='Home'/> :null}
        <ScrollView style={{marginVertical:10}}>
        <Modal isVisible={this.state.modalMatch} style={{margin:20}}>
          <Match update = {this.updateModalMatch.bind(this)} notice = {request_home}/>
        </Modal>
        <View style={appStyle.containerPublication}>
            <View style={appStyle.header}>
                <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Se busca Hogar temporal</Text>
            </View>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
            <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {request_home.usuario.id == this.props.user.id? this.props.navigation.navigate('Perfil'):this.props.navigation.navigate('User', { user_id: request_home.usuario.id})}}>
              {request_home.usuario.perfil?
              <UserAvatar size="45" name={request_home.usuario.nombre} src={request_home.usuario.perfil}/>
              :
              <UserAvatar size="45" name={request_home.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {request_home.usuario.nombre.length < 20
                  ? `${request_home.usuario.nombre}`
                  : `${request_home.usuario.nombre.substring(0, 21)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>{date_create} </Text>
                </View>
              </View>
              </TouchableOpacity>
              <Image
                source={require('../icons/rescue/house.png')}
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
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet}]}>Características</Text> 
                <View style={{flexDirection:'row',marginVertical:2}}>
                  <Icon name="paw" size={16} color={Colors.violet} style={{marginRight:10}} regular/>
                  <Text style={appStyle.textRegular}>Se busca hogar temporal para {request_home.tipo_rescatado}</Text>
                </View>
                <View style={{flexDirection:'row',marginVertical:2}}>
                  <Image
                  source={require('../icons/rescue/house.png')}
                  style= {{width:20,height:20,marginRight:6}}
                  />
                <Text style={[appStyle.textRegular,{flex:1,flexWrap:'wrap'}]}>Idealmente {request_home.tipo_hogar} por o cerca de la comuna {request_home.comuna} ({request_home.provincia}, Region {request_home.region}).</Text>
                </View>
                <View style={{flexDirection:'row',marginVertical:2}}>
                  <Icon name="clock" size={16} color={Colors.violet} style={{marginRight:10}} regular/>
                  <Text style={appStyle.textRegular}>{request_home.tiempo == "Indefinido"? "Por tiempo indefinido": ("Durante " + request_home.tiempo + " Aproximadamente.")}</Text>
                </View>
                {request_home.detalles ?  <Text style={[appStyle.textRegular,styles.parrafo]}>{request_home.detalles}</Text> : null}
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet,marginVertical:5}]}>Contacto</Text> 
                <View style={{flexDirection:'row',marginVertical:2}}>
                    <Icon name="envelope" size={18} color={Colors.gray} style={{marginRight:8}} regular/>
                    <Text style={appStyle.textRegular}>{request_home.usuario.correo}</Text>
                </View>
            </View>
          </View>
          <View style={styles.socialButtons}>
            {this.props.user.id != request_home.usuario.id?
              <TouchableOpacity style={styles.socialButton} onPress={() => this.setState({modalMatch:true})}>
                <Icon name="hands-helping" size={18} color='#929292' regular/> 
                <Text style={{color:'#929292'}}>Match</Text>
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
export default connect(mapStateToProps)(DetailRequestHome);