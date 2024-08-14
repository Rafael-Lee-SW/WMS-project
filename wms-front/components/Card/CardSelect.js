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

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const light = lightRef.current;

    let { x, y, width, height } = container.getBoundingClientRect();

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
      const rect = container.getBoundingClientRect();
      x = rect.x;
      y = rect.y;
      width = rect.width;
      height = rect.height;
    };

    container.addEventListener("mouseenter", () => {
      container.addEventListener("mousemove", mouseMove);
    });

    container.addEventListener("mouseleave", () => {
      container.removeEventListener("mousemove", mouseMove);
      card.style.transform = "";
      light.style.backgroundImage = "";
    });

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mouseenter", mouseMove);
      container.removeEventListener("mouseleave", mouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes.frame} ref={containerRef}>
      <div className={cardClasses} ref={cardRef} {...rest}>
        <div className={classes.light} ref={lightRef}></div>
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
