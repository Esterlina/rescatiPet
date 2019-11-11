import { createStackNavigator } from 'react-navigation'

import Options from './RescueScreen';
import AdoptionForm from './AdoptionFormScreen';
import Adoptions from './AdoptionsScreen';
export default createStackNavigator({
    Options,
    AdoptionForm,
    Adoptions,
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});