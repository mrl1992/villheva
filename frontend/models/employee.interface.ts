export interface Employee {
  _id: string;
  name: string;
  slug: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  order?: number;
  isActive: boolean;
}
