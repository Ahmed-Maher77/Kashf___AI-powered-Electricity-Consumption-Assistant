import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Gap between cards in px — must match the gap-6 class (1.5rem = 24px)
const CARD_GAP = 24;

const TestimonialsSection = () => {
    const { t } = useTranslation();
    const [activePage, setActivePage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(1);
    const [isDraggingState, setIsDraggingState] = useState(false);
    const scrollContainerRef = useRef(null);

    // Keep a ref copy so scroll handler never has a stale closure
    const cardsPerPageRef = useRef(1);

    // Mouse drag refs
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStartLeft = useRef(0);

    // Touch refs
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const testimonials = [
        {
            id: 1,
            name: t("testimonials.ahmed.name", { defaultValue: "Ahmed Khalil" }),
            title: t("testimonials.ahmed.title", { defaultValue: "Father of 3, Nasr City" }),
            quote: t("testimonials.ahmed.quote", { defaultValue: "كنت دايماً مفاجأة من الفاتورة، لكن كشف خلاني أعرف استهلاكي بالظبط وبقت تنبيهات قبل ما الفاتورة تزيد." }),
            initials: "AK",
            bgColor: "bg-blue-500/20",
            textColor: "text-blue-400",
        },
        {
            id: 2,
            name: t("testimonials.omar.name", { defaultValue: "Omar Samy" }),
            title: t("testimonials.omar.title", { defaultValue: "Business Owner, Alexandria" }),
            quote: t("testimonials.omar.quote", { defaultValue: "كنت مش عارف أحسب الفاتورة إزاي، كشف حل المشكلة وبي توصيات عملية بالذكاء الاصطناعي." }),
            initials: "OS",
            bgColor: "bg-emerald-500/20",
            textColor: "text-emerald-400",
        },
        {
            id: 3,
            name: t("testimonials.karim.name", { defaultValue: "Karim Hassan" }),
            title: t("testimonials.karim.title", { defaultValue: "Engineer, New Cairo" }),
            quote: t("testimonials.karim.quote", { defaultValue: "I was skeptical at first, but the OCR meter scanning is impressive. Saved 340 EGP on my last bill." }),
            initials: "KH",
            bgColor: "bg-purple-500/20",
            textColor: "text-purple-400",
        },
        {
            id: 4,
            name: t("testimonials.sara.name", { defaultValue: "Sara Mohamed" }),
            title: t("testimonials.sara.title", { defaultValue: "Housewife, Giza" }),
            quote: t("testimonials.sara.quote", { defaultValue: "التطبيق ساعدني أكتشف إن التكييف بيستهلك ضعف الطاقة المفروض. وفرت أكتر من 500 جنيه الشهر ده." }),
            initials: "SM",
            bgColor: "bg-rose-500/20",
            textColor: "text-rose-400",
        },
        {
            id: 5,
            name: t("testimonials.youssef.name", { defaultValue: "Youssef Adel" }),
            title: t("testimonials.youssef.title", { defaultValue: "Software Dev, Maadi" }),
            quote: t("testimonials.youssef.quote", { defaultValue: "The bill calculator finally makes sense of the tier system. No more surprises when the invoice lands." }),
            initials: "YA",
            bgColor: "bg-amber-500/20",
            textColor: "text-amber-400",
        },
        {
            id: 6,
            name: t("testimonials.nour.name", { defaultValue: "Nour El-Din" }),
            title: t("testimonials.nour.title", { defaultValue: "Shop Owner, Heliopolis" }),
            quote: t("testimonials.nour.quote", { defaultValue: "كشف بيفرق بين الاستهلاك التجاري والسكني. ده وفرلي كتير في التخطيط وأنا بحسب مصاريف المحل." }),
            initials: "NE",
            bgColor: "bg-cyan-500/20",
            textColor: "text-cyan-400",
        },
    ];

    const pageCount = Math.ceil(testimonials.length / cardsPerPage);

    // ── Scroll a specific page into view ─────────────────────────────────────
    // Uses the actual rendered offsetLeft of the first card in that page
    // so it is always pixel-perfect regardless of gap/padding changes.
    const scrollToPage = useCallback((page, animate = true) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const slides = container.querySelectorAll(".testimonial-slide");
        const cpp = cardsPerPageRef.current;
        const targetIndex = Math.min(page * cpp, slides.length - 1);
        if (!slides[targetIndex]) return;
        container.scrollTo({
            left: slides[targetIndex].offsetLeft,
            behavior: animate ? "smooth" : "instant",
        });
        setActivePage(page);
    }, []);

    // ── Measure cards-per-page from real DOM dimensions ───────────────────────
    const measureCardsPerPage = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const slide = container.querySelector(".testimonial-slide");
        if (!slide) return;

        // slideWidth includes the gap that follows it (except the last card)
        const slideWidth = slide.offsetWidth + CARD_GAP;
        // Math.floor: only count cards that fully fit
        const cpp = Math.max(1, Math.floor((container.offsetWidth + CARD_GAP) / slideWidth));

        if (cpp !== cardsPerPageRef.current) {
            cardsPerPageRef.current = cpp;
            setCardsPerPage(cpp);

            // Re-snap to page 0 on breakpoint change to stay in sync
            setActivePage(0);
            container.scrollTo({ left: 0, behavior: "instant" });
        }
    }, []);

    useEffect(() => {
        // Measure after first paint so offsetWidth is real
        const raf = requestAnimationFrame(measureCardsPerPage);
        const ro = new ResizeObserver(measureCardsPerPage);
        if (scrollContainerRef.current) ro.observe(scrollContainerRef.current);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [measureCardsPerPage]);

    // ── Sync active dot while scrolling (uses ref, never stale) ──────────────
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const slides = container.querySelectorAll(".testimonial-slide");
            const scrollLeft = container.scrollLeft;
            let closestSlide = 0;
            let minDist = Infinity;
            slides.forEach((slide, i) => {
                const dist = Math.abs(slide.offsetLeft - scrollLeft);
                if (dist < minDist) { minDist = dist; closestSlide = i; }
            });
            setActivePage(Math.floor(closestSlide / cardsPerPageRef.current));
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []); // stable — reads from ref, not state

    // ── Mouse drag ────────────────────────────────────────────────────────────
    const onMouseDown = useCallback((e) => {
        // Ignore clicks on buttons (dots)
        if (e.target.closest("button")) return;
        const container = scrollContainerRef.current;
        if (!container) return;
        isDragging.current = true;
        startX.current = e.clientX;
        scrollStartLeft.current = container.scrollLeft;
        setIsDraggingState(true);
        e.preventDefault();
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!isDragging.current) return;
        const container = scrollContainerRef.current;
        if (!container) return;
        // Temporarily disable smooth scroll so the drag follows cursor 1:1
        container.style.scrollBehavior = "auto";
        container.scrollLeft = scrollStartLeft.current - (e.clientX - startX.current);
    }, []);

    const onMouseUp = useCallback((e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        setIsDraggingState(false);
        const container = scrollContainerRef.current;
        if (!container) return;
        container.style.scrollBehavior = "smooth";

        // Snap to nearest page boundary with smooth animation
        const slides = container.querySelectorAll(".testimonial-slide");
        const scrollLeft = container.scrollLeft;
        let closestSlide = 0;
        let minDist = Infinity;
        slides.forEach((slide, i) => {
            const dist = Math.abs(slide.offsetLeft - scrollLeft);
            if (dist < minDist) { minDist = dist; closestSlide = i; }
        });
        scrollToPage(Math.floor(closestSlide / cardsPerPageRef.current));
    }, [scrollToPage]);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    // ── Touch swipe ───────────────────────────────────────────────────────────
    const onTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const onTouchEnd = useCallback((e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;

        // Only treat as horizontal swipe if X movement dominates
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

        const direction = dx < 0 ? 1 : -1;
        const currentPage = Math.round(
            (scrollContainerRef.current?.scrollLeft ?? 0) /
            ((scrollContainerRef.current?.querySelector(".testimonial-slide")?.offsetWidth ?? 1) + CARD_GAP) /
            cardsPerPageRef.current
        );
        const nextPage = Math.max(0, Math.min(pageCount - 1, currentPage + direction));
        scrollToPage(nextPage);
    }, [pageCount, scrollToPage]);

    // ── Stars ─────────────────────────────────────────────────────────────────
    const renderStars = () => (
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-kashf-blue" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    return (
        <section id="testimonials" className="py-16 md:py-24 border-t border-kashf-border">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight line-height-15">
                        {t("testimonials.title", { defaultValue: "Egyptians who got their bills under control" })}
                    </h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg text-neutral-400">
                        {t("testimonials.subtitle", { defaultValue: "Real stories from real users saving money with Kashf" })}
                    </p>
                </div>

                {/* Slider */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide select-none"
                        style={{
                            cursor: isDraggingState ? "grabbing" : "grab",
                            // scrollBehavior managed imperatively; inline style wins over class
                        }}
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        {/*
                          Cards use a CSS custom property for width so the single
                          source of truth (--card-w) drives both the card width
                          and the measureCardsPerPage calculation.

                          Breakpoints:
                            mobile  (<640px)  → 1 card  → full width
                            tablet  (≥640px)  → 2 cards → ~50% − half gap
                            desktop (≥1024px) → 3 cards → ~33% − two-thirds gap
                        */}
                        <div className="flex pb-4" style={{ gap: CARD_GAP }}>
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="
                                        testimonial-slide
                                        flex-shrink-0
                                        w-[calc(100vw-2rem)]
                                        sm:w-[calc(50%-12px)]
                                        lg:w-[calc(33.333%-16px)]
                                        max-w-sm sm:max-w-none
                                    "
                                >
                                    <div className="h-full bg-kashf-surface border border-kashf-border rounded-2xl p-5 sm:p-6 hover:border-kashf-blue/40 transition-colors duration-300">
                                        {renderStars()}
                                        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 min-h-[72px]">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </p>
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full ${testimonial.bgColor} ${testimonial.textColor} flex items-center justify-center font-semibold text-base sm:text-lg`}>
                                                {testimonial.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-neutral-100 truncate">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-neutral-500 truncate">
                                                    {testimonial.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Page dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: pageCount }).map((_, pageIndex) => (
                            <button
                                key={pageIndex}
                                onClick={() => scrollToPage(pageIndex)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    activePage === pageIndex
                                        ? "bg-kashf-blue w-8"
                                        : "bg-neutral-600 hover:bg-neutral-500 w-2.5"
                                }`}
                                aria-label={`Go to page ${pageIndex + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default TestimonialsSection;
