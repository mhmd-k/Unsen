import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="text-center py-4">
      <Container>
        All Rights Reserved © 2023 <span>Unsen</span> store - Developed by{" "}
        <span>
          <a
            href="https://mhmd-k.github.io/portfolio/"
            target="_blank"
            rel="noreferrer"
          >
            Mohammad Alkayyali
          </a>
        </span>
      </Container>
    </footer>
  );
}

export default Footer;
