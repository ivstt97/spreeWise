import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { Modal } from "~/components/modal";
import { getBrandById } from "~/utils/brands.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { brandId } = params;

  if (typeof brandId !== "string") {
    return redirect("/brand");
  }

  const currBrand = await getBrandById(brandId);

  return json({ currBrand });
};

export default function Brand() {
  const { currBrand } = useLoaderData();
  const { brandName, rateOnPeople, rateOnAnimals, rateOnPlanet, ethicalScore } =
    currBrand;

  return (
    <Modal isOpen={true} className="w-2/3 p-4 sm:p-8 lg:p-10 xl:p-12">
      <div className="relative">
        <button
          className="absolute top-0 right-0 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600"
          style={{ zIndex: 1 }}>
          How We Rate?
        </button>
        <div className="flex flex-col items-start p-4 sm:p-8 border border-gray-300 rounded-lg bg-gray-100 shadow-md">
          <h2 className="text-3xl font-semibold text-green-700 my-2 sm:my-4">
            {brandName}
          </h2>
          <div className="mb-2 sm:mb-4">
            <p className="font-semibold">Rate on People:</p>
            <p className="text-lg">{rateOnPeople}</p>
          </div>
          <div className="mb-2 sm:mb-4">
            <p className="font-semibold">Rate on Animals:</p>
            <p className="text-lg">{rateOnAnimals}</p>
          </div>
          <div className="mb-2 sm:mb-4">
            <p className="font-semibold">Rate on Planet:</p>
            <p className="text-lg">{rateOnPlanet}</p>
          </div>
          <div className="mb-2 sm:mb-4">
            <p className="font-semibold text-green-700">Total Ethical Score:</p>
            <p className="text-2xl text-green-700 font-bold">{ethicalScore}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
