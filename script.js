gsap.registerPlugin(ScrollTrigger);
//////////////////////////////////////////////////////
// LENIS
//////////////////////////////////////////////////////
const lenis = new Lenis({
    duration: 1.2,
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
//////////////////////////////////////////////////////
// THREE JS
//////////////////////////////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("webgl").appendChild(renderer.domElement);
//////////////////////////////////////////////////////
// PARTICLES
//////////////////////////////////////////////////////
const particlesGeometry = new THREE.BufferGeometry();
const count = 4000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 60;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xCBFF4D,
    size: 0.03,
    transparent: true,
    opacity: 0.8
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
//////////////////////////////////////////////////////
// SCROLL CAMERA
//////////////////////////////////////////////////////
gsap.to(camera.position, {
    z: -30,
    scrollTrigger: {
        trigger: ".content",
        start: "top top",
        end: "+=6000",
        scrub: 1
    }
});
//////////////////////////////////////////////////////
// MOUSE PARALLAX
//////////////////////////////////////////////////////
window.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth - 0.5);
    let y = (e.clientY / window.innerHeight - 0.5);
    gsap.to(camera.rotation, {
        y: x * 0.3,
        x: y * 0.3,
        duration: 1,
        ease: "power2.out"
    });
});
//////////////////////////////////////////////////////
// ESTADO INICIAL LOGO + PRELOAD
//////////////////////////////////////////////////////
gsap.set("#logo-fixed", {
    opacity: 0
});
gsap.set("#header-ui", {
    opacity: 0
});
gsap.set("#logo-container", {
    scale: 0.8
});
gsap.set("#letter-W", {
    y: -750,
    opacity: 0
});
gsap.set("#letter-I", {
    y: -750,
    opacity: 0
});
gsap.set("#letter-H", {
    y: 750,
    opacity: 0
});
gsap.set("#preloader-fill", {
    width: "0%"
});
gsap.set("#logo-bg", {
    opacity: 1
});
//////////////////////////////////////////////////////
// TIMELINE MASTER (PRELOAD + LOGO SINCRONIZADOS)
//////////////////////////////////////////////////////
const introTimeline = gsap.timeline({
    paused: true
});
// PROGRESS BAR
introTimeline.to("#preloader-fill", {
    width: "100%",
    duration: 3,
    ease: "power1.out"
}, 0);
// LETRAS W e I entram DURANTE preload
introTimeline.to(["#letter-W", "#letter-I"], {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.15
}, 0.4);
// H entra DURANTE preload
introTimeline.to("#letter-H", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
}, 0.9);
// SCALE FINAL
introTimeline.to("#logo-container", {
    scale: 1,
    duration: 0.8,
    ease: "elastic.out(1,0.5)"
}, 1.6);
// FADE PRELOADER BAR
introTimeline.to("#preloader", {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
}, 2.5);
// FADE FUNDO COMPLETO
introTimeline.to("#logo-bg", {
    opacity: 0,
    duration: 1,
    ease: "power4.inOut"
}, 2.7);
// SHOW UI
introTimeline.to("#header-ui", {
    opacity: 1,
    duration: 1,
    ease: "power2.out"
}, 2.9);
introTimeline.to("#logo-fixed", {
    opacity: 1,
    duration: 1,
    ease: "power2.out"
}, 2.9);
// REMOVE BG COMPLETAMENTE
introTimeline.set("#logo-bg", {
    display: "none"
});
//////////////////////////////////////////////////////
// START TIMELINE NO LOAD
//////////////////////////////////////////////////////
window.addEventListener("load", () => {
    introTimeline.play();
});
//////////////////////////////////////////////////////
// TEXT CINEMATIC
//////////////////////////////////////////////////////
const panels = document.querySelectorAll(".panel");
let masterTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".content",
        start: "top top",
        end: "+=6000",
        scrub: 1,
        pin: true
    }
});
panels.forEach(panel => {
    const lines = panel.querySelectorAll(".line");
    const tl = gsap.timeline();
    tl.fromTo(lines, {
        y: 120,
        opacity: 0,
        filter: "blur(15px)"
    }, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        stagger: 0.15,
        ease: "power3.out"
    });
    tl.to(lines, {
        y: -120,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        stagger: 0.1,
        ease: "power3.in"
    }, "+=1.2");
    masterTimeline.add(tl);
});
//////////////////////////////////////////////////////
// RENDER LOOP
//////////////////////////////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0007;
    particles.rotation.x += 0.0002;
    renderer.render(scene, camera);
}
animate();
//////////////////////////////////////////////////////
// RESIZE
//////////////////////////////////////////////////////
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});