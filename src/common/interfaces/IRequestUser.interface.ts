export interface IRequestUser extends Request {
  user: {
    _id: string;
    email: string;
    password: string;
  };
}

export interface ISessionUser {
  _id: string;
  email: string;
  password: string;
}
