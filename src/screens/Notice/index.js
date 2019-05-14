import { createStackNavigator } from 'react-navigation'

import Notice from './NoticeScreen';
import Form from './NoticeFormScreen';

export default createStackNavigator({
    Notice,
    Form
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});