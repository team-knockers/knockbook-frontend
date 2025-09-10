import './Footer.Module.css'

export default function Footer() {
  return (
    <footer className="footer">
      <h3 className="footer-title">(주)문앞의 책방</h3>
      <nav className="footer-nav">
        <a href="#">이용약관</a>
        <span>|</span>
        <a href="#">회사소개</a>
        <span>|</span>
        <a href="#">개인정보처리방침</a>
      </nav>
      <p className="footer-copyright">
        © 2025. (주)문앞의 책방 Co.Ltd. All rights reserved.
      </p>
    </footer>
  );
}
