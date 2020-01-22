import firebase from 'react-native-firebase'
import { AsyncStorage} from 'react-native';


class Helpers{
    static getImageUrl(nameImage,callback){
        const imageRef = firebase.storage().ref(nameImage)
        imageRef.getDownloadURL().then((url) =>{
            imageUrl = url
            callback(imageUrl)
        })
    }
    static getDocument(nameDocument,callback){
      const docRef = firebase.storage().ref(nameDocument)
      docRef.getDownloadURL().then((url) =>{
          docRef.getMetadata()
          .then((metadata) => {
              console.log(metadata)
              document = {url:url, name: metadata.customMetadata.file_name, type: metadata.contentType}
              callback(document)
          });
      });     
  }
    static firebaseToken() {
        const currentUser = firebase.auth().currentUser
      
         if (currentUser) {
        // reaches here
          const idToken = currentUser.getIdToken();
          console.log("IMPRIMIRE EL TOKEN:");
          console.log(idToken);
        // never reaches here
        return idToken
        }
      }

    static  user = async () => {
      try{
        let user_item = await AsyncStorage.getItem('user')
        let user =  JSON.parse(user_item);
        console.log("ESTOY EN EL USER HELPER")
        console.log(user)
        console.log("TERMINE EN HELPER")
        return user
      }catch(error){
        console.log(error)
      }
    }
}

module.exports = Helpers


