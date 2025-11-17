// "use client";

import { Link } from "react-router-dom";
import "../App.css";
import Header from "../components/Header";
import { useState, useEffect } from "react";

function Home() {
  const [count, setCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleKurang = () => {
    setCount(count - 1);
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  async function fetchBooks() {
    try {
      const response = await fetch("https://dummy-api-book-leb6.vercel.app/api/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log("Error fetching books:", error);
    }
  }

  // const isActive = true;
  const linkisActive = isActive ? "bg-blue-500" : "bg-red-500";

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <Header title={"Handoko"} />
      <div className="flex flex-col gap-4">
        <button onClick={handleClick} className={linkisActive}>
          Tambah
        </button>
        <button onClick={handleToggle} className={linkisActive}>
          Toggle
        </button>
        <button onClick={handleKurang} className={linkisActive}>
          Kurang
        </button>
        <p>Count: {count}</p>
        <h1 id="halo"></h1>
        <h2>Books</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id} className="book">
              {book.title}, <br />
              author: {book.author} <br /> Year: {book.year}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;
