import clsx from "clsx";
import NextLink from "next/link";
import { useState } from "react";
import { useEffect } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollTop = window.scrollY;

    setScrolled(scrollTop > 50 ? true : false);
  };

  return (
    <header
      className={clsx(
        "sticky top-0 px-2 py-4 z-50",
        scrolled && "backdrop-blur-md shadow-lg"
      )}
    >
      <NextLink href="/" passHref>
        <a className="text-2xl font-bold text-red-600">MOVIEUA</a>
      </NextLink>
    </header>
  );
}
