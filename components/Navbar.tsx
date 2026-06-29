import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLogo}>
        <a href="#">Maison verin</a>
      </div>
      <div className={styles.navLinks}>
        <a href="#">Lookbook</a>
        <a href="#">Portrait Series</a>
        <a href="#">Studio Journal</a>
        <a href="#">Contact</a>
      </div>
      <div className={styles.navCta}>
        <a href="#">Join Maison</a>
      </div>
    </nav>
  );
}
