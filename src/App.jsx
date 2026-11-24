
import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

import Header from "./components/Header";
import "./App.css";

function AbstractBackground() {
  const shouldReduceMotion = useReducedMotion();

  // POINTER POSITION
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // SMOOTH POINTER MOVEMENT
  const smoothX = useSpring(pointerX, {
    stiffness: 100,
    damping: 24,
    mass: 0.5,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 100,
    damping: 24,
    mass: 0.5,
  });

  const smoothCursorX = useSpring(cursorX, {
    stiffness: 120,
    damping: 28,
  });

  const smoothCursorY = useSpring(cursorY, {
    stiffness: 120,
    damping: 28,
  });

  // OBJECT PARALLAX
  const objectX = useTransform(smoothX, [-1, 1], [75, -75]);
  const objectY = useTransform(smoothY, [-1, 1], [55, -55]);

  const reverseX = useTransform(smoothX, [-1, 1], [-55, 55]);
  const reverseY = useTransform(smoothY, [-1, 1], [-40, 40]);

  // CHROME ROTATION
  const rotateX = useTransform(smoothY, [-1, 1], [18, -18]);
  const rotateY = useTransform(smoothX, [-1, 1], [-22, 22]);

  // GLASS ROTATION
  const glassRotateX = useTransform(smoothY, [-1, 1], [-20, 20]);
  const glassRotateY = useTransform(smoothX, [-1, 1], [25, -25]);

  // MOUSE SPOTLIGHT
  const spotlight = useMotionTemplate`
    radial-gradient(
      550px circle at ${smoothCursorX}px ${smoothCursorY}px,
      rgba(255,255,255,0.24),
      rgba(255,255,255,0.09) 30%,
      rgba(255,255,255,0.025) 55%,
      transparent 75%
    )
  `;

  // POINTER EVENT
  useEffect(() => {
    cursorX.set(window.innerWidth / 2);
    cursorY.set(window.innerHeight / 2);

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;

      const normalizedX =
        (event.clientX / window.innerWidth) * 2 - 1;

      const normalizedY =
        (event.clientY / window.innerHeight) * 2 - 1;

      pointerX.set(normalizedX);
      pointerY.set(normalizedY);

      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    const handlePointerLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
      cursorX.set(window.innerWidth / 2);
      cursorY.set(window.innerHeight / 2);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [pointerX, pointerY, cursorX, cursorY]);

  return (
    <div className="abstract-background" aria-hidden="true">
      {/* BASE BACKGROUND */}
      <div className="abstract-base" />
      <div className="abstract-grid" />

      {/* AMBIENT LIGHT */}
      <motion.div
        className="abstract-glow glow-left"
        style={{ x: objectX, y: objectY }}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.18, 0.38, 0.18],
          scale: [1, 1.18, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="abstract-glow glow-right"
        style={{ x: reverseX, y: reverseY }}
        animate={shouldReduceMotion ? {} : {
          opacity: [0.12, 0.3, 0.12],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* CHROME 3D OBJECT */}
      <motion.div
        className="abstract-object object-left"
        style={{
          x: objectX,
          y: objectY,
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
      >
        <motion.div
          className="chrome-sphere"
          animate={shouldReduceMotion ? {} : {
            y: [0, -18, 0],
            rotate: [0, 12, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="chrome-orbit orbit-one"
          animate={shouldReduceMotion ? {} : {
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="chrome-orbit orbit-two"
          animate={shouldReduceMotion ? {} : {
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* GLASS 3D OBJECT */}
      <motion.div
        className="abstract-object object-right"
        style={{
          x: reverseX,
          y: reverseY,
          rotateX: glassRotateX,
          rotateY: glassRotateY,
          transformPerspective: 1000,
        }}
      >
        <motion.div
          className="glass-cube"
          animate={shouldReduceMotion ? {} : {
            y: [0, -20, 0],
            rotateZ: [0, 8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="glass-orbit"
          animate={shouldReduceMotion ? {} : {
            rotate: 360,
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* PARTICLES */}
      <div className="abstract-particles particles-left" />
      <div className="abstract-particles particles-right" />

      {/* MOUSE LIGHT - ABOVE OBJECTS */}
      <motion.div
        className="abstract-spotlight"
        style={{ background: spotlight }}
      />

      {/* VIGNETTE - FINAL LAYER */}
      <div className="abstract-vignette" />
    </div>
  );
}

function App() {
  return (
    <>
      <AbstractBackground />
      <Header />
    </>
  );
}

export default App;
