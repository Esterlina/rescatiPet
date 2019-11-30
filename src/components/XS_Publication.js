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

export default class XS_Publication extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
    };
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
    if(type == "Story"){
      this.props.navigation.navigate('DetailStory', { story: this.props.publication})
  }
  
}

displayTitle(type){
    if(type == "DonationCampaign"){return "Campaña de donación"}
    if(type == "Notice"){return "En adopción"}
    if(type == "Story"){return this.props.publication.titulo}
    if(type == "RequestHome"){return "Se busca hogar temporal"}
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
    if(type == 'Story'){
      return(
          <Image
              source={require('../icons/rescue/notepad.png')}
              style= {styles.icon}
            />
      )
  }
}
  render(){ 
    const publication = this.props.publication
    const type = publication.tipo_publicacion
    Moment.locale('es')
    var date_create = Moment(publication.hora_creacion).format('dddd D') + " de " + Moment(publication.hora_creacion).format('MMMM') + ", " + Moment(publication.hora_creacion).format('YYYY');
    return(
        <View style={[appStyle.containerPublication,{borderColor:Colors.primaryColor, padding:5,height:height*0.12}]}>
            <View style={{flexDirection:'row'}}>
                <View style={{height:height*0.1,justifyContent:'center'}}>
                    {this.displayIcon(type)}
                </View>
                <View style={{justifyContent:'center'}}>
                    <Text style={[appStyle.textSemiBold,{textAlign:'left',fontSize:16}]}>{this.displayTitle(type)}</Text>
                    <Text style={[appStyle.textRegular],{textAlign:'left'}}>{date_create}</Text>
                </View>
                
            </View>
            <TouchableOpacity style={{position:'absolute',width:40,right:0,height:height*0.1,justifyContent:'center'}} onPress={() =>  this.openDetail(type)}>
                <Icon name="chevron-right" size={25} color={Colors.primaryColor} style={{alignSelf:'center'}}/>
            </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    icon:{
        width:50,height:50,marginRight:10,marginLeft:5
    }
});