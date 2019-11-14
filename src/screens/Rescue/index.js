import { createStackNavigator } from 'react-navigation'

import Options from './RescueScreen';
import AdoptionForm from './AdoptionFormScreen';
import Adoptions from './AdoptionsScreen';
import EventForm from './EventFormScreen';
import TemporaryHomeForm from './TemporalHomeFormScreen';
export default createStackNavigator({
    Options,
    AdoptionForm,
    Adoptions,
    EventForm,
    TemporaryHomeForm,
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});