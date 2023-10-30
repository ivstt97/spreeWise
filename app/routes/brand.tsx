import { LoaderFunction, json } from "@remix-run/node";
import { Layout } from "~/components/layout";
import { BrandsPanel } from "~/components/brands-panel";
import {
  getSafeBrands,
  getAllBrands,
  getAllMaterials,
  updateSafe,
} from "~/utils/brands.server";
import { useLoaderData, Outlet, Link } from "@remix-run/react";
import React, { Suspense, useState, useEffect } from "react";
import { BsUpcScan, BsSearch } from "react-icons/bs/index.js";
import { Camera, CameraResultType, Photo } from "@capacitor/camera";
// import { createWorker } from "tesseract.js";
import { Brand } from "~/utils/types.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const safeBrands = await getSafeBrands();
  const allBrands = await getAllBrands();
  const allMaterials = await getAllMaterials();

  return json({ safeBrands, allBrands, allMaterials });
};

export default function Home() {
  const { safeBrands, allBrands, allMaterials }: any = useLoaderData();
  const [searchText, setSearchText] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [currentView, setCurrentView] = useState("brands");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [capturedImage, setCapturedImage] = useState<null | Photo>(null);
  // const worker = createWorker();

  const switchToBrandsView = () => {
    setCurrentView("brands");
  };

  const switchToMaterialsView = () => {
    setCurrentView("materials");
  };

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchText(e.target.value);
  };

  const fetchBrands = async () => {
    try {
      // const safeBrands = await getSafeBrands();
      setBrands(safeBrands);
    } catch (error) {
      console.error("Error fetching safe brands:", error);
    }
  };

  useEffect(() => {
    // Initial data fetching when the component mounts
    fetchBrands();
  }, []); // Empty dependency array to fetch data once on mount

  const filteredBrands = allBrands.filter((brand: { brandName: string }) =>
    brand.brandName.toLowerCase().includes(searchText.toLowerCase())
  );

  const openCamera = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
    });
    // 'image' contains the captured image data.
    setCapturedImage(image);
    // Create an HTMLImageElement from the captured image data
    const imgElement: any = new Image();
    imgElement.src = image.webPath; // Assuming webPath points to the image
    // Wait for the image to load
    await new Promise((resolve) => {
      imgElement.onload = resolve;
    });
  };

  // async function openCamera() { OCR BAD TRY
  //   try {
  //     // await worker.load();
  //     // await worker.loadLanguage("eng");
  //     // await worker.initialize("eng");

  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       resultType:
  //         "c:/Users/istoi/OneDrive/Работен плот/projects/spreeWise/node_modules/@capacitor/camera/dist/esm/definitions"
  //           .Uri,
  //     });

  //     setCapturedImage(image);

  //     // const {
  //     //   data: { text },
  //     // } = await worker.recognize(image.base64String);

  //     // console.log("OCR Text:", text);

  //     // await worker.terminate();
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const clearSearch = () => {
    setSearchText("");
    setShowSearchBar(!showSearchBar);
  };

  const markAsSafe = async (brandId: string) => {
    try {
      await updateSafe(brandId);
      // After marking as safe, re-fetch the data and update the local state
      fetchBrands();
    } catch (error) {
      console.error("Error marking brand as safe:", error);
    }
  };

  return (
    <Layout>
      <Outlet />
      <Outlet />
      <div className="h-full flex">
        <Suspense fallback={<div>Loading BrandsPanel...</div>}></Suspense>
        <BrandsPanel
          brands={safeBrands}
          safeBrands={safeBrands}
          displayAll={false}
        />
        <div className="w-5/6 bg-gray-100 flex flex-col">
          <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
            <div className="ml-4">
              <button
                onClick={switchToBrandsView}
                className={`mr-2 ${
                  currentView === "brands"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-gray-600"
                } px-3 py-2 rounded-md`}>
                Brands
              </button>
              <button
                onClick={switchToMaterialsView}
                className={`${
                  currentView === "materials"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-gray-600"
                } px-3 py-2 rounded-md`}>
                Materials
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-4">
            <div className="p-4 relative flex items-center justify-between">
              <div className="flex-grow">
                {showSearchBar ? (
                  <>
                    <input
                      type="text"
                      placeholder={`Search ${
                        currentView === "brands" ? "Brands" : "Materials"
                      }`}
                      value={searchText}
                      onChange={handleSearchChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <button
                      onClick={clearSearch}
                      className="absolute top-1 right-4 text-red-600 font-bold text-xl">
                      X
                    </button>
                  </>
                ) : (
                  <BsSearch
                    onClick={toggleSearchBar}
                    className="text-2m cursor-pointer"
                  />
                )}

                <div>
                  {capturedImage && (
                    <img src={capturedImage.webPath} alt="Captured Image" />
                  )}
                </div>

                <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-4">
                  {currentView === "brands" &&
                    filteredBrands.map((brand: any) => (
                      <div
                        key={brand.brandId}
                        className="border p-4 hover:bg-gray-200">
                        <Link to={`${brand.brandId}`}>
                          <p className="text-xl font-bold">{brand.brandName}</p>
                          <p className="text-base font-semibold text-blue-600">
                            SpreeScore:{" "}
                            <span className="text-yellow-500">
                              {brand.ethicalScore}
                            </span>
                          </p>
                        </Link>

                        {!brand.isSafe && (
                          <button
                            onClick={() => markAsSafe(brand.brandId)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-green-600">
                            Mark as safe
                          </button>
                        )}
                      </div>
                    ))}
                  {currentView === "materials" &&
                    allMaterials
                      .filter((material: any) =>
                        material.materialName
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                      .map((material: any) => (
                        <div
                          key={material.materialId}
                          className="border p-4 hover-bg-gray-200">
                          <p className="text-xl font-bold">
                            {material.materialName}
                          </p>
                          <p className="text-base font-semibold text-blue-600">
                            SpreeScore:{" "}
                            <span className="text-yellow-500">
                              {material.score}
                            </span>
                          </p>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
      <BsUpcScan
        onClick={openCamera}
        className="text-green-500 text-6xl cursor-pointer fixed bottom-4 right-4"></BsUpcScan>
    </Layout>
  );
}
