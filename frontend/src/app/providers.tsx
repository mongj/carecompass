import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@opengovsg/design-system-react";
import { CSPostHogProvider } from "./posthog";
import AuthProvider from "@/components/AuthProvider";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren<unknown>) {
  return (
    <CSPostHogProvider>
      <AuthProvider>
        <ChakraProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ChakraProvider>
      </AuthProvider>
    </CSPostHogProvider>
  );
}
