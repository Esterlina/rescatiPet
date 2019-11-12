import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native'
import Moment from 'moment';
import 'moment/locale/es'
import appStyle from '../styles/app.style'
import {Colors} from '../styles/colors'
const {width,height} = Dimensions.get('window')
export default class Calendar extends Component{

    constructor(props) {
        super(props);
      }

    render(){
        const date = this.props.date;
        Moment.locale('es')
        const month = Moment(date).format('MMM');
        const day = Moment(date).format('DD');
        return(
            <View style={[styles.calendar,this.props.border? styles.border:styles.borderRight]}>
                <View style={{height:30,width:90,backgroundColor:Colors.primaryColor,justifyContent:'center',position:'absolute',top:0}}>
                    <Text style={[appStyle.buttonLargeText2,{alignSelf:'center',}]}>{month}</Text>
                </View>
                <View style={{width:90,height:50,position:'absolute',bottom:0,alignItems:'center',justifyContent:'center'}}>
                    <Text style={[appStyle.textTitleCalipso,{fontSize:24}]}>{day}</Text>
                </View>
            </View>                               
        )
    }
}

const styles = StyleSheet.create({
    calendar:{
        width:90,
        justifyContent:'center',
        alignItems:'center',
        minHeight:80
      },
      borderRight:{
        borderRightWidth:1.3,borderRightColor: Colors.primaryColor
      },
      border:{
          borderColor: Colors.primaryColor,
          borderWidth:1.3
      }
})

