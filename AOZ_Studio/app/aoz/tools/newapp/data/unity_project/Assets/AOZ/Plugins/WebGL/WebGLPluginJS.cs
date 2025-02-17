using System.Runtime.InteropServices;

// Read more about creating JS plugins: https://www.patrykgalach.com/2020/04/27/unity-js-plugin/

/// <summary>
/// Class with a JS Plugin functions for WebGL.
/// </summary>
public static class WebGLPluginJS
{
    // Importing "SendMessageToPage"
    [DllImport("__Internal")]
    public static extern void SendMessageToPage(string text);
}
