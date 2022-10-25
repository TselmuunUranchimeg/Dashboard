export interface ThreeImagesType {
    urls: string[];
}

const ThreeImages = ({ urls }: ThreeImagesType) => {
    return (
        <div className="w-full relative">
            <img
                src={urls[0]}
                alt="Image"
                className="absolute w-[45%] left-0"
            />
            <img
                src={urls[1]}
                alt="Image"
                className="absolute w-[45%] translate-y-12 left-[26%] z-20"
            />
            <img
                src={urls[2]}
                alt="Image"
                className="absolute w-[45%] right-0"
            />
        </div>
    );
};

export default ThreeImages;
