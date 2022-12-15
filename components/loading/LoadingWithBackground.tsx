import LoadingComponent from "./Loading";

type LoadingWithBackgroundType = {
    loading: boolean;
}

const LoadingWithBackground = ({ loading }: LoadingWithBackgroundType) => {
    return (
        <div className = {`w-full h-full z-20 bg-black bg-opacity-60 absolute ${
            loading ? "block" : "hidden"
        } left-0 top-0`}>
            <LoadingComponent />
        </div>
    )
}

export default LoadingWithBackground;