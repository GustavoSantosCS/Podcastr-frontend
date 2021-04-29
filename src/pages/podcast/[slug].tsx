import styles from "./styles.module.scss";
import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import { api } from "../../services/api";
import {
  convertDurationToTimeString,
  formatDataPublishedAt,
} from "../../utils";
import { usePlayer } from "../../hooks/usePlayer";
import { Episode, RequestEpisode } from "../../models/Episode";

type Props = {
  episode: Episode;
};

export default function EpisodePage({ episode }: Props) {
  const { play } = usePlayer();

  return (
    <>
      <Head>
        <title>Home | {episode.title}</title>
      </Head>
      <div className={styles.episode}>
        <section>
          <div className={styles.thumbnailContainer}>
            <Link href="/">
              <a className={styles.link} type="button">
                <img src="/arrow-left.svg" alt="Voltar" />
              </a>
            </Link>
            <Image
              width={700}
              height={393}
              src={episode.thumbnail}
              objectFit="contain"
            />

            <button
              className={styles.link}
              type="button"
              onClick={() => play(episode)}
            >
              <img src="/play.svg" alt="Tocar episódio" />
            </button>
          </div>

          <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
          </header>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: episode.description }}
          />
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<RequestEpisode[]>("episodes", {
    params: {
      _limit: 6,
      _sort: "published_at",
      _order: "desc",
    },
  });

  return {
    paths: [...data.map((episode) => `/podcast/${episode.id}`)],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { data } = await api.get<RequestEpisode>(`episodes/${ctx.params.slug}`);

  const episode: Episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: formatDataPublishedAt(data.published_at),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24 * 3, // Apos 3 Dias
  };
};
