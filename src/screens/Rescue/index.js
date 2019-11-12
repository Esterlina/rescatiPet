import { createStackNavigator } from 'react-navigation'

import Options from './RescueScreen';
import AdoptionForm from './AdoptionFormScreen';
import Adoptions from './AdoptionsScreen';
import EventForm from './EventFormScreen'
export default createStackNavigator({
    Options,
    AdoptionForm,
    Adoptions,
    EventForm,
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});