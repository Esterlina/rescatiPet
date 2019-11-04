import React from 'react';
import { StyleSheet,YellowBox, Text,View, Image,Dimensions,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../utils/Fonts';
import Helpers from '../../lib/helpers'
import _ from 'lodash';
import Moment from 'moment';
import 'moment/locale/es'
import {Colors} from '../styles/colors'
import appStyle from '../styles/app.style'
const {height, width} = Dimensions.get('window');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class SmallNotice extends React.Component {
  constructor(props) {
    super(props);
        
    this.isMounted = true;
    this.state = {
      image: ''
    };
}
componentWillMount(){ 
  notice = this.props.notice  
    try{
      let url = notice.img_dir + 'image_' + 0 + '.jpg'
      Helpers.getImageUrl(url, (imageUrl)=>{
        this.setState({
          image:imageUrl,
        },()=> console.log(this.state.image))
      })
    }
    catch(error){
      console.log(error)
    }
  
}
openDetail(){
    this.props.update(false)
    this.props.navigation.navigate('DetailNotice', { notice: this.props.notice, request_sos: this.props.request_sos})
}

  render(){ 
    const notice = this.props.notice
    const suggestion = this.props.suggestion
    Moment.locale('es')
    const date_notice = Moment(notice.hora_creacion).format('DD/MM/YYYY');
    var date = new Date();
    const today = Moment(date).format('DD/MM/YYYY');
    const yesterday = Moment(date.setDate(date.getDate() - 1)).format('DD/MM/YYYY');
    if(date_notice == today || date_notice ==  yesterday){
      date_create = Moment(notice.hora_creacion || Moment.now()).fromNow();
    }
    else{
      date_create = date_notice
    }
    return(
        <View style={[styles.notice,{borderWidth: suggestion? 0 : 1.8, marginHorizontal: suggestion? 0 : 10, paddingHorizontal: suggestion? 0 : 8,marginBottom: suggestion? 0 : 5}]}>
            
            <View style={{flexDirection:'row'}}>
                <Image
                    style={[styles.imageDefault,{height: suggestion? height*0.11 : height*0.14}]}
                    source={this.state.image ? {uri: this.state.image } : null}
                />
                <View style={{marginHorizontal:5}}>
                    { notice.tipo === 'SOS' ?
                        <View style={{backgroundColor:'#ee1212', paddingHorizontal:5}}>
                            <Text style={{fontSize:16,color:'white',fontFamily: Fonts.OpenSansBold}}>Aviso Emergencia</Text>
                        </View>
                        :   
                        notice.tipo === 'Busqueda' ?
                            <View style={{backgroundColor:'#ffa41c', paddingHorizontal:5}}>
                                <Text style={{fontSize:16,color:'white',fontFamily: Fonts.OpenSansBold}}>Aviso de Busqueda</Text>
                            </View>
                       :
                       <View style={{backgroundColor:'#81ab81', paddingHorizontal:5}}>
                            <Text style={{fontSize:16,color:'white',fontFamily: Fonts.OpenSansBold}}>Aviso Encontrado</Text>
                        </View>
                    }
                    <View style={{marginVertical: suggestion? 2:10}}>
                      {suggestion?
                        <View>
                          <Text style={appStyle.textRegular}>Por <Text style={appStyle.textSemiBold}>{notice.usuario.nombre}</Text></Text>
                          <Text style={appStyle.textRegular}>Publicado {date_create} </Text>
                        </View>
                      :
                        <View>
                          <Text style={appStyle.textBold}>{notice.estado == 'Abierto'? 'Caso abierto' : 'Caso cerrado'}</Text>
                          <Text style={appStyle.textRegular}>Publicado {date_create} </Text>
                        </View>
                      }
                        
                    </View>
                    
                </View>


            </View>
            {suggestion? null :
            <TouchableOpacity 
            style={appStyle.buttonLarge2}
            onPress={() =>this.openDetail()}
            >
              <Text style={appStyle.buttonLargeText2}> Ver detalles </Text>
            </TouchableOpacity>  }
            
        </View>
    );
  }
}

const styles = StyleSheet.create({
    notice:{
      paddingVertical:5,
      paddingHorizontal:8,
      borderWidth: 1.8,
      borderColor: Colors.primaryColor,
      borderRadius: 4,
      marginBottom:5,
    },
    imageDefault:{
        width:width*0.32,
        height:height*0.14,
        justifyContent:'center',
        alignItems:'center'
      },
});