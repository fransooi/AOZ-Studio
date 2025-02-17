
### AOZ Debugger Help

#### Controlling the debugger from the top left menu:

![Step](http://resources/ext_debugging/assets/stepin.png)
Step: Execute the next instruction and stop immediately after. Going through all the codes step by step, including procedures and routines.
<br>

![Step Over](http://resources/ext_debugging/assets/stepover.png)
Step Over : Execute the next instruction and stop immediately after. But without entering the code of the procedures or Gosub. Use this feature to avoid stepping through codes of routines that you know are functioning correctly.
<br>

![Skip](http://resources/ext_debugging/assets/skip.png)
Skip : Position the program pointer in the code after the current instruction. Therefore that instruction will not be executed. Note that it may force the program to exit loops if you skip a Next instruction for example.
<br>

![Step Slow](http://./resources/ext_debugging/assets/stepslow.png)
Step Slowly : Same as clicking on the Step In button every half-second. All is updated at slow speed.
<br>

![Run Slow](http://resources/ext_debugging/assets/runslow.png)
Run Slow : Launches your application at a rate of one frame per second. Click on any other button to exit.
<br>

![Run](http://resources/ext_debugging/assets/run.png)
Run Full Speed: Launches your application at full speed while watching all the values of the variables and expressions evolve.
<br>

![Setup](http://resources/ext_debugging/assets/settings.png)
Opens the debugger setup panel in which you can control how the information is displayed.
<br>

![Help](http://resources/ext_debugging/assets/help.png)
Debugger Help: open this page.
<br>

#### Controlling the debugger from the keyboard

It is also possible to control the debugger with function keys. These keys are active even if the Application window is not activated.
- F8 = 	'Run'
- F9 = 	'Step'
- F10 = 'Step Over'
- F11 = 'Skip'
- F12 = 'Step Slow'
- ESCAPE = hides the debugger while keeping it active and re-launch the application at full speed. A further press on ESCAPE will re-open the debugger in Pause mode.

#### Controlling the debugger from the console

You also can control the debugger from the Console panel at the very bottom, by typing these commands in it:
- Step
- Stepover
- Skip
- Stepslow
- Runslow
- Run
- Watch expression: 

<br>

Add a line in the Watch panel that displays the given expressions and its value.

##### Examples
'''
Watch TOPRINT$          // Display the value of the string variable "TOPRINT$"
Watch Sin( A# ) * RAY#  // Display the result of the calculation 
'''

- Break If expression1 = expression2: 

<br>

Add a line in the Watch panel displaying the result of the calculation and start the inspection of the result.   


You can then Run the application, it will function as normal until the first expression is equal to the second one.   


The application will be paused and the debugger will appear back if it was hidden as soon as the comparison is true.   

##### Examples  
'''
// Will stop the application when variable A equals to 10
Break If A = 10			
'''

'''
// Will stop the application when the condition is true
Break If Sin( ANGLE# ) * 100 > 90
'''


