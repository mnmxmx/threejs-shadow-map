export default class Stats{
    constructor(){
        this.beginTime = ( performance || Date ).now();
        this.prevTime = this.beginTime;
        this.oldFps = 60;
        this.fps = 60;
        this.sec = 0;
        this.frames = 0;
    }

    begin () {
        this.beginTime = ( performance || Date ).now();
    }

    end () {
        this.frames ++;

        this.time = ( performance || Date ).now();


        if ( this.time >= this.prevTime + 1000 ) {
            this.oldFps = this.fps;
            this.fps = ( this.frames * 1000 ) / ( this.time - this.prevTime );

            this.prevTime = this.time;
            this.frames = 0;
            this.sec++;
        }
        return this.time;
    }

    update () {

        this.beginTime = this.end();

    }


}
