using UnityEngine;

namespace AOZForUnity
{
    public class AOZMessenger : MonoBehaviour
    {
        public void ReceiveMessageFromPage(string message)
        {
            Debug.Log( message );
        }

        public void SendMessageToPage(string message)
        {
            WebGLPluginJS.SendMessageToPage( message );
        }
    }
}
