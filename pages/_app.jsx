import { appWithI18Next, useSyncLanguage } from "ni18n";
import { ni18nConfig } from "@/ni18n.config";

import "./globals.sass";

const App = ({ Component, pageProps }) => {
    const locale =
        typeof window !== "undefined" && window.sessionStorage.getItem("lang");

    useSyncLanguage(locale);

    return <Component {...pageProps} />;
};

export default appWithI18Next(App, ni18nConfig);
