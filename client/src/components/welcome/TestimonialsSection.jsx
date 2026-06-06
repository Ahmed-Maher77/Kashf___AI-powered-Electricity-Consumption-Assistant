import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const TestimonialsSection = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);

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
    ];

    const scrollToSlide = (index) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const slides = container.querySelectorAll('.snap-center');
            if (slides[index]) {
                const slideLeft = slides[index].offsetLeft;
                container.scrollTo({
                    left: slideLeft,
                    behavior: "smooth",
                });
            }
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const slides = container.querySelectorAll('.snap-center');
            let newIndex = 0;
            
            slides.forEach((slide, index) => {
                const slideLeft = slide.offsetLeft;
                const slideRight = slideLeft + slide.offsetWidth;
                const containerCenter = scrollLeft + container.offsetWidth / 2;
                
                if (containerCenter >= slideLeft && containerCenter <= slideRight) {
                    newIndex = index;
                }
            });
            
            setActiveIndex(newIndex);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const renderStars = () => (
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className="w-4 h-4 fill-kashf-blue"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    return (
        <section className="py-16 md:py-24 border-t border-kashf-border">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight">
                        {t("testimonials.title", { defaultValue: "Egyptians who got their bills under control" })}
                    </h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg text-neutral-400">
                        {t("testimonials.subtitle", { defaultValue: "Real stories from real users saving money with Kashf" })}
                    </p>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        <div className="flex gap-6 pb-4 px-1">
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center touch-pan-x"
                                >
                                    <div className="h-full bg-kashf-surface border border-kashf-border rounded-2xl p-6 hover:border-kashf-blue/40 transition-colors duration-300">
                                        {renderStars()}
                                        <p className="text-neutral-300 leading-relaxed mb-6 min-h-[80px]">
                                            "{testimonial.quote}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full ${testimonial.bgColor} ${testimonial.textColor} flex items-center justify-center font-semibold text-lg`}>
                                                {testimonial.initials}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-neutral-100">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-neutral-500">
                                                    {testimonial.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    activeIndex === index
                                        ? "bg-kashf-blue w-8"
                                        : "bg-neutral-600 hover:bg-neutral-500"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
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
