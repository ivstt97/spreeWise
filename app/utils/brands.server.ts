import { prisma } from './prisma.server'
import { BrandType } from './types.server';

export const getSafeBrands = async () => {
  const safeBrands = await prisma.brand.findMany({
    where: {
      isSafe: true
    }
  });
  return safeBrands;  
};


// export async function updateSafe(brandId: string): Promise<Brand> {
//   try {
//     const safeBrandsUpdated = await prisma.brand.update({
//       where: {
//         brandId: brandId,
//       },
//       data: {
//         isSafe: true,
//       },
//     });

//     console.log("Brand marked as safe");
//     return safeBrandsUpdated;
//   } catch (error) {
//     console.error("Error updating brand as safe:", error);
//     throw error;
//   }
// }



export const getBrandById = async (brandId: string) => {
  const brand = await prisma.brand.findUnique({
    where: {
      brandId: brandId,
    },
  });

  if (!brand) {
    throw new Error(`Brand with ID ${brandId} not found`);
  }

  return brand;
};

export const getAllBrands = async(orderBy = 'brandName') => {
  const allBrands = await prisma.brand.findMany({
    orderBy: {
      [orderBy]: 'asc',
    },
  })

  return allBrands

}

export const getAllMaterials = async(orderBy = 'materialName')  => {
  const allMaterials = await prisma.material.findMany({
    orderBy: {
      [orderBy]: 'asc'
    }
  })
  return allMaterials
}


export { prisma };

