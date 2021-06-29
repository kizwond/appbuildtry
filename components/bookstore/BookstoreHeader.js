import FavoriteCategory from "./header/FavoriteCategory";
import SearchBar from "./header/SearchBar";

const BookstoreHeader = () => {
  return (
    <div>
      <SearchBar />
      <FavoriteCategory />
    </div>
  );
};

export default BookstoreHeader;
