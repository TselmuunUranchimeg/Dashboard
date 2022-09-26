import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import type { AppProps } from "next/app";

export type Page = NextPage<T> & {
    getLayout?: (page: ReactElement) => ReactNode
};

export type Props = AppProps & {
    Component: Page
}

export type ResponseExercise = {
    name: string,
    exerciseCount: number,
    id: string
}