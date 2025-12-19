import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PartnerBanner {
  bannerName: string;
  imageUrl: string;
}

const OurPartners: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollerInnerRef = useRef<HTMLDivElement | null>(null);

  const partnerBanners: PartnerBanner[] = [
    {
      bannerName: "Partner 1",
      imageUrl:
        "https://res.cloudinary.com/dmrgscauc/image/upload/v1757518409/bigbasket-logo-png_seeklogo-612610_ftkbuf.png",
    },
    {
      bannerName: "Partner 2",
      imageUrl:
        "https://res.cloudinary.com/dmrgscauc/image/upload/v1757518411/blinkit-logo_x5upx8.webp",
    },
    {
      bannerName: "Partner 3",
      imageUrl:
        "https://res.cloudinary.com/dmrgscauc/image/upload/v1757518411/Swiggy_pnuh4b.png",
    },
    {
      bannerName: "Partner 4",
      imageUrl:
        "https://res.cloudinary.com/dmrgscauc/image/upload/v1757518411/Zepto_Logo.svg_xah0vo.png",
    },
  ];

  useEffect(() => {
    const scrollerInner = scrollerInnerRef.current;
    const scroller = scrollerRef.current;

    if (!scrollerInner || !scroller) return;

    // Clone the items to create seamless infinite scroll
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerInner.appendChild(duplicatedItem);
    });

    // Get the width of the content to scroll
    const scrollWidth = scrollerInner.scrollWidth / 2;

    // Create infinite scroll animation with GSAP
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(scrollerInner, {
      x: -scrollWidth,
      duration: 20,
      ease: "none",
    });

    return () => {
      tl.kill(); // cleanup animation on unmount
    };
  }, []);

  return (
    <div className="mt-16 overflow-hidden">
      <h1 className="text-center font-bold text-xl mb-8">Our Partners</h1>

      <div
        ref={scrollerRef}
        className="relative overflow-hidden mask-gradient"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div ref={scrollerInnerRef} className="flex items-center gap-8 w-max">
          {partnerBanners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white rounded-lg transition-shadow duration-300 p-4"
              style={{ width: "200px", height: "120px" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={partner.imageUrl}
                  alt={partner.bannerName}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPartners;
