import React from 'react';
import { StyleSheet, Text,View, Image, Dimensions,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
const {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';


export default class NoticeFormScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      image: null,
      images: null
    };
}
pickMultiple() {
  ImagePicker.openPicker({
    multiple: true,
    waitAnimationEnd: false,
    includeExif: true,
    forceJpg: true,
  }).then(images => {
    this.setState({
      image: null,
      images: images.map(i => {
        console.log('received image', i);
        return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
      })
    });
  }).catch(e => alert(e));
}
renderImage(image) {
  return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
}
  render(){ 
    
    return(
        <View style={styles.container}>
          <Header {...this.props} stack='true'/> 
          <View style={styles.noticesTitle}>
            <Text style={styles.title}>Publicar Avisos</Text>
            <Text style={styles.text}>{this.props.navigation.getParam('type')}</Text>
          </View>
          <ScrollView>
        {this.state.image ? this.renderImage(this.state.image) : null}
        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderImage(i)}</View>) : null}
</ScrollView>
          <TouchableOpacity style={{backgroundColor:'green',margin:10,padding:10}}
        onPress={this.pickMultiple.bind(this)}>
          <Text style={{color:'#fff'}}>Select Image</Text>
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
    noticesTitle:{
      paddingTop:25,
      paddingBottom:10,
      marginHorizontal:20,
      paddingHorizontal:10,
      alignItems: 'center',
    },
    notices:{
      paddingVertical:10,
      marginHorizontal:20,
      paddingHorizontal:10,
      alignItems: 'center',
      flexDirection: 'row',
      
      //backgroundColor:'red',
      height: height*0.32
    },
    notice:{
      //backgroundColor:'green',
      borderWidth: 1.3,
    borderColor: '#d6d7da',
    borderRadius: 4,
      marginHorizontal:10,
      paddingHorizontal:4,
      paddingVertical:4,
      width: width*0.36,
      height: height*0.28,
      alignItems: 'center',
      justifyContent: 'center'
    },
    noticeIcon:{
      width: 90,
      height: 90
    },
    noticeTitle:{
      fontSize: 16,
      textAlign: 'center',
      marginTop: 6,
      marginBottom:4,
      fontFamily: Fonts.OpenSansBold
    },
    title:{
      fontSize: 24,
      color: 'gray',
      fontFamily: Fonts.OpenSansBold
    },
    text:{
      fontSize: 14,
      color: 'gray',
      fontFamily: Fonts.OpenSans
    }
  });