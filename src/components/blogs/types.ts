export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  image: string;
  heroImage: string;
  tags: string[];
}

export interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

export interface BlogDetailProps {
  post: BlogPost;
}