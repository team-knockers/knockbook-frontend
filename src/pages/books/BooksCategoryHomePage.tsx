import { useParams } from "react-router-dom";
import { categoryOptions } from "../../features/books/types";

export default function BooksCategoryHomePage() {
  const params = useParams();
  const categoryCodeName = params.categoryCodeName;
  const categoryLabel = categoryOptions.find(c => c.value === categoryCodeName)?.label ?? categoryCodeName;
  return (
    <main>
      <div>
        <h1>Knockbook BooksCategoryHomePage</h1>
        <h2>{categoryLabel}</h2>
      </div>
    </main>
  );
}
