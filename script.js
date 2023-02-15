console.clear();
gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

const dur = 1.1;
const mainEase = "none";
const master = gsap.timeline({ repeat: -1 });
const svgns = "http://www.w3.org/2000/svg";
const demo = document.querySelector("svg");


function unfold(target, sides) {
  let degrees = 360 / sides;
  let segment = DrawSVGPlugin.getLength(target) / sides;
  let start = MotionPathPlugin.getRawPath(target)[0];
  let xPos = start[0];
  let yPos = start[1];
  let lineTarget = document.createElementNS(svgns, "line");
  demo.appendChild(lineTarget);
  gsap.set(lineTarget, {opacity:0});
  let tl = gsap.timeline({
    defaults: { duration: dur / (sides - 1), ease: mainEase }
  });
  tl.add(openPortal());
  tl.fromTo(target, { y: 180 }, { duration: 0.37, y: -160, ease: "circ" });
  tl.add(closePortal());
  tl.to(target, { duration: 0.5, y: 0, ease: "power2.in" }, "<");

  tl.to(
    target,
    {
      duration: 0.08,
      transformOrigin: "center bottom",
      scaleY: 0.8,
      scaleX: 1.09,
      ease: "sine",
      repeat: 1,
      yoyo: true
    },
    ">"
  );
  tl.set(target, { drawSVG: segment * (sides - 1) }, "+=0.25");
  tl.set(lineTarget, {
    attr: { x1: xPos, x2: segment + xPos , y1: yPos, y2: yPos },
    opacity: 1
  });

  for (let i = sides - 1; i > 0; i--) {
    xPos += segment;
    tl.to(target, { rotation: "+=" + degrees, svgOrigin: xPos + " " + yPos });
    tl.set(target, { drawSVG: segment * (i - 1) });
    tl.set(lineTarget, { attr: { x2: "+=" + segment } });
  }
  tl.to(lineTarget, {
    attr: { x1: segment + xPos, x2: segment + xPos, y1: yPos, y2: yPos },
    duration: 0.6,
    ease: "power3.inOut"
  });
  tl.set(lineTarget, {opacity:0})
  return tl;
}

function openPortal() {
  let tween = gsap.fromTo(
    "#portal",
    { attr: { rx: 0, ry: 0 } },
    {
      attr: { rx: 149.5, ry: 6.5 },
      ease: "sine.inOut"
    }
  );
  return tween;
}
function closePortal() {
  let tween = gsap.to("#portal", {
    duration: 0.4,
    attr: { rx: 0, ry: 0 },
    ease: "sine.inOut"
  });
  return tween;
}
gsap.set(demo, { opacity: 1 });
master.add(unfold("#square", 4));
master.add(unfold("#hexagon", 6));
master.add(unfold("#triangle", 3));
master.add(unfold("#octagon", 8));