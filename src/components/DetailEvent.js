import React from 'react';
import { StyleSheet,YellowBox, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../components/Header';
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import {connect} from 'react-redux';
import Helpers from '../../lib/helpers'
import Calendar from '../components/Calendar'

const {height, width} = Dimensions.get('window');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class DetailEvent extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      image: '',
      loading: true,
    };
}

componentDidMount(){ 
    const event = this.props.navigation.getParam('event')
    try{
      let url = event.image + '.jpg'
      Helpers.getImageUrl(url, (imageUrl)=>{
        this.setState({
          image: imageUrl,
          loading: false
        },()=> console.log("PUDE OBTENER LA IMAGEN " + this.state.image))
      })
    }
    catch(error){
      console.log(error)
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


  render(){ 
    Moment.locale('es')
    console.log(this.props.navigation.getParam('event'))
    const event = this.props.navigation.getParam('event')
    const start_date = Moment(event.fecha_inicio).format('dddd D MMMM')
    return(
      <View style={styles.container}>
        <Header {...this.props} stack='true'/>
        <ScrollView>
        <View style={[appStyle.containerPublication,{borderColor: Colors.primaryColor}]}>
            <View style={styles.image}>
                {this.state.loading?
                <ActivityIndicator size="large" color= {Colors.primaryColor} />
                :
                <Image
                    source={{uri: this.state.image}}
                    style= {{width:width - 15, height: height*0.3}}
                />
                }
            </View>
          <View style={{padding:10}}>
            <View style={{paddingVertical:10, flexDirection:'row'}}>
                <Calendar date={event.fecha_inicio} border={true} />
                <View style={{paddingHorizontal:10, alignItems:'center',flex: 1, flexWrap: 'wrap'}}>
                <Text style={[appStyle.textTitleCalipso,{fontSize: event.nombre.length > 22? 18 :20}]}>{event.nombre}</Text>
                    <Text style={[appStyle.textSemiBold,{fontSize: event.nombre.length > 22? 16 :18}]}>Organizado por {event.usuario.nombre}</Text>  
                </View>
            </View>
            <View style={{paddingVertical:10}}>
                <View style={{flexDirection:'row',paddingBottom:4}}>
                    <Icon name="clock" size={20} color={Colors.gray} style={{marginRight:4,alignSelf:'center'}} regular/>
                    {event.fecha_inicio == event.fecha_termino? 
                        <Text style={[appStyle.textRegular,{flex: 1, flexWrap: 'wrap'}]}>{start_date.charAt(0).toUpperCase() + start_date.slice(1)}, {Moment(event.fecha_inicio).format('YYYY')} de {event.hora_inicio} a {event.hora_termino}</Text>
                    :
                    event.fecha_termino?
                    <Text style={[appStyle.textRegular,{flex: 1, flexWrap: 'wrap'}]}>{start_date.charAt(0).toUpperCase() + start_date.slice(1)}, {Moment(event.fecha_inicio).format('YYYY')} a las {event.hora_inicio}, hasta el {Moment(event.fecha_termino).format('dddd D MMMM')} a las {event.hora_termino} hrs.</Text>
                    : 
                    <Text style={[appStyle.textRegular,{flex: 1, flexWrap: 'wrap'}]}>{start_date.charAt(0).toUpperCase() + start_date.slice(1)}, {Moment(event.fecha_inicio).format('YYYY')} a las {event.hora_inicio} hrs. </Text>
                    }
                </View>
                <View style={{flexDirection:'row'}}>
                    <Icon name="map-marker-alt" size={20} color={Colors.gray} style={{marginRight:4,alignSelf:'center'}} regular/>
                    <Text style={[appStyle.textRegular,{flex: 1, flexWrap: 'wrap'}]}>{event.dir}.</Text>
                </View>
            </View>
            <View style={{paddingRight:10}}>
                <Text style={appStyle.textTitleCalipso}>Detalles del evento</Text>
                <Text style={[appStyle.textRegular,{textAlign:'justify'}]}>{event.detalles}</Text>
            </View>
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
    image:{
      height: height*0.3,
      justifyContent:'center',
      alignItems:'center',
    },
  
});

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};
export default connect(mapStateToProps)(DetailEvent);