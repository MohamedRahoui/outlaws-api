interface IRoute {
  path: string;
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';
  skip?: boolean;
}
interface ITokenUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  id: string;
  role: 'USER' | 'STAFF';
}
interface IToken {
  outlaws: string;
  outlawsData: string;
  user: ITokenUser;
}

interface IUserPoints {
  validatedPetitions: number;
  petitionsInProgress: number;
  currentPoints?: number;
}
// FORMS

// Petition
type IPetitionSchema = {
  identity_card: Express.Multer.File[];
  signature: Express.Multer.File;
  firstname: string;
  lastname: string;
  address: string;
  cin: string;
  electoral_number: string;
  email: string;
};
export { IRoute, IToken, ITokenUser, IPetitionSchema, IUserPoints };
