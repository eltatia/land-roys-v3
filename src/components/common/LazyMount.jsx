import React, { useEffect, useRef, useState } from "react";

const LazyMount = ({
  children,
  fallback = null,
  rootMargin = "200px 0px",
  minHeight = 0,
  once = true,
  eager = false,
}) => {
  const [isVisible, setIsVisible] = useState(Boolean(eager));
  const anchorRef = useRef(null);

  useEffect(() => {
    if (eager || (once && isVisible)) return;

    const node = anchorRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, isVisible, once, rootMargin]);

  return (
    <div ref={anchorRef} style={{ minHeight }}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyMount;
