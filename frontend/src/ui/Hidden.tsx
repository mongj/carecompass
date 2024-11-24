import { VisuallyHidden, ChakraProps } from "@chakra-ui/react";

interface HiddenProps extends ChakraProps {
  children: React.ReactNode;
  condition?: boolean;
}

/**
 * A wrapper around Chakra's VisuallyHidden component that conditionally renders its children based on a boolean condition.
 *
 * @param condition - If true, the children are wrapped in a VisuallyHidden component. Defaults to true if not provided.
 * @param children - The component to conditionally render.
 */
export default function Hidden({ children, condition = true }: HiddenProps) {
  return condition ? (
    <VisuallyHidden>{children}</VisuallyHidden>
  ) : (
    <>{children}</>
  );
}
