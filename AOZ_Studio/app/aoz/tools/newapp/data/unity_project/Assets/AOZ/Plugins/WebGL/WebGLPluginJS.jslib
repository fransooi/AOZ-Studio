// Read more about creating JS plugins: https://www.patrykgalach.com/2020/04/27/unity-js-plugin/

// Creating functions for the Unity
mergeInto(LibraryManager.library, {

   // Method used to send a message to the page
   SendMessageToPage: function (text) {
      // Convert bytes to the text
      var convertedText = Pointer_stringify(text);

      // Pass message to the page
      receiveMessageFromUnity(convertedText); // This function is embeded into the page
   }
});
