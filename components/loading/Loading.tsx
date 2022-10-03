import CircularProgress from "@mui/material/CircularProgress";

type LoadingComponentType = {
    className?: string;
};

const LoadingComponent = ({ className }: LoadingComponentType) => {
    return (
        <div className = {`flex items-center justify-center h-full w-full ${className}`}>
            <CircularProgress />
        </div>
    )
}

export default LoadingComponent;