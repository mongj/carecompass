"use client";

import { useState } from "react";
import {
  TouchableTooltip,
  TouchableTooltipProps,
} from "@opengovsg/design-system-react";

interface MobileTooltipProps extends TouchableTooltipProps {
  children: React.ReactNode;
  label: string;
}

function MobileTooltip({ children, label, ...props }: MobileTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableTooltip label={label} {...props} isOpen={isOpen}>
      <button aria-label={label} onClick={() => setIsOpen(true)}>
        {children}
      </button>
    </TouchableTooltip>
  );
}

export default MobileTooltip;
