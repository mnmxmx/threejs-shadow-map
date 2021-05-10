class EventBus{
    /**
     * Initialize a new event bus instance.
     */
    constructor(){
        this.bus = document.createElement('fakeelement');
    }

    /**
     * Add an event listener.
     */
    on(event, callback){
        this.bus.addEventListener(event, callback);
    }

    once(event, callback){
        var bus = this.bus;
        this.bus.addEventListener(event, function fn(){
            bus.removeEventListener(event, fn);
            callback.apply(this, arguments);
        })
    }

    /**
     * Remove an event listener.
     */
    off(event, callback){
        this.bus.removeEventListener(event, callback);
    }

    /**
     * Dispatch an event.
     */
    emit(event, detail){
        var customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, false, false, detail);
        this.bus.dispatchEvent(customEvent);
    }
}

export default new EventBus();