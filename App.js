import React from 'react';
import {AsyncStorage} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './src/components/Navigation'
import { store, persistor } from './src/persist/store';

import firebase from 'react-native-firebase'
import FirebaseConfig from './lib/FirebaseConfig';

firebase.initializeApp(FirebaseConfig);
//firebase.app(FirebaseConfig)

class App extends React.Component{
 /* async getToken() {
    console.log("ESTOY EN GET TOKEN DEL DEVICE")
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log("after fcmToken: ", fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }*/

  async requestPermission() {
    console.log("ESTOY EN REQUESTPERMISSION DEL DEVICE")
    firebase.messaging().requestPermission()
      .then(() => {
        console.log('permission granted');
       // this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  async checkPermission() {
    console.log("ESTOY EN CHECK PERMISSION DEL DEVICE")
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission granted");
          //this.getToken();
        } else {
          console.log("Request Permission");
          this.requestPermission();
        }
      });
  }

  async componentDidMount() {
    this.checkPermission();
  }

  render(){
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <AppContainer/>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;