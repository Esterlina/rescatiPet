import React from 'react';
import {ScrollView,View,Text,ActivityIndicator,Dimensions,TouchableOpacity,Picker,Image} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import TemporaryHome from '../../components/DetailTemporaryHome'
import {Colors} from '../../styles/colors'
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
      pet: '',
      children: '',
      older_adults: '', 
      regions:[],
      comunas:[],
      times:[],
      home_types:[],
      rescued_receive:[],
      childrens:[],
      olders:[],
      pets:[], 
      temporary_homes:[], 
      loading: true,
      other_filters: false,
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
      times: responseJson['tiempo'],
      childrens: responseJson['niños'],
      olders: responseJson['adultos_mayores'],
      pets: responseJson['mascotas']
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
getTemporaryHomes(){
    console.log("OJOOOOOOOOOOOO PRIMERO IMPRIMIRE LOS PARAMETROS")
    console.log(this.state.region)
    this.setState({loading:true})
    fetch(API + 'temporary_homes/filters', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      region: this.state.region,
      comuna: this.state.comuna,
      home_type: this.state.home_type,
      rescued: this.state.rescued,
      time: this.state.time,
      pet: this.state.pet,
      children: this.state.children,
      older_adults: this.state.older_adults
    }), 
  }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({temporary_homes: responseJson['temporary_homes']},()=>{
          console.log("IMPRIMIRE EL RESULTADO DEL FILTRO")
          console.log(this.state.temporary_homes)
          this.setState({loading:false})
      });   
    }).catch((error) =>{
      console.error(error);
    });
}
  render(){ 
    console.log(this.state.temporary_homes)
    return(
        <View style={{flex:1}}>
         <Header {...this.props} stack='true'/> 
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
                                    {this.setState({home_type:itemValue})}
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
                                this.setState({rescued: itemValue})
                                }>
                                <Picker.Item key={0} color= "#a0a0a0" label="Hogar para" value="" />
                                {this.state.rescued_receive.map( rescued => (<Picker.Item key={rescued} color="gray" label={rescued} value={rescued} />))}              
                            </Picker>
                        </View>
                    </View>
                    {this.state.other_filters?
                    <View>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.time}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {this.setState({time:itemValue})}
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Tiempo" value="" />
                                    {this.state.times.map( time => (<Picker.Item key={time} color="gray" label={time} value={time} />))}              
                                </Picker>
                            </View>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.pet}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                    this.setState({pet: itemValue})
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Mascota" value="" />
                                    {this.state.pets.map( pet => (<Picker.Item key={pet} color="gray" label={pet} value={pet} />))}              
                                </Picker>
                            </View>
                            
                        </View>

                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.children}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                    this.setState({children: itemValue})
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Niños" value="" />
                                    {this.state.childrens.map( children => (<Picker.Item key={children} color="gray" label={children} value={children} />))}              
                                </Picker>
                            </View>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.older_adults}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {this.setState({older_adults:itemValue})}
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Adultos mayores" value="" />
                                    {this.state.olders.map( older => (<Picker.Item key={older} color="gray" label={older} value={older} />))}              
                                </Picker>
                            </View>
                        </View>
                    </View>
                    :null}
                </View>
            </View>
            
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]} onPress={() => this.setState({other_filters:true})}>
                    <Text style={[appStyle.buttonLargeText2]}>+ Agregar filtros</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]} onPress={() => this.getTemporaryHomes()}>
                    <Text style={[appStyle.buttonLargeText2]}>Buscar hogar</Text>
                </TouchableOpacity>                    
            </View>
            {!this.state.loading ?
            this.state.temporary_homes.length == 0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginHorizontal:20}}>
                    <Image
                    source={require('../../icons/search/no-encontrado.png')}
                    style= {{width: height*0.2,height:height*0.2,marginBottom:20}}
                    />
                    <Text style={[appStyle.textBold,{fontSize:16,textAlign:'center'}]}>No se han encontrado hogares temporales</Text>
            </View>
            :<ScrollView style={{flex:1,marginVertical:10}}>
                <View style={{marginVertical:10}}>
                    {this.state.temporary_homes.map((temporary_home) => {
                    console.log(temporary_home)
                        return (
                        <TemporaryHome key={temporary_home.id} temporary_home={temporary_home} index={true}
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
