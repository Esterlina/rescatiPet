import React from 'react';
import { StyleSheet,YellowBox, Text,View, Image,Dimensions,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Helpers from '../../lib/helpers'
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style';
import Calendar from '../components/Calendar'
const {height, width} = Dimensions.get('window');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class SmallEvent extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      image: ''
    };
}
openDetail(){
  this.props.navigation.navigate('DetailEvent', {event: this.props.event})
}
/*componentWillMount(){ 
  notice = this.props.notice  
    try{
      let url = notice.img_dir + 'image_' + 0 + '.jpg'
      Helpers.getImageUrl(url, (imageUrl)=>{
        this.setState({
          image:imageUrl,
        },()=> console.log(this.state.image))
      })
    }
    catch(error){
      console.log(error)
    }
  
}*/
/*openDetail(){
    this.props.update(false)
    this.props.navigation.navigate('DetailNotice', { notice: this.props.notice, request_sos: this.props.request_sos})
}*/

  render(){ 
    const event = this.props.event
    Moment.locale('es')
    return(
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailEvent', {event: event})}>
        <View style={styles.event}>
          <View style={{flexDirection:'row'}}>
            <Calendar date={event.fecha_inicio} />
            <View style={{width:width-115, paddingHorizontal:5,paddingBottom:5}}>
              <View style={styles.eventTitle}>
                  <Text style={appStyle.textTitleCalipso}>
                    {event.nombre.length < 30
                    ? `${event.nombre}`
                    : `${event.nombre.substring(0, 30)}...`}
                  </Text>
              </View>
              <View style={{flexDirection:'row'}}>
                  <Icon name="clock" size={16} color={Colors.gray} style={{marginRight:4,alignSelf:'center'}} regular/>
                  {event.fecha_inicio == event.fecha_termino? 
                      <Text style={appStyle.textRegular}>Inicio: {event.hora_inicio}, Fin: {event.hora_termino}</Text>
                  :
                  <Text style={[appStyle.textRegular,{flex: 1, flexWrap: 'wrap'}]}>Inicio: {event.hora_inicio}, Fin: {Moment(event.fecha_termino).format('DD/MM/YYYY')} a las {event.hora_termino}</Text>
                  }
              </View>
              <View style={{flexDirection:'row'}}>
                  <Icon name="map-marker-alt" size={16} color={Colors.gray} style={{marginRight:4,alignSelf:'center'}} regular/>
                      <Text style={appStyle.textRegular}>{event.direccion.length < 30
                          ? `${event.direccion}`
                          : `${event.direccion.substring(0, 30)}...`}
                      </Text>
              </View>
            </View>
          </View>    
        </View>
      </TouchableOpacity>     
    );
  }
}

const styles = StyleSheet.create({
    event:{
      borderWidth: 1.8,
      borderColor: Colors.primaryColor,
      borderRadius: 4,
      marginBottom:5,
    },
    eventTitle:{height:30,justifyContent:'center',alignItems:'center'}
    
});