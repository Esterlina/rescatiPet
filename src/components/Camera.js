import React from 'react';
import { StyleSheet, Text,View, Image, Dimensions,TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
import UserAvatar from 'react-native-user-avatar';
const {height, width} = Dimensions.get('window');

export default class Camera extends React.Component {
  pickSingle() {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      //cropping: cropit,
      cropperCircleOverlay: true,
     // includeExif: true,
    }).then(image => {
      console.log('received image', image);
        new_image = {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        console.log([new_image])
        this.props.update([new_image]);
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }
pickMultiple() {
    ImagePicker.openPicker({
        multiple: true,
        compressImageMaxWidth:580,
        compressImageMaxHeight:760,
        }).then(images => {
          const new_images = images.map(image => {
            console.log(image.width)
            console.log(image.height)
            console.log("IMPRIMRE LOS PATH")
            console.log(image.path)
            console.log(image.path.toString())
            console.log(image.mime)
            return {uri:image.path, width: image.width, height: image.height, mime: image.mime};
          })
          this.props.update(new_images);
    }).catch(e => alert("Has salido de la selección de imagen(es). Recuerda subir alguna imagen antes de publicar tu aviso."));
}


pickSingleWithCamera(cropping, mediaType='photo') {
  ImagePicker.openCamera({
    cropping: cropping,
    width: 350,
    height: 400,
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
  if(this.props.type == "Evento"){
    return(
      <View style={[styles.imageContainer,{width:width*0.7}]}> 
      <ImageBackground style={{width: width*0.7, height: 130,textAlign: 'right'}} source={image}>
        <TouchableOpacity style={styles.circle}
          onPress={() => {this.cleanArrayImages(image)}}>
           <Icon name="times-circle" size={30} color="white" regular/>
        </TouchableOpacity>
      </ImageBackground>
    </View>
    )
  }
  else{
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
}
  render(){    
    return(
      <View style={styles.container}>
        {this.props.type != 'Perfil'? 
        <View style={styles.imagesContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.props.images.length > 0 ? 
              this.props.images.map(i => <View key={i.uri}>{this.renderImage(i)}</View>) :
              <View style={styles.imageDefault}><Icon name="images" size={100} color="white" style={{marginRight:5}} regular/></View>
            } 
          </ScrollView>
        </View>
        :
        <View style={[styles.imagesContainer, {borderWidth:0}]}>
            {this.props.images.length > 0 ? 
              this.props.images.map(i => <View key={i.uri}><UserAvatar size={this.props.size != undefined? size: width*0.4} name={'image'} src={i.uri}/></View>)
              :
              <View style={[styles.imageDefault,{width: this.props.size != undefined? size: width*0.4,height: this.props.size != undefined? size: width*0.4,borderRadius: this.props.size != undefined? (size)/2 : ((width*0.4)/2)}]}>
                <Icon name="images" size={80} color="white" style={{marginRight:5}} regular/>
              </View>
            } 
        </View>
        }
        <View>
        {this.props.images.length > 0 ? 
          null:
          this.props.type == "Adopcion" ? 
            <View>
              <TouchableOpacity style={[appStyle.buttonLarge2,{marginHorizontal:10, backgroundColor:Colors.violet}]} onPress={this.pickMultiple.bind(this)}>
                <Text style={appStyle.buttonLargeText2}>Seleccionar imagen(es)</Text>
              </TouchableOpacity>
            </View>
          :
          this.props.type == "Evento" || this.props.type == "Perfil"?
          <View>
              <TouchableOpacity style={[appStyle.buttonLarge2,{marginHorizontal:10}]} onPress={this.pickSingle.bind(this)}>
                <Text style={appStyle.buttonLargeText2}>Seleccionar imagen</Text>
              </TouchableOpacity>
            </View>
          :  
          <View>
          <TouchableOpacity style={styles.buttonLitle}
            onPress={this.pickMultiple.bind(this)}>
            <View style={{flexDirection:'row'}}>
              <Icon name="images" size={20} color="gray" style={{marginRight:5}} regular/>
              <Text style={appStyle.textRegular}>Seleccionar imagen(s) desde galeria</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLitle}
            onPress={() => this.pickSingleWithCamera(false)}>
            <View style={{flexDirection:'row'}}>
              <Icon name="camera-retro" size={20} color="gray" style={{marginRight:5}} regular/>
              <Text style={appStyle.textRegular}>Tomar foto desde camara</Text>
            </View>
          </TouchableOpacity>
        </View>  
        }
      </View>      
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop:10,
    },
    imageContainer:{
      justifyContent:'center',
      alignItems:'center',
      height:130,
      width:130,
      marginHorizontal:5,
    },
    imagesContainer:{
      height:150,
      paddingVertical:10,
      marginHorizontal:10,
      paddingHorizontal:5,
      borderWidth: 1.3,
      borderColor: Colors.lightGray,
      borderRadius: 4,
      justifyContent:'center',
      alignItems:'center'
    },
    buttonLitle:{
      borderWidth: 1.3,
      borderColor: Colors.lightGray,
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
     position:'absolute',
      right:2,
      top:2,
      width: 30,
      height: 30,
      borderRadius: 30/2,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"rgba(52, 52, 52, 0.5)"
    },
  });