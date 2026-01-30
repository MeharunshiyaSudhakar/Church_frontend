import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "60vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
