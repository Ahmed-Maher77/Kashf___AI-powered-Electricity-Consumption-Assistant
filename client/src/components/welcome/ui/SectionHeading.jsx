const SectionHeading = ({
    title,
    accent,
    subtitle,
    align = "center",
    badge = null,
    className = "",
}) => {
    // Use logical CSS properties so "left" becomes "right" automatically in RTL
    const textAlign = align === "left" ? "text-start" : "text-center";
    const subtitleAlign = align === "left" ? "" : "mx-auto";

    return (
        <div className={`flex flex-col gap-4 ${textAlign} ${className}`}>
            {badge && (
                <div className={align === "center" ? "flex justify-center" : ""}>
                    {badge}
                </div>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-100 tracking-tight leading-snug line-height-15">
                {title}{" "}
                {accent && <span className="text-kashf-blue">{accent}</span>}
            </h2>
            {subtitle && (
                <p
                    className={`text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl ${subtitleAlign}`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
