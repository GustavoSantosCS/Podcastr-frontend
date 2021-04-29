import styles from "./homeStyles.module.scss";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { api } from "../services/api";
import { convertDurationToTimeString, formatDataPublishedAt } from "../utils";
import { Episode, RequestEpisode } from "../models/Episode";
import { usePlayer } from "../hooks/usePlayer";

type HomeProps = {
  latestEpisodes: Episode[];
  remainEpisodes: Episode[];
};

export default function Home({ latestEpisodes, remainEpisodes }: HomeProps) {
  const { playList } = usePlayer();
  const allEpisodes = [...latestEpisodes, ...remainEpisodes];

  return (
    <>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <div className={styles.homepage}>
        <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos</h2>

          <ul>
            {latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <div style={{ width: 72 }}>
                    <Image
                      width={192}
                      height={192}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </div>

                  <div className={styles.episodeDetails}>
                    <Link href={`/podcast/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => playList(allEpisodes, index)}
                  >
                    <img src="/play-green.svg" alt="Player PodCast" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.remainEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {remainEpisodes.map((episode, index) => (
                <tr key={episode.id}>
                  <td style={{ width: 69 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/podcast/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td className={styles.notBrockLine}>{episode.publishedAt}</td>
                  <td className={styles.notBrockLine}>
                    {episode.durationAsString}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(allEpisodes, index + latestEpisodes.length)
                      }
                    >
                      <img src="/play-green.svg" alt="Player PodCast" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { data } = await api.get<RequestEpisode[]>("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes: Episode[] = data.map((episode) => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: formatDataPublishedAt(episode.published_at),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration)
    ),
    description: episode.description,
    url: episode.file.url,
  }));

  const latestEpisodes = episodes.splice(0, 2);
  const remainEpisodes = episodes.splice(0, episodes.length);

  return {
    props: {
      latestEpisodes,
      remainEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
}
