gsap.registerPlugin(ScrollTrigger);

//////////////////////////////////////////////////////
// LENIS SMOOTH SCROLL
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

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

//////////////////////////////////////////////////////
// THREE JS SETUP
//////////////////////////////////////////////////////
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

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

particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
    color: 0xCBFF4D,
    size: 0.03,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(
    particlesGeometry,
    particlesMaterial
);

scene.add(particles);

//////////////////////////////////////////////////////
// CAMERA SCROLL MOVEMENT
//////////////////////////////////////////////////////
gsap.to(camera.position, {
    z: -30,
    ease: "none",
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

    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    gsap.to(camera.rotation, {
        y: x * 0.3,
        x: y * 0.3,
        duration: 1,
        ease: "power2.out"
    });

});

//////////////////////////////////////////////////////
// INITIAL STATES
//////////////////////////////////////////////////////
gsap.set("#logo-fixed", { opacity: 0 });
gsap.set("#header-ui", { opacity: 0 });
gsap.set("#scroll-indicator", { opacity: 0, y: 20 });

gsap.set("#logo-container", { scale: 0.8 });

gsap.set("#letter-W", { y: -750, opacity: 0 });
gsap.set("#letter-I", { y: -750, opacity: 0 });
gsap.set("#letter-H", { y: 750, opacity: 0 });

gsap.set("#preloader-fill", { width: "0%" });

gsap.set("#logo-bg", { opacity: 1 });

//////////////////////////////////////////////////////
// INTRO TIMELINE
//////////////////////////////////////////////////////
const introTimeline = gsap.timeline({ paused: true });

introTimeline.to("#preloader-fill", {
    width: "100%",
    duration: 3,
    ease: "power1.out"
}, 0);

introTimeline.to(["#letter-W", "#letter-I"], {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.15
}, 0.4);

introTimeline.to("#letter-H", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
}, 0.9);

introTimeline.to("#logo-container", {
    scale: 1,
    duration: 0.8,
    ease: "elastic.out(1,0.5)"
}, 1.6);

introTimeline.to("#web-text", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
}, 1.8);

introTimeline.to("#preloader", {
    opacity: 0,
    duration: 0.6
}, 2.5);

introTimeline.to("#logo-bg", {
    opacity: 0,
    duration: 1,
    ease: "power4.inOut"
}, 2.7);

introTimeline.to("#header-ui", {
    opacity: 1,
    duration: 1
}, 2.9);

introTimeline.to("#logo-fixed", {
    opacity: 1,
    duration: 1
}, 2.9);

introTimeline.to("#scroll-indicator", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
}, 3.1);

introTimeline.set("#logo-bg", {
    display: "none"
});

window.addEventListener("load", () => {
    introTimeline.play();
});

//////////////////////////////////////////////////////
// CINEMATIC PANELS WITH ARROWS
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
    const sideText = panel.querySelector(".side-text");

    const arrow =
        panel.querySelector(".arrow-right") ||
        panel.querySelector(".arrow-left");

    const arrowPath =
        arrow ? arrow.querySelector("path") : null;

    if (arrow && arrowPath) {

        gsap.set(arrow, { opacity: 0 });

        gsap.set(arrowPath, {
            strokeDasharray: 120,
            strokeDashoffset: 120
        });

    }

    const tl = gsap.timeline();

    //////////////////////////////////////////////////////
    // TEXT IN
    //////////////////////////////////////////////////////
    tl.fromTo(lines,
        {
            y: 120,
            opacity: 0,
            filter: "blur(15px)"
        },
        {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.4,
            stagger: 0.15,
            ease: "power3.out"
        }
    );

    //////////////////////////////////////////////////////
    // SIDE TEXT IN
    //////////////////////////////////////////////////////
    if (sideText) {

        tl.fromTo(sideText,
            {
                x:
                    panel.classList.contains("panel-2") ||
                    panel.classList.contains("panel-4")
                        ? 100
                        : -100,
                opacity: 0,
                filter: "blur(10px)"
            },
            {
                x: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power3.out"
            },
            "-=1"
        );

    }

    //////////////////////////////////////////////////////
    // ARROW IN
    //////////////////////////////////////////////////////
    if (arrow && arrowPath) {

        tl.to(arrow,
            {
                opacity: 1,
                duration: 0.4
            },
            "-=0.8"
        );

        tl.to(arrowPath,
            {
                strokeDashoffset: 0,
                duration: 1,
                ease: "power3.out"
            },
            "-=0.6"
        );

    }

    //////////////////////////////////////////////////////
    // HOLD
    //////////////////////////////////////////////////////
    tl.to({}, { duration: 1.2 });

    //////////////////////////////////////////////////////
    // TEXT OUT
    //////////////////////////////////////////////////////
    tl.to(lines,
        {
            y: -120,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1,
            stagger: 0.1,
            ease: "power3.in"
        }
    );

    //////////////////////////////////////////////////////
    // SIDE TEXT OUT
    //////////////////////////////////////////////////////
    if (sideText) {

        tl.to(sideText,
            {
                x:
                    panel.classList.contains("panel-2") ||
                    panel.classList.contains("panel-4")
                        ? 100
                        : -100,
                opacity: 0,
                filter: "blur(10px)",
                duration: 1,
                ease: "power3.in"
            },
            "-=1"
        );

    }

    //////////////////////////////////////////////////////
    // ARROW OUT
    //////////////////////////////////////////////////////
    if (arrow && arrowPath) {

        tl.to(arrowPath,
            {
                strokeDashoffset: 120,
                duration: 0.6,
                ease: "power3.in"
            },
            "-=1"
        );

        tl.to(arrow,
            {
                opacity: 0,
                duration: 0.4
            },
            "-=0.4"
        );

    }

    masterTimeline.add(tl);

});

//////////////////////////////////////////////////////
// HIDE SCROLL INDICATOR
//////////////////////////////////////////////////////
ScrollTrigger.create({

    trigger: ".content",
    start: "top top",
    end: "top+=300 top",

    onUpdate: () => {

        gsap.to("#scroll-indicator", {
            opacity: 0,
            y: 40,
            duration: 0.3
        });

    }

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

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});