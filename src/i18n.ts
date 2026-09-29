import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export async function LocaleLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <body>{props.children}</body>
      </html>
    </NextIntlClientProvider>
  );
}

export const config = {
  locales: ["en", "es", "fr", "ar", "de", "hi"],
  defaultLocale: "en",
};
