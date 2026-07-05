export interface ForumAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
}

export interface ForumSpecialization {
  id: number;
  name: string;
}

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected";
  likesCount: number;
  commentsCount: number;
  tags: string[];
  isLiked: boolean;
  author: ForumAuthor;
  specialization: ForumSpecialization;
}

export interface PaginatedForumResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ForumSearchParams {
  keyword?: string;
  specializationId?: number;
  sortBy?: "newest" | "most_liked" | "most_commented" | "unanswered";
  page?: number;
  limit?: number;
}
