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
const {height, width} = Dimensions.get('window');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class Notice extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
    };
}
componentWillMount(){ 
  notice = this.props.dataJson  
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
  this.props.navigation.navigate('DetailNotice', { notice: this.props.dataJson})
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
    const notice = this.props.dataJson
    Moment.locale('es')
    const data_create = Moment(notice.hora_creacion || Moment.now()).fromNow();
    return(
      <View style={styles.container}>
        <View style={styles.notice}>
            <View style={{flexDirection:'row',paddingTop:10}}>
              <UserAvatar size="40" name={notice.usuario.nombre} colors={['#ccc', '#fafafa', '#ccaabb']}/>
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                <Text style={styles.semiBold} numberOfLines={1}>
                {notice.usuario.nombre.length < 20
                ? `${notice.usuario.nombre}`
                : `${notice.usuario.nombre.substring(0, 21)}...`}</Text>

                </View>
                <View style={[styles.text,{flexDirection:'row'}]}>
                  <Text>{data_create} - </Text>
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
                sliderWidth={width*0.9}
                itemWidth={width*0.9}
              />
              : <ActivityIndicator size="large" color="#66D2C5" />}
            </View>
            <View style={{flexDirection:'row'}}>
            <Icon name="map-marker-alt" size={20} color='gray' style={{marginRight:4}} regular/>
                <Text style={styles.semiBold} numberOfLines={1}>{notice.dir.length < 45
                ? `${notice.dir}`
                : `${notice.dir.substring(0, 45)}...`}</Text>
            </View>
            <ScrollView style={{height:height*0.1,marginVertical:2,marginHorizontal:2}}>
              <Text style={[styles.text,{textAlign:'justify'}]}>{notice.detalles}</Text>
            </ScrollView>
            <TouchableOpacity 
              style={styles.button}
              onPress={() =>this.openDetail()}
            >
              <Text style={styles.buttonText}> Ver detalles </Text>
            </TouchableOpacity>  
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
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
      paddingVertical:10,
      paddingTop:4,
      marginHorizontal:10,
      paddingHorizontal:8,
      borderWidth: 1.8,
      borderColor: '#66D2C5',
      borderRadius: 4,
      marginVertical:5,
    },
    image:{
      height: height*0.3,
      width:width * 0.9,
    },
    carousel:{
     justifyContent: 'center',
     alignItems:'center',
     marginVertical:10
    },
    button:{
      marginTop:8,
      marginHorizontal: 5,
      borderRadius: 8,
      backgroundColor :'#66D2C5',
      alignItems: "center",
      justifyContent:'center',
      height: 30,
    },
    buttonText:{
      color:'white',
      fontSize:16,
      fontFamily: Fonts.OpenSansBold
    }
});