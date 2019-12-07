import React, {PureComponent} from 'react';
import { View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux'
import Perfil from '../components/PerfilUser'
class PerfilScreen extends PureComponent {
  _isMounted = false;
  constructor(props){
    super(props)
  }

  static navigationOptions = {
    tabBarIcon:({tintColor}) => (
      <Icon name="user-circle" size={25} color="white"/>
    )
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(){ 
    return(
      <Perfil user_id={this.props.user.id}
      navigation={this.props.navigation}
      /> 
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
}
export default connect(mapStateToProps)(PerfilScreen);