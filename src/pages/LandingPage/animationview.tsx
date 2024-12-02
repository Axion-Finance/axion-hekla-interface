import { Renderer, Vec2, Vec4, Geometry, Flowmap, Texture, Program, Mesh } from "ogl";
import { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  // max-height: 704px;  #TODO: ENABLE
  justify-content: center;
  align-items: center;
  display: flex;
  overflow: hidden;
`;

const imgSize = [1250, 833];
const vertex = `
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0, 1);
        }
    `;
const fragment = `
        precision highp float;
        precision highp int;
        uniform sampler2D tWater;
        uniform sampler2D tFlow;
        uniform float uTime;
        varying vec2 vUv;
        uniform vec4 res;
        const float distortionStrength = 0.3;
        const float distortionMultiplier = 0.7;
        void main() {
            vec3 flow = texture2D(tFlow, vUv).rgb;
            vec2 uv = .5 * gl_FragCoord.xy / res.xy;
            vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
            myUV -= flow.xy * (distortionStrength * distortionMultiplier);
            vec3 tex = texture2D(tWater, myUV).rgb;
            gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0);
        }
    `;

const animatedBGTag = "ogl_animated_bg";

function Animationview() {
  const renderer = new Renderer({ dpr: 2 });
  const gl = renderer.gl;
  let headerElement = document.querySelector(`.${animatedBGTag}`);
  useEffect(() => {
    headerElement = document.querySelector(`.${animatedBGTag}`); // To access the div with className slide track
    if (headerElement) {
      headerElement.appendChild(gl.canvas);
    } else {
      console.error(`Element .${animatedBGTag} not found.`);
    }
  }, [document]);

  let aspect = 1;
  const mouse = new Vec2(-1);
  const velocity: any = new Vec2();

  function resize() {
    let a1, a2;
    var imageAspect = imgSize[1] / imgSize[0];
    if (window.innerHeight / window.innerWidth < imageAspect) {
      a1 = 1;
      a2 = window.innerHeight / window.innerWidth / imageAspect;
    } else {
      a1 = (window.innerWidth / window.innerHeight) * imageAspect;
      a2 = 1;
    }
    mesh.program.uniforms.res.value = new Vec4(window.innerWidth, window.innerHeight, a1, a2);
    renderer.setSize(window.innerWidth, window.innerHeight);
    aspect = window.innerWidth / window.innerHeight;
  }

  const flowmap = new Flowmap(gl);

  const geometry = new Geometry(gl, {
    position: {
      size: 2,
      data: new Float32Array([-1, -1, 3, -1, -1, 3]),
    },
    uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
  });

  const texture = new Texture(gl, {
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
  });

  const img = new Image();
  img.onload = () => (texture.image = img);
  img.crossOrigin = "Anonymous";
  img.src = "https://uploads-ssl.webflow.com/659bdfafc8c71cb3ecf311e5/659c26e2b9286f642b82213a_Bg1%20(1).jpg";
  let a1, a2;
  var imageAspect = imgSize[1] / imgSize[0];
  if (window.innerHeight / window.innerWidth < imageAspect) {
    a1 = 1;
    a2 = window.innerHeight / window.innerWidth / imageAspect;
  } else {
    a1 = (window.innerWidth / window.innerHeight) * imageAspect;
    a2 = 1;
  }

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      tWater: { value: texture },
      res: {
        value: new Vec4(window.innerWidth, window.innerHeight, a1, a2),
      },
      img: { value: new Vec2(imgSize[0], imgSize[1]) },
      tFlow: flowmap.uniform,
    },
  });

  const mesh = new Mesh(gl, { geometry, program });
  window.addEventListener("resize", resize, false);
  resize();

  const isTouchCapable = "ontouchstart" in window;

  function updateMouse(e: any) {
    e.preventDefault();
    if (e.changedTouches && e.changedTouches.length) {
      e.x = e.changedTouches[0].pageX;
      e.y = e.changedTouches[0].pageY;
    }
    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }
    mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);
    if (!lastTime) {
      lastTime = performance.now();
      lastMouse.set(e.x, e.y);
    }
    const deltaX = e.x - lastMouse.x;
    const deltaY = e.y - lastMouse.y;
    lastMouse.set(e.x, e.y);
    let time = performance.now();
    let delta = Math.max(10.4, time - lastTime);
    lastTime = time;
    velocity.x = deltaX / delta;
    velocity.y = deltaY / delta;
    velocity.needsUpdate = true;
  }

  function update(t: number) {
    requestAnimationFrame(update);
    if (!velocity.needsUpdate) {
      mouse.set(-1);
      velocity.set(0);
    }
    velocity.needsUpdate = false;
    flowmap.aspect = aspect;
    flowmap.mouse.copy(mouse);
    flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
    flowmap.update();
    program.uniforms.uTime.value = t * 0.01;
    renderer.render({ scene: mesh });
  }

  if (isTouchCapable) {
    window.addEventListener("touchstart", updateMouse, true);
    window.addEventListener("touchmove", updateMouse, { passive: true });
  } else {
    window.addEventListener("mousemove", updateMouse, true);
  }

  let lastTime: number;
  const lastMouse = new Vec2();

  requestAnimationFrame(update);

  return <Wrapper className={animatedBGTag} />;
}

export default Animationview;
