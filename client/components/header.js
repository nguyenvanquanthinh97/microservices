import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign in", url: "/auth/signin" },
    !currentUser && { label: "Sign up", url: "/auth/signup" },
    currentUser && { label: "Sell Tickets", url: "/tickets/new" },
    currentUser && { label: "My Orders", url: "/orders" },
    currentUser && { label: "Sign out", url: "/auth/signout" },
  ]
    .filter((link) => link)
    .map(({ label, url }) => (
      <li className="nav-item" key={url}>
        <Link className="nav-link" href={url}>
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
export default Header;
