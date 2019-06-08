import React from 'react';
import { StyleSheet, Text,View, Image, Dimensions,TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import ImagePicker from 'react-native-image-crop-picker';

const {height, width} = Dimensions.get('window');

export default class Camera extends React.Component {

pickMultiple() {
    ImagePicker.openPicker({
        multiple: true,
        waitAnimationEnd: false,
        includeExif: true,
        forceJpg: true,
        }).then(images => {
          const new_images = images.map(i => {
            console.log('received image', i);
            return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
          })
          this.props.update(new_images);
    }).catch(e => alert("Has salido de la selección de imagen(es). Recuerda subir alguna imagen antes de publicar tu aviso."));
}


pickSingleWithCamera(cropping, mediaType='photo') {
  ImagePicker.openCamera({
    cropping: cropping,
    width: 500,
    height: 500,
    includeExif: true,
    mediaType,
    }).then(image => {
        const new_images = [];
        const image_camera = {uri: image.path, width: image.width, height: image.height, mime: image.mime};
        new_images.push(image_camera);
        this.props.update(new_images);
    }).catch(e => alert("Has salido de la captura de foto. Recuerda subir una/varias foto(s) antes de publicar tu aviso."));
}

cleanArrayImages(item){
  const valueToRemove = item.uri
  const new_images = this.props.images.filter(image => image.uri !== valueToRemove)
  this.props.update(new_images);
}

renderImage(image) {
  return(
    <View style={styles.imageContainer}> 
      <ImageBackground style={{width: 130, height: 130,textAlign: 'right'}} source={image}>
        <TouchableOpacity style={styles.circle}
          onPress={() => {this.cleanArrayImages(image)}}>
           <Icon name="times-circle" size={30} color="white" regular/>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  ) 
}
  render(){    
    return(
      <View style={styles.container}>
        <View style={styles.imagesContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.props.images.length > 0 ? 
              this.props.images.map(i => <View key={i.uri}>{this.renderImage(i)}</View>) :
              <View style={styles.imageDefault}><Icon name="images" size={100} color="white" style={{marginRight:5}} regular/></View>
            } 
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.buttonLitle}
          onPress={this.pickMultiple.bind(this)}>
          <View style={{flexDirection:'row'}}>
            <Icon name="images" size={20} color="gray" style={{marginRight:5}} regular/>
            <Text style={styles.text}>Seleccionar imagen(s) desde galeria</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLitle}
           onPress={() => this.pickSingleWithCamera(false)}>
          <View style={{flexDirection:'row'}}>
            <Icon name="camera-retro" size={20} color="gray" style={{marginRight:5}} regular/>
            <Text style={styles.text}>Tomar foto desde camara</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    text:{
      fontSize: 14,
      color: 'gray',
      fontFamily: Fonts.OpenSans
    },
    imageContainer:{
      justifyContent:'center',
      alignItems:'center',height:130,
      width:130,
      marginHorizontal:5,
    },
    imagesContainer:{
      height:150,
      paddingVertical:10,
      marginHorizontal:10,
      paddingHorizontal:5,
      borderWidth: 1.3,
      borderColor: '#66D2C5',
      borderRadius: 4,
      justifyContent:'center',
      alignItems:'center'
    },
    buttonLitle:{
      borderWidth: 1.3,
      borderColor: '#d6d7da',
      borderRadius: 8,
      margin:10,
      marginBottom:0,
      paddingVertical:5,
      paddingHorizontal:10,
    },
    imageDefault:{
      backgroundColor:'#e9e9e9',
      width:width*0.7,
      justifyContent:'center',
      alignItems:'center'
    },
    circle: {
      marginTop:2,
      marginLeft: 98,
      width: 30,
      height: 30,
      borderRadius: 30/2,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"rgba(52, 52, 52, 0.5)"
    },
  });