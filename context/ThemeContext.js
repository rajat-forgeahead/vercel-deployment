'use client'
import React, { createContext, useState, useEffect } from "react";
import "../styles/globals.css"
import { ThemeProvider } from 'next-themes';
// create context
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
    </ThemeProvider>
  );
};

export { ThemeContext, ThemeProvider };