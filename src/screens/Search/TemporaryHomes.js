import React from 'react';
import {ScrollView,View,Text,ActivityIndicator,Dimensions,TouchableOpacity,Picker} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import TemporaryHome from '../../components/DetailTemporaryHome'
import {Colors} from '../../styles/colors'
import firebase from 'react-native-firebase'
import appStyle from '../../styles/app.style'
const {height, width} = Dimensions.get('window');
export default class TemporaryHomes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
      comuna: '',
      rescued: '',
      home_type: '',
      time: '',    
      regions:[],
      comunas:[],
      times:[],
      home_types:[],
      rescued_receive:[],  
      temporary_homes:[], 
      loading: true,
    }
  }

componentDidMount() {
  return fetch(API+'temporary_homes')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      temporary_homes: responseJson['temporary_homes'],
      regions: responseJson['regiones'],
      rescued_receive: responseJson['animales_temporales'],
      home_types: responseJson['tipo_hogar'],
      times: responseJson['times']
    },() => this.setState({loading: false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}
getComunasByRegion(){
    console.log("VOY A BUSCAR LAS COMUNAS")
    console.log(this.state.region_id)
    if(this.state.region_id != 0){
        return fetch(API + 'temporary_homes/comunas/' + this.state.region_id)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("IMPRIMIRE LA RESPUESTA")
            console.log(responseJson)
        this.setState({
            comunas: responseJson['comunas'],
        },()=> {console.log(this.state.region_id)});
        })
        .catch((error) =>{
        console.error(error);
    });
    }
}
  render(){ 
    console.log(this.state.temporary_homes)
    return(
        <View style={{flex:1}}>
         <Header {...this.props} stack='true'/> 
          {!this.state.loading ?
            <ScrollView style={{flex:1,marginBottom:10}}>
                <View style={{backgroundColor:Colors.primaryColor, padding:10}}>
                    <View style={{backgroundColor:'white', alignItems:'center',borderRadius:4}}>
                        <Text style={appStyle.textTitleCalipso}>BUSCAR HOGAR TEMPORAL</Text>
                    </View>
                    <View style={{backgroundColor:'white',borderRadius:4, padding:5,marginTop:5}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.region}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {this.setState({region:itemValue,region_id:itemIndex},() => {this.getComunasByRegion();})}
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Region" value="" />
                                    {this.state.regions.map( region => (<Picker.Item key={region.id} color="gray" label={region.name} value={region.name} />))}              
                                </Picker>
                            </View>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.comuna}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                    this.setState({comuna: itemValue})
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Comuna" value="" />
                                    {this.state.comunas.map( comuna => (<Picker.Item key={comuna.id} color="gray" label={comuna.name} value={comuna.name} />))}              
                                </Picker>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.home_type}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {this.setState({region:itemValue,region_id:itemIndex})}
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Tipo de hogar" value="" />
                                    {this.state.home_types.map( home_type => (<Picker.Item key={home_type} color="gray" label={home_type} value={home_type} />))}              
                                </Picker>
                            </View>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.rescued}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                    this.setState({comuna: itemValue})
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Hogar para" value="" />
                                    {this.state.rescued_receive.map( rescued => (<Picker.Item key={rescued} color="gray" label={rescued} value={rescued} />))}              
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]}>
                        <Text style={[appStyle.buttonLargeText2]}>+ Agregar filtros</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]}>
                        <Text style={[appStyle.buttonLargeText2]}>Buscar hogar</Text>
                    </TouchableOpacity>                    
                </View>
                <View style={{marginVertical:10}}>
                    {this.state.temporary_homes.map((temporary_home) => {
                    console.log(temporary_home)
                        return (
                        <TemporaryHome key={temporary_home.id} temporary_home={temporary_home}
                            navigation={this.props.navigation}
                            /> 
                        )
                    })}
                </View>
            </ScrollView>
            : 
            <View style={{flex:1,justifyContent:'center'}}>
              <ActivityIndicator size="large" color= {Colors.violet} />
            </View> }
      </View>
    );
    
  }
}
