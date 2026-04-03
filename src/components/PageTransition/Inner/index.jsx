import { easeIn, motion } from "framer-motion";

export default function Inner({ children }) {
  const anim = (variants) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
    };
  };

  const opacity = {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    //exit: { opacity: 0 },
  };

  const slide = {
    initial: { top: "100vh" },
    enter: { top: "100vh" },
    exit: {
      top: "0",
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1], //visit easings.net
      },
    },
  };

  const perspective = {
    initial: { y: 0, scale: 1, opacity: 1 },
    enter: { y: 0, scale: 1, opacity: 1 },
    exit: {
      y: -100,
      scale: 0.9,
      opacity: 0.5,
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1], //visit easings.net
      },
    },
  };

  return (
    <div className="inner">
      <motion.div {...anim(slide)} className="slide"></motion.div>

      <motion.div {...anim(perspective)} className="page">
        <motion.div {...anim(opacity)} className="stuff">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
