import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import styles from "/styles/jss/nextjs-material-kit/components/cardWarehouse.js";

const useStyles = makeStyles(styles);

const Card = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { className, children, plain, carousel, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardCarousel]: carousel,
    [className]: className !== undefined,
  });

  const frameRef = useRef(null);
  const cardRef = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    const card = cardRef.current;
    const light = lightRef.current;

    let { x, y, width, height } = frame.getBoundingClientRect();

    const mouseMove = (e) => {
      const left = e.clientX - x;
      const top = e.clientY - y;
      const centerX = left - width / 2;
      const centerY = top - height / 2;
      const d = Math.sqrt(centerX ** 2 + centerY ** 2);

      card.style.boxShadow = `${-centerX / 8}px ${-centerY / 8}px 10px rgba(0,0,0,0.1)`;
      card.style.transform = `rotate3d(${centerY / 100}, ${-centerX / 100}, 0, ${d / 10}deg)`;
      light.style.backgroundImage = `radial-gradient(circle at ${left}px ${top}px, #00000010, #ffffff00, #ffffff70)`;
    };

    const handleResize = () => {
      const rect = frame.getBoundingClientRect();
      x = rect.x;
      y = rect.y;
      width = rect.width;
      height = rect.height;
    };

    frame.addEventListener("mouseenter", () => {
      frame.addEventListener("mousemove", mouseMove);
    });

    frame.addEventListener("mouseleave", () => {
      frame.removeEventListener("mousemove", mouseMove);
      card.style.transform = "";
      light.style.backgroundImage = "";
    });

    window.addEventListener("resize", handleResize);

    return () => {
      frame.removeEventListener("mouseenter", mouseMove);
      frame.removeEventListener("mouseleave", mouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes.frame} ref={frameRef}>
      <div className={cardClasses} ref={cardRef} {...rest}>
        <div className={classes.light} ref={lightRef}>
        </div>
        {children}
      </div>
    </div>
  );
});

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.node,
};

export default Card;