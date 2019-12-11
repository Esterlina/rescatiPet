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
  borderGray:{
    borderWidth:1,borderColor:Colors.gray,borderRadius:8,
    backgroundColor:'white'
  },
  buttonLargeText2:{
    color:'white',
    fontSize:16,
    fontFamily: Fonts.OpenSansBold
  },
  textTitleCalipso:{
    color: Colors.primaryColor,
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
    fontSize: 20,
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
    marginBottom:10,
    position:'absolute',
    top:15,
    alignSelf:'center'
},
header:{
  backgroundColor:Colors.violet,
  borderTopEndRadius:2,
  borderTopStartRadius:2,
  height:height*0.06,
  alignItems:'center',
  justifyContent:'center',
  //marginBottom:0
},
containerPublication:{
  marginHorizontal:5,
  marginBottom:10,
  borderWidth: 1.8,
  borderColor: Colors.violet,
  borderRadius: 4,
},
input:{
  borderWidth: 1.3,
  borderColor: Colors.violet,
  borderRadius: 8,
  marginVertical:10,
  marginHorizontal:0,
  paddingVertical:1,
  paddingHorizontal:10,
  color:'gray'
},
inputRight:{
  width:width*0.65,position: 'absolute', right: 0, alignSelf:'center'
},
inputFilters:{
  height:30,
  width:width*0.45,
  alignSelf:'center',
  borderColor: Colors.primaryColor,
  marginVertical:5
},
pickerFilter:{
  color:'gray',height:28, width:width*0.45, alignSelf:'center'
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
  },
  two:{
    maxHeight:200,
  },
  lineTop:{
    borderTopWidth:1, borderTopColor: Colors.lightGray, marginTop: 10
  },
  lineBottom:{
    borderBottomColor: Colors.lightGray, borderBottomWidth:1
  },
  tagRescued:{
    alignSelf: 'flex-start',
    padding:4,
    borderWidth:1.3,
    borderRadius:8,
    borderColor:Colors.primaryColor,
    marginVertical:4,
    marginHorizontal:2
  },
  pickersInfo:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom:8,
    marginHorizontal:5
  },
  moreInformation:{
    backgroundColor: Colors.primaryColor,
    marginTop:10,
    marginVertical:2,
    padding:2,
    borderRadius:4
  },
  pickerContainer:{
    borderWidth: 1.3,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    width: width*0.42,
  },
  picker:{
    height: 28,
    width: width*0.42,
    color: 'gray',
    },
    buttonMap:{
      width:80,
      alignSelf: 'flex-end',
      borderBottomWidth: 1.3,
      borderColor: Colors.primaryColor,
      marginTop:5,
    },
    mapClose:{
      position: 'absolute',
      margin:15,
      alignSelf: 'flex-start'
    },
  });