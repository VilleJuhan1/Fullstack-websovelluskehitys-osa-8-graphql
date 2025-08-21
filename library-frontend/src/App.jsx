import { useState } from "react";
import Authors from "./components/Authors";
import NewBook from "./components/NewBook";
import SetBirthyear from "./components/SetBirthyear";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";
import BooksRefactored from "./components/BooksRefactored";
import Notification from "./components/Notification";
import { ADDED_BOOK, ALL_BOOKS } from "./queries";
import { useApolloClient, useSubscription } from "@apollo/client";
//import { set } from "mongoose";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("library-app-token"));
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("library-app-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const client = useApolloClient()

  // 8.24 Tilauksen avulla haetaan ja lisätään uusi kirja välimuistiin
  useSubscription(ADDED_BOOK, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded;

      client.cache.updateQuery({ query: ALL_BOOKS }, (existing) => {
        return {
          allBooks: existing.allBooks.concat(newBook),
        };
      });

      setNotification(`New book added: ${newBook.title} by ${newBook.author.name}`);
      setTimeout(() => setNotification(null), 5000);
    },
  });

  // Uloskirjautuminen nollaa tokenin ja käyttäjän tilan
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  // Jos tokenia ei ole, näytetään vain kirjautumislomake
  if (!token) {
    return (
      <>
        <Notification message={notification} />
        <LoginForm setToken={setToken} setUser={setUser} setNotification={setNotification} />
      </>
    )
  }

  // Jos token on olemassa, näytetään sovelluksen pääsivu
  return (
    <div>
      <Notification message={notification} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("booksRefactored")}>books (refactored)</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("setBirthyear")}>set birthyear</button>
        <button onClick={() => setPage("recommended")}>recommended</button>
        <button onClick={logout}>logout</button>
        {user && user.username && <span style={{ marginLeft: '20px' }}>Welcome, {user.username}!</span>}
      </div>
      {/* Näytetään komponentit sen mukaan, mikä sivu on valittu */}
      <Authors show={page === "authors"} />
      <BooksRefactored show={page === "booksRefactored"} />
      <NewBook show={page === "add"} />
      <SetBirthyear show={page === "setBirthyear"} />
      <Recommended show={page === "recommended"} user={user} />
    </div>
  );
};

export default App;
