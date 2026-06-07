import { useState } from "react";
import { cn } from "../../utils/cn";

const Toggle = ({ checked, onChange, disabled = false, className, ...props }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-kashf-blue focus:ring-offset-2 focus:ring-offset-kashf-bg",
        checked ? "bg-kashf-blue" : "bg-kashf-muted",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
};

export default Toggle;
