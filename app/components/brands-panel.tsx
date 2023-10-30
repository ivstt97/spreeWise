import { Brand } from "@prisma/client";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { BrandCircle } from "~/components/brand-circle";
import { useNavigate } from "@remix-run/react";
import { BsFillBalloonHeartFill } from "react-icons/bs/index.js";

export function BrandsPanel({
  brands,
  displayAll,
  safeBrands,
}: {
  brands: Brand[];
  displayAll: boolean;
  safeBrands: Brand[];
}) {
  const navigate = useNavigate();

  if (!displayAll) {
    return (
      <div className="w-1/3 md:w-1/2 lg:w-1/6 bg-gray-200 flex flex-col">
        <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
          <h2 className="text-2xl text-black-400 font-bold">SpreeSafe</h2>
          <BsFillBalloonHeartFill className="text-6m"></BsFillBalloonHeartFill>
        </div>
        <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-4">
          {brands.map((brand) => (
            <BrandCircle
              key={brand.brandId}
              className="h-24 w-24 mx-auto flex-shrink-0"
              brand={{
                brandId: brand.brandId,
                brandName: brand.brandName,
                rateOnPeople: brand.rateOnPeople,
                rateOnPlanet: brand.rateOnPlanet,
                rateOnAnimals: brand.rateOnAnimals,
                ethicalScore: brand.ethicalScore,
                isSafe: brand.isSafe,
              }}
              onClick={() => navigate(`${brand.brandId}`)}
            />
          ))}
        </div>
        <div className="text-center p-6 bg-gray-300">
          <form action="/logout" method="post">
            <button
              type="submit"
              className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default BrandsPanel;
