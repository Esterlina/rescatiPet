import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import MapView from 'react-native-maps';
import {Fonts} from '../utils/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome5';
const {width,height} = Dimensions.get('window');
import Geocoder from 'react-native-geocoding';
import {API_KEY} from '../keys';
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style';

export default class Map extends Component{
    constructor(props) {
        super(props);
        this.state = {
          marker: { latitude: -33.499301, longitude: -70.586420},
          address:''
        };
      }
    componentDidMount(){
        this.setState({marker:this.props.marker})
    }
    userLocation() {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            this.setState({marker:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            }});
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }
    addMarker(coordinates) {
        this.setState({
          marker: { latitude: coordinates.latitude, longitude: coordinates.longitude }
        });
    }
     getAddress(lat,lng){
    Geocoder.setApiKey(API_KEY);
    Geocoder.getFromLatLng(lat, lng)
		.then(json => {
            var address_format = json.results[0].formatted_address;
            var address_component = json.results[0].address_components;
            var address_name = address_component[1].short_name + ' ' + address_component[0].short_name + ", " + address_component[3].long_name + ', ' + address_component[5].long_name;
            this.setState({address: address_name});  
            marker = this.state.marker
            address = this.state.address
            this.props.update(marker,address);    
            console.log("IMPRIMIRE LA RESPUESTA JSON************************");
            console.log(json);
            console.log("TERMINE DE IMPRIMIR LA RESPUESTA JSON************************");
		})
		.catch(error => console.warn(error));
  }

  saveLocation(){
      this.getAddress(this.state.marker.latitude,this.state.marker.longitude)
  }
    render(){
        return(
            <View style={{flex:1}}>
                <MapView
                    style = {styles.map}
                    initialRegion={{
                    latitude: -33.499301,
                    longitude: -70.586420,
                    latitudeDelta: 0.0600,
                    longitudeDelta: 0.0600,
                    }}
                    onPress={event => this.addMarker(event.nativeEvent.coordinate)}
                >
                <MapView.Marker
                    coordinate={{ latitude:this.state.marker.latitude, longitude: this.state.marker.longitude }}
                />
                </MapView>
                <View style={{ position: 'absolute', bottom: height*0.07,left:width*0.20 }}>
                    <TouchableOpacity style={styles.buttonMap}
                    onPress={() => this.userLocation()}>
                    <View style={{flexDirection:'row'}}>
                    <Icon name="street-view" size={20} color='gray' style={{marginRight:8}} regular/>
                    <Text style={appStyle.textRegular}>UBICACIÓN ACTUAL</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonMap,{backgroundColor:"#4db74e"}]}
                    onPress={() => this.saveLocation()}>
                    <View style={{flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                    <Icon name="check-square" size={20} color='white' style={{marginRight:8}} regular/>
                    <Text style={[appStyle.textRegular,{color:'white'}]}>LISTO</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    map:{
        width:width,
        height: height,
        paddingHorizontal:5,
    },
    buttonMap:{
        backgroundColor:"white",
        borderWidth: 1.3,
        borderColor: Colors.lightGray,
        borderRadius: 10,
        margin:5,
        marginBottom:0,
        paddingVertical:8,
        paddingHorizontal:20,
    },
});

