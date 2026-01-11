export interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  poster: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };
}
