import * as firebase from 'firebase'

class Helpers{
    static getImageUrl(nameImage,callback){
        const imageRef = firebase.storage().ref(nameImage)
        imageRef.getDownloadURL().then((url) =>{
            imageUrl = url
            callback(imageUrl)
        })
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
}

module.exports = Helpers


