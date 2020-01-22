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
import {connect} from 'react-redux'

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class Notice extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
    };
}
componentWillMount(){ 
  notice = this.props.notice 
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
openDetail(){
  this.props.navigation.navigate('DetailNotice', { notice: this.props.notice})
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
    const notice = this.props.notice
    Moment.locale('es')
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
      <View style={{flex:1}}>
        <View style={styles.notice}>
            <TouchableOpacity style={{flexDirection:'row',paddingTop:10}} onPress={() => {notice.usuario.id == this.props.user.id? this.props.navigation.navigate('Perfil'):this.props.navigation.navigate('User', { user_id: notice.usuario.id})}}>
              {notice.usuario.perfil?
              <UserAvatar size="40" name={notice.usuario.nombre} src={notice.usuario.perfil}/>
              :
              <UserAvatar size="40" name={notice.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }

              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                <Text style={appStyle.textSemiBold} numberOfLines={1}>
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
            </TouchableOpacity>
            
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
            <View style={{flexDirection:'row'}}>
            <Icon name="map-marker-alt" size={20} color='gray' style={{marginRight:4}} regular/>
                <Text style={appStyle.textSemiBold} numberOfLines={1}>{notice.dir.length < 40
                ? `${notice.dir}`
                : `${notice.dir.substring(0, 40)}...`}</Text>
            </View>
            <ScrollView style={{height:height*0.1,marginVertical:2,marginHorizontal:2}}>
              <Text style={[appStyle.textRegular,{textAlign:'justify'}]}>{notice.detalles}</Text>
            </ScrollView>
            <TouchableOpacity 
              style={appStyle.buttonLarge2}
              onPress={() =>this.openDetail()}
            >
              <Text style={appStyle.buttonLargeText2}> Ver detalles </Text>
            </TouchableOpacity>  
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    notice:{
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
});

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
}

export default connect(mapStateToProps)(Notice);