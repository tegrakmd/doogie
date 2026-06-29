"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./Slider.module.css";
import type { SlideData } from "@/types/slide";

gsap.registerPlugin(SplitText);

const slideData: SlideData[] = [
  { title: "Portfolio Tegra", image: "/images/3.png" },
  { title: "Mwezi Partners", image: "/images/2.jpg" },
  { title: "Safari Vizuri ", image: "/images/1.png" },
  { title: "Recod Dance", image: "/images/4.png" },
  { title: "Karibu Here", image: "/images/5.jpg" },
];

type Direction = "down" | "up";

const TEXT_ANIM = {
  in: {
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.08,
    delay: { down: 0.42, up: 0.18 },
  },
  out: {
    duration: 0.5,
    ease: "power3.in",
    stagger: 0.045,
  },
} as const;

export default function Slider() {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    let fromSlideIndex = 0;
    let isSliderAnimating = false;

   
    const splitInstances = new Map<Element, SplitText>();

    function splitTitle(titleEl: HTMLElement): SplitText {
      const split = SplitText.create(titleEl, {
        type: "lines,words",
        mask: "words",
        linesClass: "line",
        wordsClass: "word",
      });
      splitInstances.set(titleEl, split);
      return split;
    }

    function getTitleSplit(slide: HTMLElement): SplitText | null {
      const title = slide.querySelector<HTMLElement>(`.${styles.slideTitle}`);
      return title ? splitInstances.get(title) ?? null : null;
    }

    function setTitleWordsHidden(split: SplitText, direction: Direction) {
      gsap.set(split.words, {
        yPercent: direction === "down" ? 115 : -115,
        opacity: 0,
        scale: 0.94,
        transformOrigin: "50% 100%",
      });
    }

    function animateTitleIn(split: SplitText, direction: Direction) {
      return gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        duration: TEXT_ANIM.in.duration,
        ease: TEXT_ANIM.in.ease,
        stagger: {
          each: TEXT_ANIM.in.stagger,
          from: direction === "down" ? "start" : "end",
        },
        delay: TEXT_ANIM.in.delay[direction],
      });
    }

    function animateTitleOut(split: SplitText, direction: Direction) {
      const exitY = direction === "down" ? -115 : 115;

      return gsap.to(split.words, {
        yPercent: exitY,
        opacity: 0,
        scale: 0.94,
        duration: TEXT_ANIM.out.duration,
        ease: TEXT_ANIM.out.ease,
        stagger: {
          each: TEXT_ANIM.out.stagger,
          from: direction === "down" ? "start" : "end",
        },
      });
    }

    function createSlideElement(data: SlideData): HTMLDivElement {
      const slide = document.createElement("div");
      slide.className = styles.slide;
      slide.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="${styles.slideImage}" />
        <h1 class="${styles.slideTitle}">${data.title}</h1>
      `;
      return slide;
    }

    function getSlides(): HTMLElement[] {
      return Array.from(slider!.querySelectorAll<HTMLElement>(`.${styles.slide}`));
    }

    function revertTitleSplit(slide: HTMLElement) {
      const title = slide.querySelector<HTMLElement>(`.${styles.slideTitle}`);
      if (title) {
        const split = splitInstances.get(title);
        if (split) {
          gsap.killTweensOf(split.words);
          split.revert();
        }
        splitInstances.delete(title);
      }
    }

    function initializeSlider() {
      slideData.forEach((data) => {
        slider!.appendChild(createSlideElement(data));
      });

      const slides = getSlides();

      slides.forEach((slide) => {
        const title = slide.querySelector<HTMLElement>(`.${styles.slideTitle}`);
        if (title) splitTitle(title);
      });

      slides.forEach((slide, i) => {
        gsap.set(slide, {
          y: -15 + 15 * i + "%",
          z: 15 * i,
          opacity: 1,
        });
      });
    }

    function handleScrollDown() {
      const slides = getSlides();
      const firstSlide = slides[0];

      fromSlideIndex = (fromSlideIndex + 1) % slideData.length;
      const newBackIndex = (fromSlideIndex + 4) % slideData.length;
      const nextSlideData = slideData[newBackIndex];

      const newSlide = createSlideElement(nextSlideData);
      const newTitle = newSlide.querySelector<HTMLElement>(`.${styles.slideTitle}`)!;

      slider!.appendChild(newSlide);
      const newSplit = splitTitle(newTitle);
      const outgoingSplit = getTitleSplit(firstSlide);

      setTitleWordsHidden(newSplit, "down");
      if (outgoingSplit) animateTitleOut(outgoingSplit, "down");

      gsap.set(newSlide, {
        y: -15 + 15 * 5 + "%",
        z: 15 * 5,
        opacity: 0,
      });

      const allSlides = getSlides();

      allSlides.forEach((slide, i) => {
        const targetPosition = i - 1;

        gsap.to(slide, {
          y: -15 + 15 * targetPosition + "%",
          z: 15 * targetPosition,
          // Le slide qui SORT (-1) est masqué, pas celui qui prend la position 0.
          opacity: targetPosition === -1 ? 0 : 1,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (i === 0) {
              revertTitleSplit(firstSlide);
              firstSlide.remove();
              isSliderAnimating = false;
            }
          },
        });
      });

      animateTitleIn(newSplit, "down");
    }

    function handleScrollUp() {

      const slides = getSlides();
      const lastSlide = slides[slides.length - 1];

      fromSlideIndex = (fromSlideIndex - 1 + slideData.length) % slideData.length;
      const prevSlideData = slideData[fromSlideIndex];

      const newSlide = createSlideElement(prevSlideData);
      const newTitle = newSlide.querySelector<HTMLElement>(`.${styles.slideTitle}`)!;

      slider!.prepend(newSlide);

      const newSplit = splitTitle(newTitle);
      const outgoingSplit = getTitleSplit(lastSlide);

      setTitleWordsHidden(newSplit, "up");
      if (outgoingSplit) animateTitleOut(outgoingSplit, "up");

      gsap.set(newSlide, {
        y: -15 + 15 * -1 + "%",
        z: 15 * -1,
        opacity: 0,
      });

      const allQueue = getSlides();

      allQueue.forEach((slide, i) => {
        const targetPosition = i;

        gsap.to(slide, {
          y: -15 + 15 * targetPosition + "%",
          z: 15 * targetPosition,
          opacity: targetPosition > 4 ? 0 : 1,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (i === allQueue.length - 1) {
              revertTitleSplit(lastSlide);
              lastSlide.remove();
              isSliderAnimating = false;
            }
          },
        });
      });

      animateTitleIn(newSplit, "up");
    }

    function handleSlideChange(direction: Direction = "down") {
      if (isSliderAnimating) return;
      isSliderAnimating = true;

      if (direction === "down") {
        handleScrollDown();
      } else {
        handleScrollUp();
      }
    }

    initializeSlider();

    // --- Wheel ---
    let wheelAccumulator = 0;
    const wheelThreshold = 100;
    let isWheelActive = false;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (isSliderAnimating || isWheelActive) return;

      wheelAccumulator += Math.abs(e.deltaY);

      if (wheelAccumulator >= wheelThreshold) {
        wheelAccumulator = 0;
        isWheelActive = true;

        const direction: Direction = e.deltaY > 0 ? "down" : "up";
        handleSlideChange(direction);

        setTimeout(() => {
          isWheelActive = false;
        }, 1200);
      }
    }

    container.addEventListener("wheel", onWheel, { passive: false });

    // --- Touch ---
    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchActive = false;
    const touchThreshold = 50;

    function onTouchStart(e: TouchEvent) {
      if (isSliderAnimating || isTouchActive) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }

    function onTouchEnd(e: TouchEvent) {
      if (isSliderAnimating || isTouchActive) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchEndY - touchStartY;
      const deltaX = Math.abs(touchStartX - touchEndX);

      if (Math.abs(deltaY) > deltaX && Math.abs(deltaY) > touchThreshold) {
        isTouchActive = true;
        const direction: Direction = deltaY > 0 ? "down" : "up";
        handleSlideChange(direction);
        setTimeout(() => {
          isTouchActive = false;
        }, 1200);
      }
    }

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    // --- Cleanup à l'unmount (StrictMode / navigation Next.js) ---
    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      gsap.killTweensOf(getSlides());
      splitInstances.forEach((split) => split.revert());
      splitInstances.clear();
      slider!.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={sliderRef} className={styles.slider} />
    </div>
  );
}
