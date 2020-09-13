// This function provides a workaround to problems stemming from TouchEvent.preventDefault() failing to consistantly
// stop touch inputs from turning into mouse related events. Using the PointerEvent APIs is necessary because it is the
// only reliable way to determine whether the source of an event is a touch input or not. Since the goal is to 
// completely prevent touch based inputs from involuntarily triggering mouse events, the fact PointerEvents have poor
// mobile support isn't a concern since doing nothing in these cases is the intended result. The only remaining problem
// is Safari on the desktop where mouse functionality will no longer fully work as intended, but I have no means of
// developing or testing a solution to this.

// Moving on, in order to be compatible with inferno's linkEvent function the first argument of the received click 
// handlers has to be treated as a data object that was linked to the event. In cases where linkEvent was not used and 
// there is no associated data, the event argument will be undefined and the actual PointerEvent object will be stored
// in the data argument.
export function createPointerDoubleClickHandler<T, E extends PointerEvent>(
    onClick:    (data: T, event?: E) => any, 
    onDblClick: (data: T, event?: E) => any,
    doubleClickTime = 500,
    singleClickDelay = doubleClickTime/2
) {
    let click = Date.now();
    let timeout = -1;
    let target: any;

    return (data: T, eventArg?: any) => {
        // As mentioned above, some gymnastics are necessary to be compatible with inferno's linkEvent function while
        // also handling cases where there might not be any data corresponding to this event. In the case of the latter,
        // the @data argument will actually store the event object needed for dispatching the correct handler. In both
        // circumstances the eventArgs reference should remain unaltered so that it can be passed to the handlers
        // unaltered and exactly as it was received here.
        let event = eventArg;
        if (!event && data instanceof PointerEvent) {
            event = data;
        }

        if (!event) { return true; }

        event.preventDefault();
        if (event.pointerType === "touch") {
            return false;
        }

        // Since there is no double click PointerEvent, discerning the proper handler has to be performed manually.
        let now = Date.now();
        if (event.target === target && now - click < doubleClickTime) {
            clearTimeout(timeout);
            target = undefined;
            onDblClick(data, eventArg);
            return false;
        }

        click = now;
        target = event.target;

        // Adds a small delay before executing the single click handler, if another click is performed within this time
        // interval the single click handler will not be executed at all. The default double click time interval is 
        // fairly large for ease/accessiblity reasons, but waiting the full amount of time before determining which
        // handler to execute makes the UI feel unresponsive. In cases where it is acceptable to execute both actions it
        // is better to lower or even completely remove this interval so that the UI responds immediately to user input.
        timeout = setTimeout(() => { onClick(data, eventArg); }, singleClickDelay);

        return false;
    }
}