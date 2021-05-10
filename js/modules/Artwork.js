import common from "./Common";

export default class Artwork{
    constructor(props){
        this.props = props;
        this.init();
    }

    init(){
        common.init({
            $wrapper: this.props.$wrapper
        });

        this.loop();
    }

    resize(){
        common.resize();
    }

    update(){
        common.update();
    }

    loop(){
        this.update();

        window.requestAnimationFrame(this.loop.bind(this));
    }
}