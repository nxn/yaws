// In order to be compatible with inferno's linkEvent function the first argument of the received click handlers has to
// be treated as data that was linked to the event. In cases where linkEvent was not used and there is no associated
// data, the event argument will be undefined and the actual PointerEvent object will be stored in the data argument.
export function createPointerDoubleClickHandler<T, E extends PointerEvent>(
    onClick:    (data: T, event?: E) => any, 
    onDblClick: (data: T, event?: E) => any,
    dblClickTime = 500
) {
    let click = Date.now();
    let timeout = -1;
    let target: any;

    return (data: T, eventArg?: any) => {
        // As mentioned above, some gymnastics are necessary to be compatible with inferno's linkEvent function while
        // also handling cases where there might not be any data corresponding to this event. In the case of the latter,
        // the @data argument will actually store the event object needed for dispatching the correct handler. In both
        // circumstances the eventArgs reference should remain unaltered so that it can be passed to the handlers
        // exactly as it was received here.
        let event = eventArg;
        if (!event && data instanceof PointerEvent) {
            event = data;
        }

        if (!event) { return true; }

        event.preventDefault();
        if (event.pointerType === "touch") {
            return false;
        }

        let now = Date.now();
        if (now - click < dblClickTime && event.target === target) {
            clearTimeout(timeout);
            target = null;
            onDblClick(data, eventArg);
            return false;
        }

        click = now;
        target = event.target;
        timeout = setTimeout(() => onClick(data, eventArg), dblClickTime);

        return false;
    }
}