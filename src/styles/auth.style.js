import { StyleSheet,Dimensions} from 'react-native'
const {height, width} = Dimensions.get('window');
import {Fonts} from '../utils/Fonts';
import {Colors} from './colors'

export default StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    //paddingTop: 70
  },
  iconLogin:{
   width: width*0.7,
   height: 45,
   marginTop:10,
   marginBottom: 10,
  },
  formLogin: {
    paddingVertical:20,
  },
  iconLabel:{
    width: 50,
    backgroundColor:Colors.primaryColor,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    alignItems: "center",
    justifyContent:'center',
  },
  labelLogin:{
    width:width*0.8,
    backgroundColor:'#E9FFFC',
    borderRadius:8,
    flexDirection: 'row',
    marginBottom: 10,
  },
  
    text: {
      color: 'white',
      alignSelf: 'center',
      fontSize:26,
      fontFamily: Fonts.OpenSansBold
    },
    input:{
      width:width*0.6,
      height:40,
      fontSize:18,
      marginVertical: 3,
      paddingLeft: 10,
      color:'gray'
    },
    social:{
      backgroundColor:'#3b5998',
      marginTop:30
    },
    backButton:{
        height: 30,
        width: 30, 
        borderRadius:60,  
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center'
      },
    passwordText:{
        color:'white',
        paddingBottom:5,
        alignSelf:'flex-start',
        marginLeft:width*0.1,
        fontFamily: Fonts.OpenSans
    }
  });