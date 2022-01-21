import common from "./Common";

import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import vertexShader from "./glsl/obj.vert";
import fragmentShader from "./glsl/obj.frag"
import shadowFragmentShader from "./glsl/shadow.frag";

import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

export default class Artwork{
    constructor(props){
        this.props = props;
        this.init();
    }

    init(){
        common.init({
            $wrapper: this.props.$wrapper
        });

        this.scene = new THREE.Scene();
        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.group.position.y = -10;
        this.meshProps = [];
        this.helpers = [];

        this.camera = new THREE.PerspectiveCamera(45, common.dimensions.x / common.dimensions.y, 1, 10000);
        this.camera.position.set(90, 60, 90).multiplyScalar(2);
        this.camera.lookAt(this.scene.position);
        this.controls = new OrbitControls(this.camera, common.renderer.domElement);

        this.intensity_0 = new THREE.Vector4(1, 0, 0, 0);

        this.createLight();
        this.createMesh();
        this.createControls();

        this.loop();
    }

    createControls(){
        this.params = {
            depthmapViewer: common.isMobile ? false : true,
            visibleShadowCamera: true,
            output: "color shading"
        }

        this.gui = new GUI();
        this.gui.add(this.params, "depthmapViewer").onChange((value) => {
            this.depthViewer.enabled = value;
        });
        this.gui.add(this.params, "visibleShadowCamera");
        this.gui.add(this.params, "output", [
            "color shading",
            "shadow * lighting",
            "shadow",
            "lighting",
        ]).onChange((value) => {
            this.intensity_0.set(0, 0, 0, 0);

            switch(value){
                case "color shading": 
                    this.intensity_0.x = 1;
                    break;
                case "shadow * lighting":
                    this.intensity_0.y = 1;
                    break;
                case "shadow":
                    this.intensity_0.z = 1;
                    break;
                case "lighting":
                    this.intensity_0.w = 1;
                    break;
            }
        });
    }

    createMesh(){
        this.createGround();
        const sphere_s = this.createObj(new THREE.SphereGeometry(10, 32, 32), 0xFAF3F3);
        sphere_s.position.set(20, 10, 0);

        const cylinder = this.createObj(new THREE.CylinderGeometry( 10, 10, 40, 32 ), 0xFAF3F3);
        cylinder.position.set(-20, 20, 40);

        const sphere = this.createObj(new THREE.SphereGeometry(24, 32, 32), 0xFAF3F3);
        sphere.position.set(-20, 24, 0);

        const box = this.createObj(new THREE.BoxGeometry(20, 20, 20), 0xFAF3F3);
        box.position.set(40, 10, -30);

        const cone = this.createObj(new THREE.ConeGeometry( 20, 30, 32 ), 0xFAF3F3)
        cone.position.set(37, 15, 25);
    }

    createLight(){
        this.light = new THREE.DirectionalLight( 0xffffff, 1.0 );
        this.light.position.set(-60, 50, 40);


        this.scene.add(this.light);

        const lightHelper = new THREE.DirectionalLightHelper( this.light, 5 );
        this.scene.add(lightHelper);

        this.helpers.push(lightHelper);

        this.frustumSize = 200;

        this.shadowCamera = this.light.shadow.camera = new THREE.OrthographicCamera(
            -this.frustumSize / 2,
            this.frustumSize / 2,
            this.frustumSize / 2,
            -this.frustumSize / 2,
            1,
            200
        );

        this.scene.add(this.shadowCamera);
        this.shadowCamera.position.copy(this.light.position);
        this.shadowCamera.lookAt(this.scene.position);

        this.light.shadow.mapSize.x = 2048;
        this.light.shadow.mapSize.y = 2048;

        var pars = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };
        this.light.shadow.map = new THREE.WebGLRenderTarget( this.light.shadow.mapSize.x, this.light.shadow.mapSize.y, pars );

        const shadowCameraHelper = new THREE.CameraHelper( this.shadowCamera );
        this.scene.add( shadowCameraHelper );

        this.helpers.push(shadowCameraHelper);
        

        this.depthViewer = new ShadowMapViewer(this.light);
        this.depthViewer.size.set( 300, 300 );
        if(common.isMobile) this.depthViewer.enabled = false;
    }

    createGround(){
        const geometry = new THREE.BoxGeometry(250, 250, 250);
        // geometry.rotateX(-Math.PI / 2);

        const {material, shadowMaterial} = this.createMaterial(0xE1E5EA, vertexShader, fragmentShader);

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.y -= 125;

        this.meshProps.push({
            mesh: mesh,
            material: material,
            shadowMaterial: shadowMaterial,
        });

        this.group.add(mesh);
    }

    createObj(geometry, color){

        const {material, shadowMaterial} = this.createMaterial(color, vertexShader, fragmentShader);


        const mesh = new THREE.Mesh(geometry, material);
        this.group.add(mesh);

        this.meshProps.push({
            mesh,
            material,
            shadowMaterial,
        });

        return mesh;
    }

    createMaterial(color, vertexShader, fragmentShader){
        const uniforms = {
            uTime: {
                value: 0
            },
            uColor: {
                value: new THREE.Color(color)
            },
            uLightPos: {
                value: this.light.position
            },
            uDepthMap: {
                value: this.light.shadow.map.texture
            },
            uShadowCameraP: {
                value: this.shadowCamera.projectionMatrix
            },
            uShadowCameraV: {
                value: this.shadowCamera.matrixWorldInverse
            },
            uIntensity_0: {
                value: this.intensity_0
            },
        }
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
        });

        const shadowMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: shadowFragmentShader,
            uniforms,
            // side: THREE.BackSide
        });

        return {material, shadowMaterial}
    }

    resize(){
        common.resize();

        this.camera.aspect = common.dimensions.x / common.dimensions.y;
        this.camera.updateProjectionMatrix();

        this.depthViewer.updateForWindowResize();
    }

    updateLight(){
        let x = this.light.position.x;
        let z = this.light.position.z;

        const s = Math.sin(common.delta * 0.2);
        const c = Math.cos(common.delta * 0.2);

        const nx = x * c - z * s;
        const nz = x * s + z * c;

        this.light.position.x = nx;
        this.light.position.z = nz;

        this.shadowCamera.position.copy(this.light.position);
        this.shadowCamera.lookAt(this.scene.position);
    }

    update(){
        common.update();

        this.updateLight();
        
        for(let i = 0; i < this.meshProps.length; i++){
            const meshProps = this.meshProps[i];
            meshProps.mesh.material = meshProps.shadowMaterial;
        }

        for(let i = 0; i < this.helpers.length; i++){
            this.helpers[i].visible = false;
        }

        common.renderer.setRenderTarget(this.light.shadow.map);
        common.renderer.render(this.scene, this.shadowCamera);

        for(let i = 0; i < this.meshProps.length; i++){
            const meshProps = this.meshProps[i];
            meshProps.mesh.material = meshProps.material;
        }

        if(this.params.visibleShadowCamera){
            for(let i = 0; i < this.helpers.length; i++){
                this.helpers[i].visible = true;
            }
        }

        common.renderer.setRenderTarget(null);
        common.renderer.render(this.scene, this.camera);

        this.depthViewer.render( common.renderer );
    }

    loop(){
        this.update();
        window.requestAnimationFrame(this.loop.bind(this));
    }
}