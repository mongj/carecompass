import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@opengovsg/design-system-react";
import { CSPostHogProvider } from "./posthog";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CSPostHogProvider>
      <ClerkProvider>
        <ChakraProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ChakraProvider>
      </ClerkProvider>
    </CSPostHogProvider>
  );
}
