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
import Match from '../components/MatchDonation'
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
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
class DetailDonationCampaign extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      images_base64:[],
      loading: true,
      modalMatch:false,
      donation_campaign: (this.props.donation_campaign == undefined? this.props.navigation.getParam('donation_campaign') :  donation_campaign = this.props.donation_campaign),
      token:'',
    };
}
componentDidMount(){ 
  for (i=0; i < this.state.donation_campaign.img_num ; i++) {
    try{
      let url = this.state.donation_campaign.img_dir + 'image_' + i + '.jpg'
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
  const donation_campaign = this.state.donation_campaign
  const shareOptions = {
    title: 'Share file',
    message: donation_campaign.share,
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
    donation_campaign = this.state.donation_campaign
    donadores = donation_campaign.donacion.donadores
    var date_donation_campaign = Moment(donation_campaign.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_donation_campaign == today || date_donation_campaign ==  yesterday){
      date_create = Moment(donation_campaign.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_donation_campaign
    }
    return(
      <View style={styles.container}>
          {this.props.donation_campaign == undefined? <Header {...this.props} stack='true' home='Home'/> :null}
        <ScrollView style={{marginVertical:10}}>
        <Modal isVisible={this.state.modalMatch} style={{margin:20}}>
          <Match update = {this.updateModalMatch.bind(this)} campaign = {donation_campaign}/>
        </Modal>
        <View style={appStyle.containerPublication}>
            <View style={appStyle.header}>
                <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Campaña de donación</Text>
            </View>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
              {donation_campaign.usuario.perfil?
              <UserAvatar size="45" name={donation_campaign.usuario.nombre} src={donation_campaign.usuario.perfil}/>
              :
              <UserAvatar size="45" name={donation_campaign.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {donation_campaign.usuario.nombre.length < 20
                  ? `${donation_campaign.usuario.nombre}`
                  : `${donation_campaign.usuario.nombre.substring(0, 21)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>{date_create} - <Text style={appStyle.textSemiBold}>{donation_campaign.estado}</Text></Text>
                </View>
              </View>
              <Image
                source={require('../icons/rescue/donation.png')}
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
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet}]}>Detalles</Text> 
                {donation_campaign.detalles ?  <Text style={[appStyle.textRegular,styles.parrafo]}>{donation_campaign.detalles}</Text> : null}
                <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet}]}>Meta donación</Text> 
                {donation_campaign.donation_items.length > 0 ?
                donation_campaign.donation_items.map((donation_item,index) => {
                    return(
                    <View key={index} style={{flexDirection:'row',marginVertical:2}}>
                        <Icon name="paw" size={16} color={Colors.violet} style={{marginRight:10}} regular/>
                        <Text style={appStyle.textSemiBold}>{donation_item.cantidad == 0 ? donation_item.item : (donation_item.cantidad + " " + donation_item.item)}</Text>
                    </View>
                    )
                })
                :null}
                {donadores.length > 0? 
                <View>
                  <Text style={[appStyle.textSemiBold,{fontSize:16,color: Colors.violet}]}>Donaciones</Text> 
                  {donadores.length == 1?
                  <Text style={appStyle.textRegular}>{donadores.find(donador => donador.user_id == this.props.user.id) != undefined ? "Tú haz donado" : (donation_campaign.donacion.donadores_externos? "Externo(s) han donado: " : "1 Usuario ha donado:")}</Text>
                  : <Text style={appStyle.textRegular}>{donadores.find(donador => donador.user_id == this.props.user.id) != undefined ? ("Tú y " + (donadores.length-1).toString() + (donadores.length-1 == 1? " Usuario":" Usuarios") ): donadores.length + " Usuarios"} {donation_campaign.donacion.donadores_externos? "y Persona(s) Externa(s)": ""} han donado: </Text>
                  }
                  {donation_campaign.donacion.donaciones_totales.map((donacion,i) => {
                    if(donacion.total_donado > 0){
                      var item = donation_campaign.donation_items.find(item => item.item == donacion.item)
                      return(
                        <Text key={i} style={[appStyle.textRegular,{flex:1,flexWrap:'wrap'}]}> - {item.cantidad != 0 ? donacion.total_donado + " " : ""} {donacion.item}</Text>
                      )
                    }
                  })}
                  </View>
                :null}
            </View>
          </View>
          <View style={styles.socialButtons}>
            {this.props.user.id != donation_campaign.usuario.id?
              <TouchableOpacity style={styles.socialButton} onPress={() => this.setState({modalMatch:true})}>
                <Icon name="hands-helping" size={18} color='#929292' regular/> 
                <Text style={{color:'#929292'}}>¡He donado!</Text>
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
export default connect(mapStateToProps)(DetailDonationCampaign);