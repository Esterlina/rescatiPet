import React from 'react';
import {ScrollView,View,Text,ActivityIndicator,Dimensions,TouchableOpacity,Picker,Image} from 'react-native';
import Header from '../../components/Header';
import {API} from '../../keys';
import TemporaryHome from '../../components/DetailTemporaryHome'
import {Colors} from '../../styles/colors'
import appStyle from '../../styles/app.style'
const {height, width} = Dimensions.get('window');
import Notice from '../../components/Notice'
export default class NoticeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
      comuna: '',
      animal_type: '',
      type: '',
      sex: '',
      size: '',
      collar: '',
      clothes: '', 
      regions:[],
      comunas:[],
      sexos:[],
      types:[],
      animal_types:[],
      sizes:[],
      collars:[],
      clothing:[],
      notices:[], 
      loading: true,
      other_filters: false,
    }
  }

componentDidMount() {
  return fetch(API + 'notices')
  .then( (response) => response.json() )
  .then( (responseJson ) => {
    this.setState({
      notices: responseJson['notices'],
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
    this.setState({
      regions: responseJson['regiones'],
      animal_types: responseJson['tipos'],
      types: responseJson['tipos_aviso'],
      sexos: responseJson['sexos'],
      sizes: responseJson['tamaños'],
      collars: responseJson['collar'],
      clothing: responseJson['ropa']
    },() => this.setState({loading: false}))
  })
  .catch((error) => {
    console.log("HA OCURRIDO UN ERROR DE CONEXION")
    console.log(error)
    this.setState({loading: false})
  });
}
getComunasByRegion(){
    if(this.state.region_id != 0){
        return fetch(API + 'temporary_homes/comunas/' + this.state.region_id)
        .then((response) => response.json())
        .then((responseJson) => {
        this.setState({
            comunas: responseJson['comunas'],
        });
        })
        .catch((error) =>{
        console.error(error);
    });
  }
}
getNotices(){
    this.setState({loading:true})
    fetch(API + 'notices/filters', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      region: this.state.region,
      comuna: this.state.comuna,
      type: this.state.type,
      animal_type: this.state.animal_type,
      sex: this.state.sex,
      size: this.state.size,
      collar: this.state.collar,
      clothes: this.state.clothes
    }), 
  }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({notices: responseJson['notices'],loading:false});   
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
                    <Text style={appStyle.textTitleCalipso}>BUSCAR AVISOS</Text>
                </View>
                <View style={{backgroundColor:'white',borderRadius:4, padding:5,marginTop:5}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={[appStyle.input,appStyle.inputFilters]}>
                            <Picker
                                selectedValue={this.state.region}
                                style={appStyle.pickerFilter}
                                onValueChange={(itemValue, itemIndex) =>
                                    {this.setState({region:itemValue,region_id:itemIndex},() => {this.getComunasByRegion()})}
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
                                selectedValue={this.state.type}
                                style={appStyle.pickerFilter}
                                onValueChange={(itemValue, itemIndex) =>
                                    {this.setState({type:itemValue})}
                                }>
                                <Picker.Item key={0} color= "#a0a0a0" label="Tipo de aviso" value="" />
                                {this.state.types.map( type => (<Picker.Item key={type} color="gray" label={type} value={type} />))}              
                            </Picker>
                        </View>
                        <View style={[appStyle.input,appStyle.inputFilters]}>
                            <Picker
                                selectedValue={this.state.animal_type}
                                style={appStyle.pickerFilter}
                                onValueChange={(itemValue, itemIndex) =>
                                this.setState({animal_type: itemValue})
                                }>
                                <Picker.Item key={0} color= "#a0a0a0" label="Animal" value="" />
                                {this.state.animal_types.map( animal_type => (<Picker.Item key={animal_type} color="gray" label={animal_type} value={animal_type} />))}              
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
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.collar}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {this.setState({collar:itemValue})}
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Collar" value="" />
                                    {this.state.collars.map( collar => (<Picker.Item key={collar} color="gray" label={collar} value={collar} />))}              
                                </Picker>
                            </View>
                            <View style={[appStyle.input,appStyle.inputFilters]}>
                                <Picker
                                    selectedValue={this.state.clothes}
                                    style={appStyle.pickerFilter}
                                    onValueChange={(itemValue, itemIndex) =>
                                    this.setState({clothes: itemValue})
                                    }>
                                    <Picker.Item key={0} color= "#a0a0a0" label="Ropa/Accesorios" value="" />
                                    {this.state.clothing.map( clothes => (<Picker.Item key={clothes} color="gray" label={clothes} value={clothes} />))}              
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
                <TouchableOpacity style={[appStyle.buttonLarge2,{width:width*0.4}]} onPress={() => this.getNotices()}>
                    <Text style={[appStyle.buttonLargeText2]}>Buscar</Text>
                </TouchableOpacity>                    
            </View>
            {!this.state.loading ?
            this.state.notices.length == 0?
            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginHorizontal:20}}>
                    <Image
                    source={require('../../icons/search/no-encontrado.png')}
                    style= {{width: height*0.2,height:height*0.2,marginBottom:20}}
                    />
                    <Text style={[appStyle.textBold,{fontSize:16,textAlign:'center'}]}>No se han encontrado avisos</Text>
            </View>
            :<ScrollView style={{flex:1,marginVertical:10}}>
                <View style={{marginVertical:10}}>
                    {this.state.notices.map((notice) => {
                    console.log(notice)
                        return (
                        <Notice key={notice.id} notice={notice}
                            navigation={this.props.navigation}
                            /> 
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
