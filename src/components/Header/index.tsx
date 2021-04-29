import style from "./styles.module.scss";
import Link from "next/link";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";

export function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });

  return (
    <header className={style.headerContainer}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Logo Podcastr" />
        </a>
      </Link>
      <p>O melhor para vocé ouvir sempre</p>
      <span>{currentDate}</span>
    </header>
  );
}
