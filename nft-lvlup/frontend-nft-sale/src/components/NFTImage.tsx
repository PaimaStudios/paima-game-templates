interface NFTImageProps {
  image: string;
  status?: string;
  onImageClick?: () => void;
}

const NFTImage = ({ image, status }: NFTImageProps) => {
  return (
    <div className="relative">
      <img className="rounded-medium" src={image} />
      {status && (
        <p className="bg-white absolute left-0 right-0 mx-auto -bottom-[20px] text-14 leading-4 py-4 px-4 rounded-full max-w-[200px] text-center border font-bold uppercase">
          {status}
        </p>
      )}
    </div>
  );
};

export default NFTImage;
