import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import { COMPANY_DEFAULTS, DEFAULT_SEO_SETTINGS } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: DEFAULT_SEO_SETTINGS.defaultTitle, template: DEFAULT_SEO_SETTINGS.titleTemplate },
  description: DEFAULT_SEO_SETTINGS.defaultDescription,
  keywords: DEFAULT_SEO_SETTINGS.keywords,
  openGraph: {
    type: "website",
    siteName: COMPANY_DEFAULTS.name,
    title: DEFAULT_SEO_SETTINGS.defaultTitle,
    description: DEFAULT_SEO_SETTINGS.defaultDescription,
    url: "/",
    images: [{ url: DEFAULT_SEO_SETTINGS.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO_SETTINGS.defaultTitle,
    description: DEFAULT_SEO_SETTINGS.defaultDescription,
    images: [DEFAULT_SEO_SETTINGS.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001534",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="saaj-bw-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("saaj-bw-mode")==="1"){document.documentElement.classList.add("bw")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}