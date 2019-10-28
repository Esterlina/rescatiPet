import { StyleSheet,Dimensions} from 'react-native'
const {height, width} = Dimensions.get('window');
import {Fonts} from '../utils/Fonts';
import {Colors} from './colors'

export default StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
  },
  buttonLarge:{
    marginTop: 10,
    borderRadius: 8,
    backgroundColor : Colors.primaryColor,
    alignItems: "center",
    justifyContent:'center',
    height: 45,
   },
   buttonLargeText:{
    color:'white',
    fontSize:20,
    fontFamily: Fonts.OpenSansBold
  },
  buttonLarge2:{
    marginTop:8,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor : Colors.primaryColor,
    alignItems: "center",
    justifyContent:'center',
    height: 30,
  },
  buttonLargeText2:{
    color:'white',
    fontSize:16,
    fontFamily: Fonts.OpenSansBold
  },
  textRegular:{
    fontSize: 14,
    color: 'gray',
    fontFamily: Fonts.OpenSans
  },
  textSemiBold:{
    fontSize: 14,
    color: 'gray',
    fontFamily: Fonts.OpenSansSemiBold
  },
  textBold:{
    fontSize: 14,
    color: 'gray',
    fontFamily: Fonts.OpenSansBold
  },
  textTag:{
    color:'white',
    fontFamily:Fonts.OpenSansBold,
    fontSize:16,
    textAlign:'center'
  },
  carousel:{
    justifyContent: 'center',
    alignItems:'center',
    marginVertical:10
   },
   textTitle:{
    fontSize: 24,
    color: 'gray',
    fontFamily: Fonts.OpenSansBold
  },

  buttonModal:{
    borderWidth: 1.3,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    margin:10,
    marginBottom:0,
    paddingVertical:5,
    paddingHorizontal:10,
  },
  buttonsModal:{
    backgroundColor:'white',
    width:width*0.35,
    alignItems:'center'
},
TextModalButton:{
    fontSize:18,
    color:'gray',
    fontFamily:Fonts.OpenSans
},
modalContainer:{
    backgroundColor:'white',
    height:height*0.7,
    borderRadius:8,
    paddingVertical:10
},
headerModal:{
    backgroundColor:Colors.primaryColor,
    borderTopEndRadius:8,
    borderTopStartRadius:8,
    height:height*0.06,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10
},
inputArea:{
    borderColor: Colors.lightGray,
    textAlignVertical: "top",
    borderWidth: 1.3,
    maxHeight: 100,
    borderRadius: 8,
    marginVertical:5,
    marginHorizontal:0,
    paddingVertical:1,
    paddingHorizontal:10,
  }
  });