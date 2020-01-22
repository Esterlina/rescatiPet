import React from 'react';
import { Alert,StyleSheet,YellowBox, ActivityIndicator, Text,View, Dimensions,TouchableOpacity, ScrollView,AsyncStorage,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Header from '../components/Header';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import UserAvatar from 'react-native-user-avatar';
import TagRescued from '../components/TagRescued'
import Helpers from '../../lib/helpers'
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import Modal from "react-native-modal";
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
class DetailStory extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      images_base64:[],
      loading: true,
      modalMatch:false,
      story: (this.props.story == undefined? this.props.navigation.getParam('story') :  story = this.props.story),
      token:'',
    };
}
componentDidMount(){ 
  for (i=0; i < this.state.story.img_num ; i++) {
    try{
      let url = this.state.story.img_dir + 'image_' + i + '.jpg'
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
  const story = this.state.story
  const shareOptions = {
    title: 'Share file',
    message: story.share,
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
    story = this.state.story
    var date_story = Moment(story.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_story == today || date_story ==  yesterday){
      date_create = Moment(story.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_story
    }
    return(
      <View style={{flex:1}}>
          {this.props.story == undefined? <Header {...this.props} stack='true' home='Home'/> :null}
        <ScrollView style={{marginVertical:10}}>
        <View style={[appStyle.containerPublication,{borderColor: Colors.primaryColor}]}>
            <View style={[appStyle.header,{backgroundColor: Colors.primaryColor}]}>
                <Text style={{fontFamily:Fonts.OpenSansBold,color:'white',fontSize:20}}>Historia</Text>
            </View>
          <View style={{paddingHorizontal:8}}>
            <View style={{flexDirection:'row',paddingTop:10,}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {story.usuario.id == this.props.user.id? this.props.navigation.navigate('Perfil'):this.props.navigation.navigate('User', { user_id: story.usuario.id})}}>
              {story.usuario.perfil?
              <UserAvatar size="45" name={story.usuario.nombre} src={story.usuario.perfil}/>
              :
              <UserAvatar size="45" name={story.usuario.nombre} colors={['#0ebda7','#ccc000', '#fafafa', '#ccaabb']}/>
              }
              <View style={{marginHorizontal: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={appStyle.textSemiBold} numberOfLines={1}>
                  {story.usuario.nombre.length < 20
                  ? `${story.usuario.nombre}`
                  : `${story.usuario.nombre.substring(0, 21)}...`}</Text>
                </View>
                <View style={[appStyle.textRegular,{flexDirection:'row'}]}>
                  <Text style={appStyle.textRegular}>{date_create}</Text>
                </View>
              </View>
              </TouchableOpacity>
              <Image
                source={require('../icons/rescue/notepad.png')}
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
              : <ActivityIndicator size="large" color={Colors.primaryColor} />}
            </View>
            <View style={styles.parrafo}>
                <Text style={[appStyle.textSemiBold,{fontSize:18,color: Colors.primaryColor}]}>{story.titulo}</Text> 
                {story.detalles ?  <Text style={[appStyle.textRegular,styles.parrafo]}>{story.detalles}</Text> : null}
                {story.rescatados.length > 0?
                  <TagRescued  rescueds={story.rescatados}
                  navigation={this.props.navigation}/> 
                : null}
            </View>
          </View>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={() => this.share()}>
              <Text style={[appStyle.textSemiBold]}>compartir</Text>
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
    height: 35,
    paddingVertical:5,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryColor,
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
export default connect(mapStateToProps)(DetailStory);