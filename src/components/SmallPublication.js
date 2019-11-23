import React from 'react';
import { StyleSheet,YellowBox, ActivityIndicator, Text,View, Modal, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Tag from '../components/Tag';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import UserAvatar from 'react-native-user-avatar';
import Helpers from '../../lib/helpers'
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import { Colors } from '../styles/colors';
import appStyle from '../styles/app.style';
const {height, width} = Dimensions.get('window');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class SmallPublication extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
    };
}
componentWillMount(){ 
  publication = this.props.publication  
  for (i=0; i < publication.img_num ; i++) {
    try{
      let url = publication.img_dir + 'image_' + i + '.jpg'
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

openDetail(type){
    if(type == "DonationCampaign"){
        this.props.navigation.navigate('DetailDonationCampaign', { donation_campaign: this.props.publication})
    }
    if(type == "Notice"){
        this.props.navigation.navigate('DetailAdoption', { adoption: this.props.publication})
    }
    if(type == "RequestHome"){
        this.props.navigation.navigate('DetailRequestHome', { request_home: this.props.publication})
    }
  
}

displayTitle(type){
    if(type == "DonationCampaign"){return "Campaña de donación"}
    if(type == "Notice"){return "En adopción"}
    if(type == "RequestHome"){return "Se busca hogar temporal"}
}

displayInfo(type){
  publication = this.props.publication
    if(type == "DonationCampaign"){
        return(
            <Text style={appStyle.textSemiBold}>{this.props.publication.estado}</Text>
        )
    }
    if((type == "Notice" && this.props.publication.estado == 'Abierto') || type == "RequestHome"){
        return(
            <Text style={appStyle.textRegular}>{(publication.comuna + ", " + publication.provincia).length < 24
            ? `${(publication.comuna + ", " + publication.provincia)}`
            : `${(publication.comuna + ", " + publication.provincia).substring(0, 21)}...`}
            </Text>
        )
    }
    if(type == "Notice" && this.props.publication.estado != 'Abierto'){
        return(
            <Text style={[appStyle.textSemiBold,{color: Colors.violet}]}>Adoptado</Text>
        )
    }
}

displayIcon(type){
    if(type == 'DonationCampaign'){
        return(
            <Image
                source={require('../icons/rescue/donation.png')}
                style= {styles.icon}
            />
        )
    }
    if(type == 'RequestHome'){
        return(
            <Image
                source={require('../icons/rescue/house.png')}
                style= {styles.icon}
              />
        )
    }
    if(type == 'Notice'){
        return(
            <Image
                source={require('../icons/rescue/adoption.png')}
                style= {styles.icon}
              />
        )
    }
}
  render(){ 
    const publication = this.props.publication
    Moment.locale('es')
    var date_publication = Moment(publication.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_publication == today || date_publication ==  yesterday){
      date_create = Moment(publication.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_publication
    }
    return(
      <View style={{flex:1}}>
        <View style={appStyle.containerPublication}>
            <View style={appStyle.header}>
                <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>{this.displayTitle(publication.tipo_publicacion)}</Text>
              </View>
            <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10}}>
            {publication.usuario.perfil?
              <UserAvatar size="45" name={publication.usuario.nombre} src={publication.usuario.perfil}/>
              :
              <UserAvatar size="45" name={publication.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {publication.usuario.nombre.length < 20
                  ? `${publication.usuario.nombre}`
                  : `${publication.usuario.nombre.substring(0, 21)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>{date_create} - </Text>
                  {this.displayInfo(publication.tipo_publicacion)}
                </View>
              </View>
              {this.displayIcon(publication.tipo_publicacion)}
            </View>
            <View style={appStyle.carousel}>
              {!this.state.loading ?
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.images}
                renderItem={this._renderItem}
                sliderWidth={width*0.9}
                itemWidth={width*0.9}
              />
              : <ActivityIndicator size="large" color= {Colors.primaryColor} />}
            </View>
            <ScrollView style={{height:height*0.1,marginVertical:2,marginHorizontal:2}}>
              <Text style={[appStyle.textRegular,{textAlign:'justify'}]}>{publication.detalles}</Text>
            </ScrollView>
            </View>
            <TouchableOpacity 
              style={[appStyle.buttonLarge2,{backgroundColor:Colors.violet,marginBottom:10}]}
              onPress={() => {this.openDetail(publication.tipo_publicacion)}}
            >
              <Text style={appStyle.buttonLargeText2}> Ver detalles </Text>
            </TouchableOpacity>  
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    publication:{
      paddingVertical:10,
      paddingTop:4,
      marginHorizontal:10,
      paddingHorizontal:8,
      borderWidth: 1.8,
      borderColor: Colors.primaryColor,
      borderRadius: 4,
      marginVertical:5,
    },
    image:{
      height: height*0.3,
      width:width * 0.9,
    },
    icon:{
        width:35,height:35,right:0,top:10, position:'absolute'
    }
});