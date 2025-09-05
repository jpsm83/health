import { IArticle } from "@/interfaces/article";
import axios, { type AxiosInstance } from "axios";
import { handleAxiosError } from "@/lib/utils/handleAxiosError";

// Generic API response interface for all services
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// Paginated response interface
export interface IPaginatedResponse<T> {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  data: T[];
}

// For server-side requests, use absolute URL
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || "";
  } else {
    // Server-side - construct absolute URL
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host =
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "localhost:3000";
    return `${protocol}://${host}`;
  }
};

// Check if we're in a server component context
const isServerComponent = () => {
  return typeof window === "undefined" && process.env.NODE_ENV !== "test";
};

const API_BASE = "/api/v1";

export interface GetArticlesParams {
  category?: string;
  slug?: string;
  locale?: string;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  query?: string;
  page?: number;
  excludeIds?: string[];
}

class ArticleService {
  private instance: AxiosInstance;

  constructor() {
    const baseUrl = getBaseUrl();
    this.instance = axios.create({
      baseURL: `${baseUrl}${API_BASE}`,
      withCredentials: true, // ensures cookies are sent
      timeout: 10000, // 10 second timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for server-side debugging
    if (isServerComponent()) {
      this.instance.interceptors.request.use(
        (config) => {
          return config;
        },
        (error) => {
          console.error("Server-side API request error:", error);
          return Promise.reject(error);
        }
      );
    }
  }

  // Generic request wrapper with centralized error handling
  private async handleRequest<T>(
    requestFn: () => Promise<{ data: T }>
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  // get all articles
  async getArticles(params: GetArticlesParams = {}): Promise<IArticle[]> {
    const {
      page = 1,
      limit = 6,
      sort = "createdAt",
      order = "desc",
      locale = "en",
      excludeIds,
    } = params;
    try {
      const requestParams: Record<string, string | number> = {
        page,
        limit,
        sort,
        order,
        locale,
      };

      if (excludeIds && excludeIds.length > 0) {
        requestParams.excludeIds = JSON.stringify(excludeIds);
      }

      const result = await this.handleRequest<IPaginatedResponse<IArticle>>(
        () =>
          this.instance.get("/articles", {
            params: requestParams,
          })
      );

      // Return the data array, or empty array if no data
      return result.data || [];
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  // get article by id
  async getArticleById(id: string, locale = "en"): Promise<IArticle> {
    try {
      const result = await this.handleRequest<IArticle>(() =>
        this.instance.get(`/articles/${id}`, {
          params: {
            locale,
          },
        })
      );
      return result;
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  }

  // get all articles by category
  async getArticlesByCategory(
    params: GetArticlesParams & { category: string }
  ): Promise<IArticle[]> {
    const {
      page = 1, // fallback if excludeIds not used
      limit = 6,
      sort = "createdAt",
      order = "desc",
      locale = "en",
      category,
      excludeIds,
    } = params;

    try {
      const requestParams: Record<string, string | number> = {
        page,
        limit,
        sort,
        order,
        locale,
        category,
      };

      // Pass excludeIds as JSON if provided
      if (excludeIds && excludeIds.length > 0) {
        requestParams.excludeIds = JSON.stringify(excludeIds);
      }

      const result = await this.handleRequest<IPaginatedResponse<IArticle>>(
        () => this.instance.get("/articles", { params: requestParams })
      );

      return result.data || [];
    } catch (error) {
      console.error("Error fetching articles by category:", error);
      return [];
    }
  }

         // get all articles by category paginated
     async getArticlesByCategoryPaginated(
       params: GetArticlesParams & { category: string }
     ): Promise<IPaginatedResponse<IArticle>> {
       const {
         page = 1,
         limit = 6,
         sort = "createdAt",
         order = "desc",
         locale = "en",
         category,
         excludeIds,
       } = params;
   
       try {
         const requestParams: Record<string, string | number> = {
           page,
           limit,
           sort,
           order,
           locale,
           category,
         };
   
         // Pass excludeIds as JSON if provided
         if (excludeIds && excludeIds.length > 0) {
           requestParams.excludeIds = JSON.stringify(excludeIds);
         }
   
         const result = await this.handleRequest<IPaginatedResponse<IArticle>>(
           () => this.instance.get("/articles/paginated", { params: requestParams })
         );
   
         return result;
       } catch (error) {
         console.error("Error fetching articles by category paginated:", error);
         return {
           page: 1,
           limit: 6,
           totalDocs: 0,
           totalPages: 0,
           data: [],
         };
       }
     }
  
  // get article by category and slug
  async getArticleByCategoryAndSlug(slug: string): Promise<IArticle> {
    try {
      const result = await this.handleRequest<IArticle>(() =>
        this.instance.get("/articles", {
          params: {
            slug,
          },
        })
      );
      return result;
    } catch (error) {
      console.error("Error fetching article by category and slug:", error);
      throw error;
    }
  }
}

// Export singleton instance for API calls
export const articleService = new ArticleService();
