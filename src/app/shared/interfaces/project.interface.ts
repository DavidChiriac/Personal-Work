export interface IProject {
  title: string;
  description: string;
  url?: string;
  imageUrl: string | undefined;
  image?: { url: string };
  id: number;
  slug: string;
  presentationImages?: { url: string }[];
  presentationImagesUrl?: string[];
}
