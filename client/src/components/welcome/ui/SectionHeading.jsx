import { motion } from "framer-motion";
import { fadeUpVariants } from "../../../utils/animations";

const SectionHeading = ({
    title,
    accent,
    subtitle,
    align = "center",
    badge = null,
    className = "",
}) => {
    const textAlign = align === "left" ? "text-start" : "text-center";
    const subtitleAlign = align === "left" ? "" : "mx-auto";

    return (
        <motion.div 
            className={`flex flex-col gap-4 ${textAlign} ${className}`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
        >
            {badge && (
                <motion.div className={align === "center" ? "flex justify-center" : ""} variants={fadeUpVariants}>
                    {badge}
                </motion.div>
            )}
            <motion.div variants={fadeUpVariants}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-100 tracking-tight leading-snug line-height-15">
                    {title}{" "}
                    {accent && <span className="text-kashf-blue">{accent}</span>}
                </h2>
            </motion.div>
            {subtitle && (
                <motion.div variants={fadeUpVariants}>
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
