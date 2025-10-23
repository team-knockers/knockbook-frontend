import { BookService } from "../../features/books/services/BookService";

export type BookCategoryItem = {
  id: string;
  categoryCodeName: string;
  categoryDisplayName: string;
  imgUrl: string;
};

export type SignupSetFavoriteCategoryPageLoaderData = {
  categories: BookCategoryItem[];
};

export async function SignupSetFavoriteCategoryPageLoader()
: Promise<SignupSetFavoriteCategoryPageLoaderData> {

  const data = await BookService.getBooksAllCategories();

  const imgMap: Record<string, string> = {
    "fiction": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg",
    "essay": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg",
    "humanities": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg",
    "parenting": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934986652.jpg",
    "cooking": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791192512761.jpg",
    "health": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198553317.jpg",
    "lifestyle": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191056372.jpg",
    "business": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788965404149.jpg",
    "selfImprovement": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788954793704.jpg",
    "politics": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936439743.jpg",
    "culture": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191114768.jpg",
    "religion": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198754080.jpg",
    "entertainment": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788934986652.jpg",
    "technology": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791192512761.jpg",
    "language": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791198553317.jpg",
    "science": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791191056372.jpg",
    "travel": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788965404149.jpg",
    "it": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788954793704.jpg",
  };

  const categories: BookCategoryItem[] = data.map(cat => ({
    id: cat.id,
    categoryCodeName: cat.categoryCodeName,
    categoryDisplayName: cat.categoryDisplayName,
    imgUrl: imgMap[cat.categoryCodeName] ?? "https://via.placeholder.com/150?text=No+Image",
  }));

  return { categories };
}
