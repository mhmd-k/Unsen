function Footer() {
  return (
    <footer className="text-center py-4">
      <div className="container mx-auto px-2">
        All Rights Reserved © {new Date().getFullYear()} <span>Unsen</span>{" "}
        store - Developed by{" "}
        <span>
          <a
            href="https://mohammadalkayyali.onrender.com/"
            target="_blank"
            rel="noreferrer"
          >
            Mohammad Alkayyali
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
