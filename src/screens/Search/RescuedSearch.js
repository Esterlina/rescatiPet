import React from 'react';
import {ScrollView,View,Text,ActivityIndicator,Dimensions,TouchableOpacity,Picker,Image} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import {Colors} from '../../styles/colors'
import appStyle from '../../styles/app.style'
const {height, width} = Dimensions.get('window');
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/FontAwesome5';
export default class RescuedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animal_type: '',
      sex: '',
      size: '',
      statu: '',
      sexos:["Hembra","Macho"],
      animals:[],
      status:[],
      sizes:[],
      rescueds:[], 
      loading: true,
      other_filters: false,
    }
  }

componentDidMount() {
  return fetch(API + 'rescueds')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
        rescueds: responseJson['rescueds'],
    },() => {this.getFilters()})
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}
getFilters(){
  return fetch(API+'notices/info_notice')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
      console.log(responseJson)
      console.log("ANTES DE STATEARLO IMPRIMIRE")
      console.log(responseJson['tipos'])
    this.setState({
      animals: responseJson['tipos'],
      sizes: responseJson['tamaños'],
      status: responseJson['estados']
    },() => this.setState({loading: false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}

getRescueds(){
    this.setState({loading:true})
    fetch(API + 'rescueds/filters', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      animal_type: this.state.animal_type,
      sex: this.state.sex,
      size: this.state.size,
      statu: this.state.statu,
    }), 
  }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({rescueds: responseJson['rescueds'],loading:false});   
    }).catch((error) =>{
      console.error(error);
    });
}
  render(){ 
    return(
        <View style={{flex:1}}>
         <Header {...this.props} stack='true'/> 
            <View style={{backgroundColor:Colors.primaryColor, padding:10}}>
                <View style={{backgroundColor:'white', alignItems:'center',borderRadius:4}}>
                    <Text style={appStyle.textTitleCalipso}>BUSCAR RESCATADOS</Text>
                </View>
                <View style={{backgroundColor:'white',borderRadius:4, padding:5,marginTop:5}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={[appStyle.input,appStyle.inputFilters]}>
                             <Picker
                                selectedValue={this.state.animal_type}
                                style={appStyle.pickerFilter}
                                onValueChange={(itemValue, itemIndex) =>
                                this.setState({animal_type: itemValue})
                                }>
                                <Picker.Item key={0} color= "#a0a0a0" label="Especie" value="" />
                                {this.state.animals.map( animal_type => (<Picker.Item key={animal_type.id} color="gray" label={animal_type.name} value={animal_type.name} />))}              
                            </Picker>
                        </View>
                        <View style={[appStyle.input,appStyle.inputFilters]}>
                        <Picker
                                selectedValue={this.state.statu}
                                style={appStyle.pickerFilter}
                                onValueChange={(itemValue, itemIndex) =>
                                this.setState({statu: itemValue})
                                }>
                                <Picker.Item key={0} color= "#a0a0a0" label="Estado" value="" />
                                {this.state.status.map( statu => (<Picker.Item key={statu} color="gray" label={statu} value={statu} />))}              
                            </Picker>
                            
                        </View>
                    </View>
                    {this.state.other_filters?
                    <View>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.sex}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {this.setState({sex:itemValue})}
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Sexo" value="" />
                                    {this.state.sexos.map( sex => (<Picker.Item key={sex} color="gray" label={sex} value={sex} />))}              
                                </Picker>
                            </View>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.size}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                    this.setState({size: itemValue})
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Tamaño" value="" />
                                    {this.state.sizes.map( size => (<Picker.Item key={size} color="gray" label={size} value={size} />))}              
                                </Picker>
                            </View>
                            
                        </View>
                    </View>
                    :null}
                </View>
            </View>
            
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                {this.state.other_filters? null:
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]} onPress={() => this.setState({other_filters:true})}>
                    <Text style={[appStyle.buttonLargeText2]}>+ Agregar filtros</Text>
                </TouchableOpacity>}
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]} onPress={() => this.getRescueds()}>
                    <Text style={[appStyle.buttonLargeText2]}>Buscar</Text>
                </TouchableOpacity>                    
            </View>
            {!this.state.loading ?
            this.state.rescueds.length == 0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginHorizontal:20}}>
                    <Image
                    source={require('../../icons/search/no-encontrado.png')}
                    style= {{width: height*0.2,height:height*0.2,marginBottom:20}}
                    />
                    <Text style={[appStyle.textBold,{fontSize:16,textAlign:'center'}]}>No se han encontrado rescatados</Text>
            </View>
            :<ScrollView style={{flex:1,marginVertical:10}}>
                <View style={{marginVertical:10}}>
                {this.state.rescueds.map((rescued) => {
            return (
              <View key={rescued.id} style={[appStyle.containerPublication,{borderColor:Colors.primaryColor, padding:5}]}>
                <View style={{flexDirection:'row'}}>
                <UserAvatar size="50" name={rescued.nombre} src={rescued.profile_picture}/>
                <View style={{flexDirection:'column', alignSelf:'center'}}>
                  <View style={{flexDirection:'row'}}>
                  <Text style={[appStyle.textSemiBold,{alignSelf:'center', marginLeft:10}]}>{rescued.nombre}</Text>
                    <View style={[appStyle.sexCircle,{backgroundColor:rescued.sexo == "Hembra"? Colors.primaryColor: Colors.violet}]}>
                          {rescued.sexo == "Hembra"? 
                            <Icon name="venus" size={15} color='white' regular/>
                            :<Icon name="mars" size={15} color='white' regular/>
                          }
                    </View>
                    <Icon name="circle" size={6} color={Colors.gray} style={{alignSelf:'center',marginLeft:4}} regular/>
                    <View style={[appStyle.tagState,{backgroundColor:rescued.estado == "En rehabilitación"? Colors.primaryColor:Colors.violet}]}>
                        <Text style={[appStyle.textSemiBold,{color:'white'}]}>{rescued.estado}</Text>
                    </View>
                  </View>
                 
                    <Text style={[appStyle.textRegular,{marginLeft:10}]}>Registro: {rescued.registro}</Text>
                  </View>
                  
                </View>
                <TouchableOpacity style={{position:'absolute',width:40,right:0,height:height*0.1,justifyContent:'center'}} onPress={() =>  this.props.navigation.navigate('Rescued', { rescued_id: rescued.id})}>
                    <Icon name="chevron-right" size={25} color={Colors.primaryColor} style={{alignSelf:'center'}}/>
                </TouchableOpacity>
              </View>
            )
          })}
                </View>
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View> }
      </View>
    );
    
  }
}
