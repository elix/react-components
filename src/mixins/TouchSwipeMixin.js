import Symbol from './Symbol';


const deltaXSymbol = Symbol('deltaX');
const deltaYSymbol = Symbol('deltaY');
const multiTouchSymbol = Symbol('multiTouch');
const previousXSymbol = Symbol('previousX');
const previousYSymbol = Symbol('previousY');
const startXSymbol = Symbol('startX');


export default function TouchSwipeMixin(Base) {
  return class TouchSwipe extends Base {

    constructor(props) {
      super(props);

      this.state = Object.assign({}, this.state, {
        swipeFraction: null
      });

      // In all touch events, only handle single touches. We don't want to
      // inadvertently do work when the user's trying to pinch-zoom for example.
      // TODO: Even better approach than below would be to ignore touches after
      // the first if the user has already begun a swipe.
      // TODO: Handle Pointer events. Since React doesn't appear to support
      // them, we'll probably need to wire those up ourselves.
      this.touchEvents = {
        onTouchStart: this.touchStart.bind(this),
        onTouchMove: this.touchMove.bind(this),
        onTouchEnd: this.touchEnd.bind(this)
      };
    }

    componentWillReceiveProps(props) {
      if (super.componentWillReceiveProps) { super.componentWillReceiveProps(props); }
      if (typeof props.swipeFraction !== 'undefined' && this.state.swipeFraction !== props.swipeFraction) {
        this.setState({
          swipeFraction: props.swipeFraction
        });
      }
    }

    get defaults() {
      return Object.assign({}, super.defaults, {
        touchAction: 'none'
      });
    }

    rootProps() {
      const base = super.rootProps ? super.rootProps() : {};
      const style = Object.assign({}, base.style, {
        touchAction: this.props.touchAction || this.defaults.touchAction
      });
      return Object.assign({}, base, this.touchEvents, { style });
    }

    get swipeTarget() {
      return this.root;
    }

    touchEnd(event) {
      if (event.touches.length === 0) {
        // All touches removed; gesture is complete.
        const clientX = event.changedTouches[0].clientX;
        const clientY = event.changedTouches[0].clientY;
        gestureEnd(this, clientX, clientY);
      }
    }

    touchMove(event) {
      if (event.touches.length === 1) {
        const clientX = event.changedTouches[0].clientX;
        const clientY = event.changedTouches[0].clientY;
        const handled = gestureMove(this, clientX, clientY);
        if (handled) {
          event.preventDefault();
        }
      }
    }

    touchStart(event) {
      if (event.touches.length === 1) {
        const clientX = event.changedTouches[0].clientX;
        const clientY = event.changedTouches[0].clientY;
        gestureStart(this, clientX, clientY);
      }
    }

    updateSwipeFraction(swipeFraction) {
      const changed = this.state.swipeFraction !== swipeFraction;
      if (changed) {
        if (this.props.onSwipeFractionChanged) {
          this.props.onSwipeFractionChanged(swipeFraction);
        } else {
          this.setState({ swipeFraction });
        }
      }
      return changed;
    }

  }
}


// Return true if the pointer event is for the pen, or the primary touch point.
function isEventForPenOrPrimaryTouch(event) {
  return event.pointerType === 'pen' ||
    (event.pointerType === 'touch' && event.isPrimary);
}

/*
 * Invoked when the user has finished a touch operation.
 */
function gestureEnd(component, clientX, clientY) {

  let gesture;
  // TODO: Make flick gesture use timing instead of just distance so that it
  // works better on Android.
  if (component[deltaXSymbol] >= 20) {
    // Finished going right at high speed.
    gesture = 'swipeRight';
  } else if (component[deltaXSymbol] <= -20) {
    // Finished going left at high speed.
    gesture = 'swipeLeft';
  } else {
    // Finished at low speed.
    const swipeFraction = getSwipeFraction(component, clientX);
    if (swipeFraction >= 0.5) {
      gesture = 'swipeLeft';
    } else if (swipeFraction <= -0.5) {
      gesture = 'swipeRight';
    }
  }

  component[deltaXSymbol] = null;
  component[deltaYSymbol] = null;

  // If component has method for indicated gesture, invoke it.
  if (component[gesture]) {
    component[gesture]();
  }

  component.updateSwipeFraction(null);
}

/*
 * Invoked when the user has moved during a touch operation.
 */
function gestureMove(component, clientX, clientY) {
  component[deltaXSymbol] = clientX - component[previousXSymbol];
  component[deltaYSymbol] = clientY - component[previousYSymbol];
  component[previousXSymbol] = clientX;
  component[previousYSymbol] = clientY;
  if (Math.abs(component[deltaXSymbol]) > Math.abs(component[deltaYSymbol])) {
    // Move was mostly horizontal.
    const swipeFraction = getSwipeFraction(component, clientX);
    component.updateSwipeFraction(swipeFraction);
    // Indicate that the event was handled. It'd be nicer if we didn't have
    // to do this so that, e.g., a user could be swiping left and right
    // while simultaneously scrolling up and down. (Native touch apps can do
    // that.) However, Mobile Safari wants to handle swipe events near the
    // page and interpret them as navigations. To avoid having a horiziontal
    // swipe misintepreted as a navigation, we indicate that we've handled
    // the event, and prevent default behavior.
    return true;
  } else {
    // Move was mostly vertical.
    return false; // Not handled
  }
}

/*
 * Invoked when the user has begun a touch operation.
 */
function gestureStart(component, clientX, clientY) {
  component[startXSymbol] = clientX;
  component[previousXSymbol] = clientX;
  component[previousYSymbol] = clientY;
  component[deltaXSymbol] = 0;
  component[deltaYSymbol] = 0;
  component.updateSwipeFraction(0);
}

function getSwipeFraction(component, x) {
  const width = component.swipeTarget.offsetWidth;
  const dragDistance = component[startXSymbol] - x;
  const fraction = width > 0 ?
    dragDistance / width :
    0;
  return fraction;
}
