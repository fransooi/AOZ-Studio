  using UnityEditor;
  using System.IO;
  using System.Collections;
  using System.Collections.Generic;
  using System.Diagnostics; 
  class WebGLBuilder {
      static void Build() 
      {
        
        if( !Directory.Exists("Assets/Scenes"))
        {
            Debug.Fail("BUILD ERROR. No scene found.", "At least one scene must exist in the Assets/Scenes folder.");
            return;
        }
        
        if (!Directory.Exists("../resources"))
        {
            Debug.Fail("BUILD ERROR. Resources folder not found.", "The resource file was not found for the AOZ project.");
            return;
        }

        string[] files = Directory.GetFiles("Assets/Scenes");
        List<string> scenesList = new List<string>();
        foreach(string fileName in files)
        {
            if( File.Exists(fileName))
            {
                FileInfo fi = new FileInfo(fileName);
                if( fi.Extension.ToLower() == ".unity")
                {
                    scenesList.Add(fileName);
                }
            }
        }

        if(scenesList.Count == 0)
        {
            Debug.Fail("BUILD ERROR. No scene found.", "At least one scene must exist in the Assets/Scenes folder.");
            return;
        }

        BuildPlayerOptions options = new BuildPlayerOptions();
        options.scenes = scenesList.ToArray();
        options.locationPathName = "../resources/unity";
        options.target = BuildTarget.WebGL;
        options.options = BuildOptions.None;

        BuildPipeline.BuildPlayer( options );
      }
  }
