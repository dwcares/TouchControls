(function () {
    "use strict";

    /**************** Pull to Refresh *******************/
    var pullToRefresh = WinJS.Class.define(
        function Control_ctor(element, options) {
            this.element = element || document.createElement("div");
            element.winControl = this;

            // options defaults
            this._extraClass = "";
            this._pullBoxHeight = 80;
            this._pullHintLabel = "Pull to refresh";
            this._releaseHintLabel = "Release to refresh";
            this._refreshing = false;
            this._createVisualTree();
            this._initPullToRefreshBehavior();

            WinJS.UI.setOptions(this, options);
        }, {

            //Public members
            refreshing: {
                get: function () {
                    return this._refreshing;
                },
                set: function (value) {

                    if (this._refreshing && !value) {
                        // After the refresh, return to the default state
                        WinJS.Utilities.removeClass(this._outerScroller, "touch-loading");
                        this._outerScroller.disabled = false;

                        // Scroll back to the top of the list
                        this._scrollTo(this._outerScroller, this._pullBoxHeight)
                    } else if (!this._refreshing && value) {
                        WinJS.Utilities.addClass(this._outerScroller, "touch-loading");
                        this._outerScroller.disabled = true;
                        this._pullLabel.innerText = "Loading...";
                    }
                    this._refreshing = value;
                }
            },
            pullHintLabel: {
                get: function () {
                    return this._pullHintLabel;
                },
                set: function (value) {
                    this._pullHintLabel = value;

                    if (!this.refreshing) {
                        this._pullLabel.innerText = this._pullHintLabel;
                    }
                }
            },
            releaseHintLabel: {
                get: function () {
                    return this._releaseHintLabel;
                },
                set: function (value) {
                    this._releaseHintLabel = value;

                    if (!this.refreshing) {
                        this.element.querySelector(".touch-pullLabel").innerText = this._releaseHintLabel;
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
            _createVisualTree: function () {
                var contentToAdd = '<div class="touch-outer">'
                            + '<div class="touch-pullBox">'
                            + '<progress class="touch-pullProgress win-ring"></progress>'
                            + '<div class="touch-pullArrow"></div>'
                            + '<div class="touch-pullLabel"></div></div>'
                            + '<div class="touch-inner"></div></div>';

                this.element.insertAdjacentHTML('beforeend', contentToAdd);

                this._outerScroller = this.element.querySelector(".touch-outer");
                this._innerScroller = this.element.querySelector(".touch-inner");
                this._pullLabel = this.element.querySelector(".touch-pullLabel");
                this._pullArrow = this.element.querySelector(".touch-pullArrow");

                while (this.element.firstChild !== this._outerScroller) {
                    this._innerScroller.appendChild(this.element.firstChild);
                }

            },
            _initPullToRefreshBehavior: function () {
                var that = this;
                var MS_MANIPULATION_STATE_ACTIVE = 1; // A contact is touching the surface and interacting with content
                var MS_MANIPULATION_STATE_INERTIA = 2; // The content is still moving, but contact with the surface has ended 
                var _outerScroller = this._outerScroller;
                var _pullLabel = this._pullLabel;
                var _pullArrow = this._pullArrow;

                _outerScroller.scrollTop = this._pullBoxHeight;
                _outerScroller.addEventListener("scroll", onScroll);
                _outerScroller.addEventListener("MSManipulationStateChanged", onManipualationStateChanged);

                function onScroll(e) {
                    var rotationAngle = 180 * ((that._pullBoxHeight - _outerScroller.scrollTop) / that._pullBoxHeight) + 90;
                    _pullArrow.style.transform = "rotate(" + rotationAngle + "deg)";

                    // Change the label once you pull to the top
                    if (_outerScroller.scrollTop === 0) {
                        _pullLabel.innerText = that._releaseHintLabel;
                    } else {
                        _pullLabel.innerText = that._pullHintLabel;
                    }
                };

                function handlePromise(promise) {
                    promise.then(function () {
                        that.refreshing = false;
                    });
                }

                function onManipualationStateChanged(e) {
                    // Check to see if they lifted while pulled to the top
                    if (e.currentState == MS_MANIPULATION_STATE_INERTIA &&
                        e.lastState == MS_MANIPULATION_STATE_ACTIVE &&
                        _outerScroller.scrollTop === 0) {

                        that.refreshing = true;
                        that.dispatchEvent("refresh", { setPromise: handlePromise });
                    }
                };
            },
            _scrollTo: function (element, position) {
                if (element.msZoomTo) {
                    element.msZoomTo({
                        contentX: 0,
                        contentY: position,
                        viewportX: 0,
                        viewportY: 0
                    });
                } else {
                    element.scrollTop = position;
                }
            }
        }, {
        });

    /**************** Slide Button *******************/
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

                  switch (that.slideDirection) {
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


      }, {
          SlideDirection: { up: "up", down: "down", right: "right", left: "left" }
      });


    /**************** GamePad *******************/
    var gamePad = WinJS.Class.define(
        function Control_ctor(element, options) {
            this.element = element || document.createElement("canvas");
            element.winControl = this;

            // options defaults
            this._leftControllerMode = TouchControls.GamePad.ControllerMode.controller;
            this._rightControllerMode = TouchControls.GamePad.ControllerMode.controller;
            this._leftController = { pressed: false, position: { x: 0, y: 0 } };
            this._rightController = { pressed: false, position: { x: 0, y: 0 } };
            this._leftControllerOpacity = 1;
            this._rightControllerOpacity = 1;
            this._leftControllerColor = "cyan";
            this._rightControllerColor = "cyan";

            this._leftTouchPoint = { x: 0, y: 0 };
            this._rightTouchPoint = { x: 0, y: 0 };
            this._leftTouchStartPoint = { x: 0, y: 0 };
            this._rightTouchStartPoint = { x: 0, y: 0 };

            this._initGamePad();

            WinJS.UI.setOptions(this, options);
        }, {

            leftControllerMode: {
                get: function () {
                    return this._leftControllerMode;
                },
                set: function (value) {
                    this._leftControllerMode = value;
                }
            },

            rightControllerMode: {
                get: function () {
                    return this._rightControllerMode;
                },
                set: function (value) {
                    this._rightControllerMode = value;
                }
            },

            leftControllerOpacity: {
                get: function () {
                    return this._leftControllerOpacity;
                },
                set: function (value) {
                    this._leftControllerOpacity = value;
                }
            },

            rightControllerOpacity: {
                get: function () {
                    return this._rightControllerOpacity;
                },
                set: function (value) {
                    this._rightControllerOpacity = value;
                }
            },

            leftControllerColor: {
                get: function () {
                    return this._leftControllerColor;
                },
                set: function (value) {
                    this._leftControllerColor = value;
                }
            },

            rightControllerColor: {
                get: function () {
                    return this._rightControllerColor;
                },
                set: function (value) {
                    this._rightControllerColor = value;
                }
            },

            leftController: {
                get: function () {
                    return this._leftController;
                }
            },

            rightController: {
                get: function () {
                    return this._rightController;
                }
            },

            draw: function () {
                this._drawLeftThumb();
                this._drawRightThumb();
            },

            _drawLeftThumb: function () {
                if (this.leftControllerMode !== TouchControls.GamePad.ControllerMode.none
                    && this._leftController.pressed) {
                    var tempAlpha = this._ctx.globalAlpha;
                    this._ctx.globalAlpha = this._leftControllerOpacity;
                    this._ctx.beginPath();
                    this._ctx.strokeStyle = this._leftControllerColor;
                    this._ctx.lineWidth = 2;
                    this._ctx.arc(this._leftTouchStartPoint.x, this._leftTouchStartPoint.y, 40, 0, Math.PI * 2, true);
                    this._ctx.stroke();
                    this._ctx.beginPath();
                    this._ctx.strokeStyle = this._leftControllerColor;
                    this._ctx.arc(this._leftTouchStartPoint.x, this._leftTouchStartPoint.y, 60, 0, Math.PI * 2, true);
                    this._ctx.stroke();
                    this._ctx.beginPath();
                    this._ctx.fillStyle = this._leftControllerColor;
                    this._ctx.arc(this._leftTouchPoint.x, this._leftTouchPoint.y, 40, 0, Math.PI * 2, true);
                    this._ctx.fill();
                    this._ctx.globalAlpha = tempAlpha;
                }
            },

            _drawRightThumb: function () {
                if (this.rightControllerMode !== TouchControls.GamePad.ControllerMode.none
                    && this._rightController.pressed) {
                    var tempAlpha = this._ctx.globalAlpha;
                    this._ctx.globalAlpha = this._rightControllerOpacity;
                    this._ctx.beginPath();
                    this._ctx.strokeStyle = this._rightControllerColor;
                    this._ctx.lineWidth = 2;
                    this._ctx.arc(this._rightTouchStartPoint.x, this._rightTouchStartPoint.y, 40, 0, Math.PI * 2, true);
                    this._ctx.stroke();
                    this._ctx.beginPath();
                    this._ctx.strokeStyle = this._rightControllerColor;
                    this._ctx.arc(this._rightTouchStartPoint.x, this._rightTouchStartPoint.y, 60, 0, Math.PI * 2, true);
                    this._ctx.stroke();
                    this._ctx.beginPath();
                    this._ctx.fillStyle = this._rightControllerColor;
                    this._ctx.arc(this._rightTouchPoint.x, this._rightTouchPoint.y, 40, 0, Math.PI * 2, true);
                    this._ctx.fill();
                    this._ctx.globalAlpha = tempAlpha;
                }
            },
            _initGamePad: function () {
                var that = this;

                if (this.element.tagName.toLowerCase() !== "canvas") {
                    throw "Element must be a canvas";
                }

                var canvas = this.element;
                this._ctx = canvas.getContext('2d')
                var halfWidth, halfHeight;

                halfWidth = canvas.width / 2;
                halfHeight = canvas.height / 2;
                canvas.addEventListener('MSPointerDown', onTouchStart, false);
                canvas.addEventListener('MSPointerMove', onTouchMove, false);
                canvas.addEventListener('MSPointerUp', onTouchEnd, false);
                canvas.addEventListener('resize', canvasResize, false);

                function onTouchStart(e) {
                    if (e.pointerType === 2) {
                        if ((e.clientX < halfWidth) && that._leftControllerMode !== TouchControls.GamePad.ControllerMode.none) {
                            that._leftTouchStartPoint = { x: e.clientX, y: e.clientY };
                            that._leftTouchPoint = { x: e.clientX, y: e.clientY };
                            that._leftController.pressed = true;
                        } else if (that._rightControllerMode !== TouchControls.GamePad.ControllerMode.none) {
                            that._rightTouchStartPoint = { x: e.clientX, y: e.clientY };
                            that._rightTouchPoint = { x: e.clientX, y: e.clientY };
                            that._rightController.pressed = true;
                        }
                    }
                }

                function onTouchMove(e) {
                    if (e.pointerType === 2) {
                        if ((e.clientX < halfWidth) && that._leftControllerMode === TouchControls.GamePad.ControllerMode.controller) {
                            that._leftTouchPoint = { x: e.clientX, y: e.clientY };
                            that._leftController.position = { x: e.clientX - that._leftTouchStartPoint.x, y: e.clientY - that._leftTouchStartPoint.y };
                        } else if (that._rightControllerMode === TouchControls.GamePad.ControllerMode.controller) {
                            that._rightTouchPoint = { x: e.clientX, y: e.clientY };
                            that._rightController.position = { x: e.clientX - that._rightTouchStartPoint.x, y: e.clientY - that._rightTouchStartPoint.y };
                        }
                    }
                }

                function onTouchEnd(e) {
                    if (e.pointerType === 2) {
                        if ((e.clientX < halfWidth) && that._leftControllerMode !== TouchControls.GamePad.ControllerMode.none) {
                            that._leftTouchPoint = { x: that._leftTouchStartPoint.x, y: that._leftTouchStartPoint.y };
                            that._leftController.position = { x: 0, y: 0 };
                            that._leftController.pressed = false;
                        } else if (that._rightControllerMode !== TouchControls.GamePad.ControllerMode.none) {
                            that._rightTouchPoint = { x: that._rightTouchStartPoint.x, y: that._rightTouchStartPoint.y };
                            that._rightController.position = { x: 0, y: 0 };
                            that._rightController.pressed = false;
                        }
                    }
                }

                function canvasResize() {
                    halfWidth = canvas.width / 2;
                    halfHeight = canvas.height / 2;
                }
            }
        }, {
            ControllerMode: { controller: "controller", button: "button", none: "none" }
        });

    WinJS.Namespace.define("TouchControls", {
        PullToRefresh: pullToRefresh,
        SlideButton: slideButton,
        GamePad: gamePad
    });

    WinJS.Class.mix(TouchControls.SlideButton,
        WinJS.Utilities.createEventProperties("slide"),
        WinJS.UI.DOMEventMixin);

    WinJS.Class.mix(TouchControls.PullToRefresh,
        WinJS.Utilities.createEventProperties("refresh"),
        WinJS.UI.DOMEventMixin);

})();
