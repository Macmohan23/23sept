import { Link } from "react-router-dom";

const AppHeader = () => {
  return (
    <header className="w-full flex items-center justify-end p-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link to="/" className="inline-flex items-center">
        <img
          src="/adroit-logo.svg"
          alt="Adroit Solutions Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>
    </header>
  );
};

export default AppHeader;
