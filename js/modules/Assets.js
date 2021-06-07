import * as THREE from "libs/three.module.js"
import EventBus from "../utils/EventBus";

class Assets{
    constructor(){
        this.textures = {
        }

        this.shapes = {
        }

        this.illusts = [];

        this.total = 0;
        this.count = 0;
        this.countTotal(this.textures);
        this.countTotal(this.shapes);

    }

    countTotal(obj){
        for(let key in obj){
            this.total++;
        }
    }
    compLoad(){
        this.count++;
        EventBus.emit("COUNT_LOADING", {
            progress: this.count / this.total
        });
        if(this.count == this.total){
            // .log(this.illusts);
            EventBus.emit("FINISH_LOADING");
        }
    }

    load(){
        this.loadShapes();
        this.loadTextures();
    }

    loadShapes(){
    }

    loadTextures(){
        for(let key in this.textures){
            const data = this.textures[key];
            const loader = new THREE.TextureLoader();
            loader.load(data.src, (texture) => {
                data.value = texture;
                this.compLoad();
            });
        }
    }
}

export default new Assets();