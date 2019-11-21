import { createStackNavigator } from 'react-navigation'

import Options from './RescueScreen';
import AdoptionForm from './AdoptionFormScreen';
import Adoptions from './AdoptionsScreen';
import EventForm from './EventFormScreen';
import TemporaryHomeForm from './TemporaryHomeFormScreen';
import RequestTemporaryHome from './RequestTemporaryHomeScreen';
import CampaignForm from './CampaignFormScreen'
export default createStackNavigator({
    Options,
    AdoptionForm,
    Adoptions,
    EventForm,
    TemporaryHomeForm,
    RequestTemporaryHome,
    CampaignForm
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});