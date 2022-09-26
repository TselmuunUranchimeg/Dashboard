import { SessionProvider } from "next-auth/react";
import { Props } from "../types/page.types";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: Props) {
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <SessionProvider session = {session}>
            {getLayout(<Component { ...pageProps } />)}
        </SessionProvider>
    );
}

export default MyApp;
