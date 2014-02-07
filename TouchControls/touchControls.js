(function () {
    "use strict";
    var slideButton = WinJS.Class.define(
        function Control_ctor(element, options) {
            this.element = element || document.createElement("div");

            // options defaults
            this._textLabel = "Button";
            this._glyph = "";
            this._toggleOn = true;
            this._extraClass = "";
            this._slideDirection = TouchControls.SlideButton.SlideDirection.down;
            this._commitThreshold = 30;
            this._slideBehavior = "none";
            this._createVisualTree();

            WinJS.UI.setOptions(this, options);
        }, {

            //Public members
            textLabel: {
                get: function () {
                    return this._textLabel;
                },
                set: function (value) {
                    this._textLabel = value;
                    this.element.querySelector(".touch-slideButtonLabel").innerText = this._textLabel;
                }
            },
            glyph: {
                get: function () {
                    return this._glyph;
                },
                set: function (value) {
                    this._glyph = value;
                    this.element.querySelector(".touch-slideButton").innerText = this._glyph;
                }
            },
            toggleOn: {
                get: function () {
                    return this._toggleOn;
                },
                set: function (value) {
                    this._toggleOn = value;

                    if (this._toggleOn) {
                        WinJS.Utilities.addClass(this.element.querySelector(".touch-slideButton"), "touch-toggleOn");
                    } else {
                        WinJS.Utilities.removeClass(this.element.querySelector(".touch-slideButton"), "touch-toggleOn");
                    }
                }
            },
            extraClass: {
                get: function () {
                    return this._extraClass;
                },
                set: function (value) {
                    if (this._extraClass) {
                        WinJS.Utilities.removeClass(this.element, this.extraClass);
                    }
                    this._extraClass = value;
                    WinJS.Utilities.addClass(this.element, this._extraClass);
                }
            },
            slideBehavior: {
                get: function () {
                    return this._slideBehavior;
                },
                set: function (value) {
                    this._slideBehavior = value;

                    var slideButton = this.element.querySelector(".touch-slideButton");
                    this._initSlideBehavior(slideButton, value);

                }
            },
            slideDirection: {
                get: function () {
                    return this._slideDirection;
                },
                set: function (value) {
                    this._slideDirection = value;
                }
            },
            _createVisualTree: function () {
                this.element.innerHTML = '<div class="touch-slideButtonBox">'
                                 + '<button class="touch-slideButton"></button>'
                                 + '<div class="touch-slideButtonLabel"></div>'
                                  + '</div>';
            },
            _initSlideBehavior: function (slideButton, enabled) {
                var that = this;

                if (enabled) {
                    WinJS.Utilities.addClass(slideButton, "ManipulationElement");
                    slideButton.onmspointerdown = buttonDownHandler;
                    slideButton.onmsgesturechange = buttonTouchHandler;
                    slideButton.onmspointerup = buttonUpHandler;
                    slideButton.onmsinertiastart = onButtonInertiaStart;
                    slideButton.onmsgestureend = onButtonGestureEnd;
                } else {
                    WinJS.Utilities.removeClass(slideButton, "ManipulationElement");
                    slideButton.onmspointerdown = "";
                    slideButton.onmsgesturechange = "";
                    slideButton.onmspointerup = "";
                    slideButton.onmsinertiastart = "";
                    slideButton.onmsgestureend = "";
                }

                // What happens when someone puts their finger on the button
                function buttonDownHandler(eventObject) {
                    try {
                        var target = getManipulationElement(eventObject.target);
                        target.gestureObject.addPointer(eventObject.pointerId);
                        target.gestureObject.pointerType = eventObject.pointerType;
                        WinJS.Utilities.addClass(target, "touch-on");
                    } catch (e) {
                        debugger;
                    }
                }

                // What happens you move your finger on the button
                function buttonTouchHandler(eventObject) {
                    var target = getManipulationElement(eventObject.target);

                    switch (that.slideDirection)
                    {
                        case TouchControls.SlideButton.SlideDirection.up:

                            if (target.translationY + eventObject.translationY < -1 * that._commitThreshold) {
                                WinJS.Utilities.addClass(target, "touch-commit");
                            } else {
                                WinJS.Utilities.removeClass(target, "touch-commit");
                            }

                            if (target.translationY + eventObject.translationY <= 0 && target.translationY + eventObject.translationY > -1 * that._commitThreshold - 5) {
                                target.translationY += eventObject.translationY;
                                target.style.transform = "translateY(" + target.translationY + "px)";
                            }
                            break;
                        case TouchControls.SlideButton.SlideDirection.down:

                            if (target.translationY + eventObject.translationY < that._commitThreshold) {
                                WinJS.Utilities.removeClass(target, "touch-commit");
                            } else {
                                WinJS.Utilities.addClass(target, "touch-commit");
                            }

                            if (target.translationY + eventObject.translationY >= 0 && target.translationY + eventObject.translationY < that._commitThreshold + 5) {
                                target.translationY += eventObject.translationY;
                                target.style.transform = "translateY(" + target.translationY + "px)";
                            }
                            break;
                        case TouchControls.SlideButton.SlideDirection.left:
                            if (target.translationX + eventObject.translationX < -1 * that._commitThreshold) {
                                WinJS.Utilities.addClass(target, "touch-commit");
                            } else {
                                WinJS.Utilities.removeClass(target, "touch-commit");
                            }

                            if (target.translationX + eventObject.translationX <= 0 && target.translationX + eventObject.translationX > -1 * that._commitThreshold - 5) {
                                target.translationX += eventObject.translationX;
                                target.style.transform = "translateX(" + target.translationX + "px)";
                            }
                            break;
                        case TouchControls.SlideButton.SlideDirection.right:

                            if (target.translationX + eventObject.translationX < that._commitThreshold) {
                                WinJS.Utilities.removeClass(target, "touch-commit");
                            } else {
                                WinJS.Utilities.addClass(target, "touch-commit");
                            }

                            if (target.translationX + eventObject.translationX >= 0 && target.translationX + eventObject.translationX < that._commitThreshold + 5) {
                                target.translationX += eventObject.translationX;
                                target.style.transform = "translateX(" + target.translationX + "px)";
                            }
                            break;
                        default:
                            break;
                    }
                }

                function buttonUpHandler(e) {
                    var target = getManipulationElement(e.target);
                    WinJS.Utilities.removeClass(target, "touch-on");
                }

                function onButtonInertiaStart(e) {
                    var target = getManipulationElement(e.target);
                    target.gestureObject.stop(e.pointerId);
                };

                function onButtonGestureEnd(e) {
                    var target = getManipulationElement(e.target);
                    if (WinJS.Utilities.hasClass(target, "touch-commit")) {
                        that.dispatchEvent("slide");
                    }

                    WinJS.Utilities.removeClass(target, "touch-on");
                    WinJS.Utilities.removeClass(target, "touch-commit");

                    target.translationY = 0;
                    target.gestureObject.pointerType = null;
                    target.gestureObject.stop(e.pointerId);
                    target.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
                }
                function getManipulationElement(element) {
                    var retValue = element;
                    while (!WinJS.Utilities.hasClass(retValue, "ManipulationElement")) {
                        retValue = retValue.parentNode;
                    }

                    if (retValue.translationX === null || typeof retValue.translationX === "undefined") {
                        retValue.translationX = 0;
                    }

                    if (retValue.translationY === null || typeof retValue.translationY === "undefined") {
                        retValue.translationY = 0;
                    }

                    if (retValue.gestureObject === null || typeof retValue.gestureObject === "undefined") {
                        retValue.gestureObject = new MSGesture();
                        retValue.gestureObject.target = retValue;
                    }
                    return retValue;
                };
            }


        },{
            SlideDirection: {up: "up", down: "down", right: "right", left: "left" }
        });

    WinJS.Namespace.define("TouchControls", {
        SlideButton: slideButton,
    });

    WinJS.Class.mix(TouchControls.SlideButton,
        WinJS.Utilities.createEventProperties("slide"),
        WinJS.UI.DOMEventMixin);
})();