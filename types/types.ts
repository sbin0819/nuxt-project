export type PostType = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
};

export type UserType = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  province: string;
  city: string;
  district: string;
  street: string;
  zipcode: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentType = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
  PostId: number;
  User: Pick<UserType, 'name' | 'username' | 'email'>;
  Post: PostType;
};
