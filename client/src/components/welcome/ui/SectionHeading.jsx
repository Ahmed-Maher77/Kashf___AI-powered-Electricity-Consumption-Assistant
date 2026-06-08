import { motion } from "framer-motion";

const SectionHeading = ({
    title,
    accent,
    subtitle,
    align = "center",
    badge = null,
    className = "",
    baseDelay = 0
}) => {
    // Use logical CSS properties so "left" becomes "right" automatically in RTL
    const textAlign = align === "left" ? "text-start" : "text-center";
    const subtitleAlign = align === "left" ? "" : "mx-auto";

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: baseDelay + (i * 0.15),
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    return (
        <motion.div 
            className={`flex flex-col gap-4 ${textAlign} ${className}`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
        >
            {badge && (
                <motion.div className={align === "center" ? "flex justify-center" : ""} variants={itemVariants} custom={0}>
                    {badge}
                </motion.div>
            )}
            <motion.div variants={itemVariants} custom={badge ? 1 : 0}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-100 tracking-tight leading-snug line-height-15">
                    {title}{" "}
                    {accent && <span className="text-kashf-blue">{accent}</span>}
                </h2>
            </motion.div>
            {subtitle && (
                <motion.div variants={itemVariants} custom={badge ? 2 : 1}>
                    <p
                        className={`text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl ${subtitleAlign}`}
                    >
                        {subtitle}
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SectionHeading;
