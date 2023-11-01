export type RegisterForm = {
    firstName: string
    lastName: string
    email: string
    username: string  
    password: string
  }

  export type LoginForm = {
    email: string
    password: string
  }

  export type BrandType = {
    brandId: string;
    brandName: string;
    rateOnPeople: number;
    rateOnPlanet: number;
    rateOnAnimals: number;
    ethicalScore: number;
    isSafe: boolean;
  };