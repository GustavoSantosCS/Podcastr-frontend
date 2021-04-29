import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContextProvider } from "../contents/PlayerContext";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <section className={styles.main}>
            <Component {...pageProps} />
          </section>
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
