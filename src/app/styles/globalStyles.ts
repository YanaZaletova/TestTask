import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({

    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  
    map:{
      ...StyleSheet.absoluteFillObject,
    },
  
    buttonContainer: {
      position: 'absolute',
      bottom: 100,
      right: 8,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  
    button: {
      backgroundColor: '#ffffff',
      borderRadius: 50,
      padding: 3,
      marginBottom: 10,
    },
  
    buttonImage: {
      width: 40,
      height: 40
    },
  
    searchContainer: {
      position: 'absolute',
      top: 20,
      left: 10,
      right: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      zIndex: 1,
      backgroundColor: '#ffffff',
      borderRadius: 20,
    },
  
    searchInput: {
      height: 40,
      fontSize: 16,
    },
  
    messageContainer: {
      position: 'absolute',
      top: 55,
      left: 10,
      right: 10,
      borderRadius: 20,
      padding: 8,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#f76157',
      alignItems: 'center',
    },
    
    messageText: {
      color: '#f76157',
      fontWeight: 'bold',
    },
    
    modalContainer:{
      backgroundColor: '#ffffff',
      padding: 20,
      borderWidth: 2,
      borderColor: '#4287f5',
      borderRadius: 10 
    },
  
    modalTitleContainer:{
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    },
  
    modalFavouriteButton:{
      width: 30, 
      height: 30, 
      marginLeft: 10 
    },
  
    modalButton:{
      padding: 10, 
      marginTop: 8, 
      borderRadius: 20
    },
  
    modalText:{
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center'
    },
  
    textCoords: {
      marginTop: 20, 
      marginBottom: 10, 
      textAlign: 'center'
    },
  
    textTitle:{
      fontWeight: 'bold', 
      fontSize: 16
    },
  
    inputTitle:{
      borderBottomWidth: 0.5, 
      marginTop: 10
    },

    info: {
      position: 'absolute',
      bottom: 60,
      left: 15,
      right: 15,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#4287f5',
      padding: 15,
      borderRadius: 20,
    },
    
    titleInfo: {
      fontWeight: 'bold',
      marginBottom: 3,
    },
  });

  export default globalStyles;