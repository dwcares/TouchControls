TouchControls
=============

TouchControls is a suite of WinJS touch-optimized controls for Windows 8 deployed on NuGet. 

###Included controls
1. [SliderButton] (https://github.com/dwcares/TouchControls#sliderbutton)
2. [PullToRefresh] (https://github.com/dwcares/TouchControls#pulltorefresh)
3. [GamePad] (https://github.com/dwcares/TouchControls#gamepad)

###Required references
```html:default.html
<!-- You must add these references to your default.html -->
<link href="/TouchControls/touchControls.css" rel="stylesheet" />
<script src="/TouchControls/touchControls.js"></script>
```

###NuGet package
[DWCares.TouchControls.WinJS](https://www.nuget.org/packages/DWCares.TouchControls.WinJS/)

###Contact info
* [dwcares.com](http://dwcares.com)
* [@dwcares](http://twitter.com/dwcares)

##SliderButton
---
SlideButton is an extended appbar button with cross slide support. It supports basic click and tap functionality, and also supports sliding in one of four directions for secondary functionality.

###Properties
* *textLabel* (string): The label displayed next to the button
* *glyph* (string): The icon/glyph symbol displayed in the button
* *toggleOn* (boolean): If the button is currently in the toggled on state
* *extraClass* (string): Extra classes applied to the control
* *slideBehavior* (string): Either "slide" to enable cross slide behavior, or "none" to disable it.
* *slideDirection* (SlideDirection): The direction to enable cross slide behavior 

###Events
* *click*: The button has been clicked
* *slide*: The button has been slid past the threshold

###Example usage
```html:default.html
<div id="deleteButton"
    data-win-control="TouchControls.SlideButton" 
    data-win-options="{
         textLabel: 'Delete',
         glyph: '' ,
         extraClass: 'contextual hidden',
         slideBehavior: 'slide',
         slideDirection: 'down' }">
</div>
<div id="flagButton" 
    data-win-control="TouchControls.SlideButton" 
        data-win-options="{
         textLabel: 'Flag',
         glyph: '' ,
         extraClass: 'contextual hidden'
         }">
</div>

```

```js:default.js
        document.getElementById("flagButton").addEventListener("click", doClickFlag);
        document.getElementById("deleteButton").addEventListener("slide", doClickDelete);
```

###Screenshot
![Some buttons can slide](http://dwcares.com/wp-content/uploads/2014/02/TouchSlide.png)

<br/><br/>

##PullToRefresh
---
PullToRefresh is a capability you can add to existing scrollable content to add the touch pull to refresh behavior.

###Properties
* *extraClass* (string): Extra classes applied to the control
* *pullHintLabel* (string): The label that is displayed before the user hits the pull threshold, default is "Pull to refresh"
* *releaseHintLabel* (string): The label that is displayed after the user hits the pull threshold, default is "Release to refresh"
* *refreshing* (boolean): Is the view currently in the ref

###Events
* *refresh*: The user initiated a refresh

###Methods
* *none*

###Example usage
```html:default.html
    <div class="listScroller" data-win-control="TouchControls.PullToRefresh">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
        <div class="item">Item 4</div>
        <div class="item">Item 5</div>
    </div>
```

```js:default.js
    function init() {
        var listScroller = document.querySelector(".listScroller");
        listScroller.addEventListener("refresh", function (e) {
            e.detail.setPromise(refreshItemsAsync());
        });
    }
```

###Screenshot
![Pull to refresh ](http://dwcares.com/wp-content/uploads/2013/10/pulltorefresh1.gif)

<br/><br/>

##GamePad
---
GamePad is a multi-touch game controller designed to be integrated into HTML5 canvas games. It has a left and right hand controller, and supports 2-dimentional and button controller modes. The design is based upon Seb Lee-Delisle's [Multi-touch game controller in JavaScript/HTML5 for iPad](http://seb.ly/2011/04/multi-touch-game-controller-in-javascripthtml5-for-ipad/)

###Properties
* *leftControllerMode* (ControllerMode): The controller mode to display the controller in
* *rightControllerMode* (ControllerMode): The controller mode to display the controller in
* *leftControllerColor* (string): The canvas color to display the controller
* *rightControllerColor* (string):  The canvas color to display the controller
* *leftControllerOpacity* (float): A value between 0 and 1 that indicates the opacity of the controller
* *rightControllerOpacity* (float):  A value between 0 and 1 that indicates the opacity of the controller
* *leftController* (Controller): A read only indicator of the current controller state
* *rightController* (float):  * *leftControllerOpacity* (float): A value between 0 and 1 that indicates the opacity of the controller
* *rightControllerOpacity* (float):  A value between 0 and 1 that indicates the opacity of the controller

###Objects
* *ControllerMode*
 * controller (string): Use the 2d controller mode
 * button (string): Use the button controller mode 
* *Controller*
 * pressed (boolean): Indicates the controller is currently active
 * position (x,y): Indicates the current x, y position of the gamepad

###Events
* *none*

###Methods
* *draw*: Draw the left and right game controllers; called every frame

```js:default.js
   function init(canvas) {
                _gamepad = new TouchControls.GamePad(jaws.canvas, {
                    rightControllerMode: TouchControls.GamePad.ControllerMode.button,
                    leftControllerColor: "#FFFFFF",
                    rightControllerColor: "red",
                    leftControllerOpacity: 0.5,
                    rightControllerOpacity: 0.8
                });
            }

            function update() {
                if (_gamepad.leftController.position.x < 0 || jaws.pressed("left"))
                    goLeft();

                if (gamepad.leftController.position.x > 0 || jaws.pressed("right"))
                    goRight();

                if (gamepad.leftController.presesed || jaws.pressed("space"))
                    attack();
            }

            function draw() {
                _gamepad.draw();
                drawSprites();
                drawTiles();
                drawWorld();
            }
```

###Screenshot
![GamePad in action](http://dwcares.com/wp-content/uploads/2014/02/gamepad-e1393544300322.png)



