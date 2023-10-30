import { Brand } from "@prisma/client";

interface props {
  brand: Brand;
  className?: string;
  onClick?: (...args: any) => any;
}

export function BrandCircle({ brand, onClick, className }: props) {
  return (
    <div
      className={`${className} cursor-pointer bg-gray-400 rounded-full flex justify-center items-center`}
      onClick={onClick}>
      <h2>{brand.brandName.toUpperCase()}</h2>
    </div>
  );
}
