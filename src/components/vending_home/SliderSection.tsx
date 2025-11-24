// SliderSection.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { Link, useNavigate } from "react-router-dom";

type Slide = { day: string; img: string; blurb: string };

const SLIDES: Slide[] = [
 {
  day: "Monday",
  img: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop",
  blurb: "Many variations of meals of Lorem Ipsum available the majority.",
 },
 {
  day: "Tuesday",
  img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
  blurb: "Many variations of meals of Lorem Ipsum available the majority.",
 },
 {
  day: "Wednesday",
  img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop",
  blurb: "Many variations of meals of Lorem Ipsum available the majority.",
 },
 {
  day: "Thursday",
  img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop",
  blurb: "Many variations of meals of Lorem Ipsum available the majority.",
 },
 {
  day: "Friday",
  img: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1600&auto=format&fit=crop",
  blurb: "Many variations of meals of Lorem Ipsum available the majority.",
 },
];

// Key: loop + enough slides (we triple the data so it never stalls)
const OPTIONS: EmblaOptionsType = {
 align: "start",
 loop: true,
 slidesToScroll: 1,
};

const Arrow: React.FC<{ dir: "left" | "right"; onClick: () => void }> = ({
 dir,
 onClick,
}) => (
 <button
  type="button"
  onClick={onClick}
  aria-label={dir === "left" ? "Previous" : "Next"}
  className={`absolute top-[65%] hidden md:block -translate-y-1/2 z-20 rounded-full p-2 border border-[#2B2B43] ${
   dir === "left"
    ? "left-[7px] md:-left-0 sm:-left-2"
    : "right-[7px] md:right-0 sm:-right-3"
  }`}>
  {dir === "right" ? (
   <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
     d="M7 12.3337L12.3333 7.00033L7 1.66699"
     stroke="#2B2B43"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
    />
    <path
     d="M1.66602 7H12.3327"
     stroke="#2B2B43"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
    />
   </svg>
  ) : (
   <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
     d="M6.99935 1.66699L1.66602 7.00033L6.99935 12.3337"
     stroke="#2B2B43"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
    />
    <path
     d="M12.3327 7H1.66602"
     stroke="#2B2B43"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
    />
   </svg>
  )}
 </button>
);

const Dot: React.FC<{ selected: boolean; onClick: () => void }> = ({
 selected,
 onClick,
}) => (
 <button
  type="button"
  onClick={onClick}
  className={`h-2.5 rounded-full transition-all ${
   selected ? "bg-black/80 w-6" : "bg-black/30 hover:bg-black/50 w-2.5"
  }`}
  aria-label="Go to slide"
 />
);

const SliderSection: React.FC = () => {
 const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [snapCount, setSnapCount] = useState(0);
 const navigate = useNavigate();

 // Triple the slides to guarantee continuous loop regardless of viewport
 const RENDERED_SLIDES = useMemo(
  () => Array.from({ length: 3 }).flatMap(() => SLIDES),
  []
 );

 const onSelect = useCallback((api: EmblaCarouselType) => {
  setSelectedIndex(api.selectedScrollSnap());
 }, []);

 useEffect(() => {
  if (!emblaApi) return;
  setSnapCount(emblaApi.scrollSnapList().length);
  onSelect(emblaApi);
  emblaApi.on("select", onSelect);
  emblaApi.on("reInit", () => {
   setSnapCount(emblaApi.scrollSnapList().length);
   onSelect(emblaApi);
  });
 }, [emblaApi, onSelect]);

 const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
 const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
 const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

 return (
  <section className="relative main-container  ">
   <div className="flex flex-col w-full items-center justify-center gap-2 mb-8">
    <h2 className="text-[28px] leading-[36px] md:pt-12 pt-6 max-md:text-center font-bold text-[#032F55]">
     Explore Our Daily Menu
    </h2>
    <p className="text-base md:font-normal font-[700] max-md:text-center text[#032F55]">
     {" "}
     Daily menu of 13 chef-prepared meals, available Monday to Friday.{" "}
     <Link className="underline text-[#056AC1]" to={"/vending-home/menu"}>
      View our complete menu
     </Link>
    </p>
   </div>
   {/* Always-enabled arrows */}
   <Arrow dir="left" onClick={scrollPrev} />
   <Arrow dir="right" onClick={scrollNext} />

   {/* Viewport */}
   <div className="overflow-hidden" ref={emblaRef}>
    {/* Track: each direct child is a slide (no extra spacers!) */}
    <div className="flex" onClick={() => navigate("/vending-home/menu")}>
     {RENDERED_SLIDES.map((s, idx) => (
      <div
       key={`${s.day}-${idx}`}
       className="relative shrink-0 cursor-pointer min-w-0 basis-[100%] pr-unset sm:px-2 sm:basis-1/2 lg:basis-1/4">
       <div className="group relative h-64 w-full overflow-hidden rounded-2xl shadow hover:shadow-lg transition-shadow">
        <img
         src={s.img}
         alt={s.day}
         className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
         <h3 className="text-xl font-semibold drop-shadow">{s.day}</h3>
         <p className="mt-1 text-[11px] leading-snug opacity-85">{s.blurb}</p>
        </div>
       </div>
      </div>
     ))}
    </div>
   </div>

   {/* Dots */}
   <div className="mt-4 flex items-center justify-center gap-2 slides_images">
    {Array.from({ length: snapCount }).map((_, i) => (
     <Dot key={i} selected={i === selectedIndex} onClick={() => scrollTo(i)} />
    ))}
   </div>
  </section>
 );
};

export default SliderSection;
