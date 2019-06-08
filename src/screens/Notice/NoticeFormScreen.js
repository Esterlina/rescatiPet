import React from 'react';
import { StyleSheet, Text,View, Modal, Dimensions,TouchableOpacity, ScrollView,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../utils/Fonts';
import Header from '../../components/Header';
import Map from '../../components/Map';
import Camera from '../../components/Camera';
const {height, width} = Dimensions.get('window');
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {API_KEY} from '../../keys';
export default class NoticeFormScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      map: false,
      marker: { latitude: -33.499301, longitude: -70.586420},
      address:'',
    };
}
updateImages(images){
  this.setState({images:images})
}
updateLocation(marker,address){
  this.setState({marker:marker,address:address,map:false}, () =>{this.locationRef.setAddressText(this.state.address);})
}
  render(){ 
    return(
      <ScrollView style={styles.container}>
        <Modal visible={this.state.map}
            onRequestClose={()=>console.log("cerrando")}> 
            <Map marker={this.state.marker} update = {this.updateLocation.bind(this)}/> 
            <View style={styles.mapClose}>
              <TouchableOpacity style={[styles.buttonLitle,{backgroundColor:'white'}]}
                onPress={() => this.setState({map:false})}>
                <View style={{flexDirection:'row'}}>
                  <Icon name="arrow-left" size={14} color='gray' style={{marginRight:5,marginTop:3}} regular/>
                  <Text style={[styles.text,styles.textMap]}>Volver</Text>
                </View>
              </TouchableOpacity>
            </View>
        </Modal>
        <Header {...this.props} stack='true'/> 
        <Camera update = {this.updateImages.bind(this)} images = {this.state.images} />
        <GooglePlacesAutocomplete
                ref={(instance) => { this.locationRef = instance }}
            query={{ key: API_KEY,language: 'es',components: 'country:cl'}}
            placeholder='Ingresa una dirección'
            minLength={2} 
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            listViewDisplayed={false}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.setState({marker:
            {latitude:details.geometry.location.lat,longitude: details.geometry.location.lng},
            address: details.formatted_address});
            //alert(this.state.address);
          }}
            styles={{
              textInputContainer: {
                backgroundColor: '#F5FCFF',
                borderTopWidth: 0,
                borderBottomWidth:0
              },
              textInput: {
                backgroundColor:'#F5FCFF',
                borderWidth: 1.3,
                borderColor: '#d6d7da',
                borderRadius: 8,
                margin:10,
                marginBottom:0,
                paddingVertical:5,
                paddingHorizontal:10,
                height: 38,
                color: 'gray',
                fontSize: 14,
                fontFamily: Fonts.OpenSans
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
            }}

          />
          <TouchableOpacity style={styles.buttonMap}
            onPress={() => this.setState({map:true})}>
            <View style={{flexDirection:'row'}}>
              <Icon name="map-marker-alt" size={14} color='#66D2C5' style={{marginRight:5}} regular/>
              <Text style={[styles.text,{color: '#66D2C5'}]}>Ver mapa</Text>
            </View>
          </TouchableOpacity>
      </ScrollView>
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
    buttonMap:{
      width:80,
      alignSelf: 'flex-end',
      borderBottomWidth: 1.3,
      borderColor: '#66D2C5',
      margin:10,
      marginTop:5,
      marginBottom:10,
      paddingVertical:0,
      paddingHorizontal:2,
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
    mapClose:{
      position: 'absolute',
      margin:5,
      alignSelf: 'flex-start'
    },
    textMap:{
      fontSize:16,
    }
  });