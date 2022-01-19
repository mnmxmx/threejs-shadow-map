import Artwork from "./modules/Artwork";


const $wrapper = document.getElementById("webgl-container");

$wrapper.style.position = "fixed";
$wrapper.style.top = 0;
$wrapper.style.left = 0;
$wrapper.style.right = 0;
$wrapper.style.bottom = 0;


const artwork = new Artwork({
    $wrapper: $wrapper
});

window.addEventListener("resize", () => {
    artwork.resize();
});



