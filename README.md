TouchControls
=============

TouchControls is a suite of WinJS touch-optimized controls for Windows 8 deployed on NuGet. 

###Included controls
1. SliderButton
2. PullToRefresh

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
* *slideDirection* (TouchControls.SlideDirection): The direction to enable cross slide behavior 

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
* *complete*: Reset the PullToRefresh control to enable refresh.

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
            refreshItemsAsync().then(function () { listScroller.winControl.complete(); });
        });
    }
```

###Screenshot
![Pull to refresh ](http://dwcares.com/wp-content/uploads/2013/10/pulltorefresh1.gif)

