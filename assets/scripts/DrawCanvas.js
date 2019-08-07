
cc.Class({
    extends: cc.Component,

    properties: {
        gestureMgr: require('GestureMgr'),
        drawNode: cc.Graphics,
        resultLab: cc.Label,
        accuracy: 10
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.path = [];
        this.basetime = null;
    },

    getTouchPoint(event) {
        let point = event.getLocation();
        return this.node.convertToNodeSpaceAR(point);
    },

    addPoint(x, y) {
        let t = Date.now() - this.basetime;
        let w = cc.winSize.width, h = cc.winSize.height;
        x = x/w, y = (h-y)/h;
        let point = this.gestureMgr.newPoint(x, y, t);
        this.path.push(point);
    },

    onTouchStart(event) {
        event.stopPropagation();
        this.drawNode.clear();
        let touch = this.getTouchPoint(event);
        let [x, y] = [touch.x, touch.y];
        this.drawNode.moveTo(x, y);
        
        this.path = [];
        this.basetime = Date.now();
        this.addPoint(x, y);
    },

    onTouchMove(event) {
        event.stopPropagation();
        let touch = this.getTouchPoint(event);
        let [x, y] = [touch.x, touch.y];
        
        this.drawNode.lineTo(x, y);
        this.drawNode.stroke();
        this.drawNode.moveTo(x, y);

        this.addPoint(x, y);
    },

    onTouchEnd(event) {
        event.stopPropagation();
        this.basetime = null;
        let gesture = this.gestureMgr.newGesture(this.path);
        let result = this.gestureMgr.recognize(gesture);
        this.resultLab.string = result;
    },
    
});
