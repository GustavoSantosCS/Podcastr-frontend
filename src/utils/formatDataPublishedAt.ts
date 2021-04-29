import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export function formatDataPublishedAt(date: string) {
  return format(parseISO(date), "d MMM yy", {
    locale: ptBR,
  });
}
