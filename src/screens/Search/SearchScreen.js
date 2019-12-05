import React from 'react';
import { StyleSheet, Text,View,Image, Dimensions,TouchableOpacity} from 'react-native';
import Header from '../../components/Header';
import {connect} from 'react-redux';
import {Colors} from '../../styles/colors';
import appStyle from '../../styles/app.style'
const {width,height} = Dimensions.get('window');

class SearchScreen extends React.Component {
  render(){ 
    return(
        <View style={styles.container}>
          <Header {...this.props}/>
          <View style={{marginHorizontal:10,marginBottom:10}}>
            <Text style={[appStyle.textTitle,{alignSelf:'center'}]}>Buscar</Text>  
            <View style={[appStyle.lineBottom,appStyle.lineTop]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('NoticeSearch')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/search/promocion.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Avisos</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.props.user.tipo != "Normal"?
              <View style={[appStyle.lineBottom,appStyle.lineTop]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('TemporaryHomes')}>
                <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
                  <Image
                    source={require('../../icons/rescue/house.png')}
                    style= {{width:35,height:35,marginRight:10}}
                  />
                  <Text style={appStyle.textSemiBold}>Hogar temporal</Text>
                </View>
              </TouchableOpacity>
            </View>
              :null
              }
          </View>
      </View>
      
    );
    
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

const mapStateToProps = (state) => {
    console.log('State:');
    console.log(state);  // Redux Store --> Component
    console.log(state.userReducer)
    return {
      user: state.userReducer,
    };
  }
  
  export default connect(mapStateToProps)(SearchScreen);