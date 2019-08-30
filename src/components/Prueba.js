import React from 'react';
import { StyleSheet,YellowBox, ActivityIndicator, Text,View, Modal, Dimensions,TouchableOpacity, ScrollView,TextInput,Picker,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Header from '../components/Header';
import Tag from '../components/Tag';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Avatar } from 'react-native-elements'
import Helpers from '../../lib/helpers'
import _ from 'lodash';

const {height, width} = Dimensions.get('window');



export default class Prueba extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      images: [],
      loading: true,
    };
  }

  render(){ 
    const notice = this.props.navigation.getParam('notice')
    return(
      <View style={styles.container}>
        <Header {...this.props}/>
        <View style={styles.notice}>
         <Text>COMPONENTE PRUEUBA</Text>
         <TouchableOpacity 
              style={styles.button}
              onPress={() => console.log(notice)}
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
      backgroundColor: '#F5FCFF',
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
      marginHorizontal: width*0.04,
      paddingVertical:10,
      marginHorizontal:10,
      paddingHorizontal:8,
      borderWidth: 1.8,
      borderColor: '#66D2C5',
      borderRadius: 4,
      justifyContent:'center',
      alignItems:'center'
    },
    image:{
      height: height*0.4,
      width:width * 0.9,
    },
    carousel:{
     justifyContent: 'center',
     alignItems:'center',
     marginVertical:10
    }
});