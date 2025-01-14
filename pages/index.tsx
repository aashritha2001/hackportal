import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { buttonDatas, stats } from '../lib/data';
import { RequestHelper } from '../lib/request-helper';
import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/storage';
import KeynoteSpeaker from '../components/KeynoteSpeaker';
import HomeChallengeCard from '../components/HomeChallengeCard';

/**
 * The home page.
 *
 * Landing: /
 *
 */
export default function Home(props: {
  keynoteSpeakers: KeynoteSpeaker[];
  challenges: Challenge[];
}) {
  const router = useRouter();

  const [speakers, setSpeakers] = useState<KeynoteSpeaker[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeIdx, setChallengeIdx] = useState(0);

  const colorSchemes: ColorScheme[] = [
    {
      light: '#F2F3FF',
      dark: '#C1C8FF',
    },
    {
      light: '#D8F8FF',
      dark: '#B0F1FF',
    },
    {
      dark: '#FCD7FF',
      light: '#FDECFF',
    },
  ];

  useEffect(() => {
    // Set amount of time notification prompt gets displayed before fading out
    setTimeout(fadeOutEffect, 3000);
    setSpeakers(props.keynoteSpeakers);

    //Organize challenges in order by rank given in firebase
    setChallenges(props.challenges.sort((a, b) => (a.rank > b.rank ? 1 : -1)));
  }, []);

  useEffect(() => {
    // Initialize styles to first organization in list
    if (document.getElementById(`org${challengeIdx}`) !== null) {
      document.getElementById(`org${challengeIdx}`).style.textDecoration = 'underline';
      (
        document.getElementById(`org${challengeIdx}`).firstElementChild as HTMLElement
      ).style.display = 'block';
      document.getElementById(`card${challengeIdx}`).style.display = 'block';
    }
  });

  // Fade out notification prompt
  const fadeOutEffect = () => {
    var fadeTarget = document.getElementById('popup');

    if (fadeTarget !== undefined && fadeTarget !== null) {
      var fadeEffect = setInterval(() => {
        if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = '1';
        }
        if (parseFloat(fadeTarget.style.opacity) > 0) {
          fadeTarget.style.opacity = (parseFloat(fadeTarget.style.opacity) - 0.1).toString();
        } else {
          clearInterval(fadeEffect);
        }
      }, 100);
    }
  };

  const checkNotif = () => {
    //pop up visible if user did not enable push notif and browser supports push notif
    const isSupported =
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      firebase.messaging.isSupported();
    if (isSupported && Notification.permission !== 'granted') {
      Notification.requestPermission();
      return true;
    }
    return false;
  };

  const changeOrg = (newIdx) => {
    //make old org selected hidden
    document.getElementById(`org${challengeIdx}`).style.textDecoration = 'none';
    (document.getElementById(`org${challengeIdx}`).firstElementChild as HTMLElement).style.display =
      'none';
    document.getElementById(`card${challengeIdx}`).style.display = 'none';
    //make new org selected show
    document.getElementById(`org${newIdx}`).style.textDecoration = 'underline';
    (document.getElementById(`org${newIdx}`).firstElementChild as HTMLElement).style.display =
      'block';
    document.getElementById(`card${newIdx}`).style.display = 'block';

    setChallengeIdx(newIdx);
  };

  return (
    <>
      <Head>
        <title>HackPortal</title>
        <meta name="description" content="A default HackPortal instance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Notification info pop up */}
      {checkNotif() && (
        <div
          id="popup"
          className="fixed z-50 md:translate-x-0 translate-x-1/2 w-[22rem] rounded-md px-4 py-2 top-16 md:right-6 right-1/2 bg-red-200 md:text-base text-sm"
        >
          Turn on push notifications to stay up to date with events and announcements!
        </div>
      )}
      {/* Hero section */}
      <section className="min-h-screen p-4 bg-indigo-100">
        <div
          style={{ minHeight: 480 }}
          className="max-w-4xl mx-auto flex flex-col justify-center items-center"
        >
          <div
            className="min-w-[280px] w-8/12 h-[240px] flex flex-col justify-center relative md:mb-28 md:min-w-full before:block before:absolute before:bottom-0 before:left-0 before:w-16 before:h-16 before:bg-transparent before:border-b-4 before:border-l-4 before:border-black
          after:block after:absolute after:top-0 after:right-0 after:w-16 after:h-16 after:bg-transparent after:border-t-4 after:border-r-4 after:border-black"
          >
            <h1 className="text-center md:text-6xl text-3xl md:font-black font-bold">HackPortal</h1>
            <p className="text-center my-4 md:font-bold md:text-3xl text-xl">
              A Project by ACM Engineering and HackUTD
            </p>
          </div>
          {/* TODO: Programmatically show these based on configured times/organizer preference */}
        </div>
        <div className="flex flex-col items-center md:flex-row md:justify-around px-4 md:space-y-0 space-y-3 > * + *">
          {buttonDatas.map((button) => (
            <button
              key={button.text}
              onClick={() => router.push(button.path)}
              className="max-w-[12rem] w-[12rem] md:max-w-full bg-indigo-300 py-4"
            >
              {button.text}
            </button>
          ))}
        </div>
      </section>
      {/* Video Space */}
      <section className="z-0 relative md:h-[560px] py-[3rem] bg-white">
        <div className="flex flex-col justify-center items-center md:flex-row">
          {/* Video */}
          <iframe
            className="video"
            width="700"
            height="400"
            src="https://www.youtube.com/embed/niFBblrblqo"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          {/* Stats */}
          <div className="">
            {stats.map((stat, index) => (
              <div
                key={stat.data}
                className={`${
                  index % 2 === 0 ? 'lg:ml-40 md:ml-20 ml-14' : 'md:mr-8 mr-24'
                } text-center md:my-6 my-4`}
              >
                <p className="font-bold text-2xl text-indigo-600 lg:text-5xl">{stat.data}</p>
                <p className="font-medium text-lg lg:text-3xl">{stat.object}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featuring Keynotes speakers */}
      <section className="flex overflow-x-scroll bg-gray-200 min-h-[24rem]">
        <div className="flex items-center justify-center md:p-12 p-6 max-w-[18rem] text-2xl font-bold">
          Featuring Keynote Speakers
        </div>
        <div className="flex flex-col justify-center py-6 md:px-6">
          {/* Row 1 */}
          <div className="flex">
            {speakers.map(
              ({ name, description, fileName }, idx) =>
                idx < speakers.length / 2 && (
                  <KeynoteSpeaker
                    key={idx}
                    name={name}
                    description={description}
                    cardColor={colorSchemes[idx % 3]}
                    imageLink={fileName}
                  />
                ),
            )}
          </div>
          {/* row 2 */}
          <div className="flex md:ml-[7rem] ml-[5rem]">
            {speakers.map(
              ({ name, description, fileName }, idx) =>
                idx >= speakers.length / 2 && (
                  <KeynoteSpeaker
                    key={idx}
                    name={name}
                    description={description}
                    cardColor={colorSchemes[idx % 3]}
                    imageLink={fileName}
                  />
                ),
            )}
          </div>
        </div>
      </section>
      {/* Challenges */}
      <section className="p-6 border-2">
        <div className="font-bold text-2xl">Challenges</div>
        <div className="flex">
          {/* Challenge Orgs Selectors*/}
          <div className="md:w-1/4 w-1/5">
            {challenges.map(({ organization }, idx) => (
              <div
                id={`org${idx}`}
                className={`${idx} relative cursor-pointer text-center md:text-lg sm:text-sm text-xs md:py-6 py-4 my-4 bg-purple-200 rounded-sm`}
                key={idx}
                onClick={() => changeOrg(idx)}
              >
                {/* change arrow color in global css to match parent selector */}
                <div className="arrow-right absolute top-1/2 right-0 -translate-y-1/2 translate-x-full hidden"></div>
                {organization}
              </div>
            ))}
          </div>
          {/* Challenges Description Cards */}
          <div className="md:w-3/4 w-4/5 my-4 px-6 min-h-full">
            {/* Card */}
            {challenges.map(({ title, organization, description, prizes }, idx) => (
              <HomeChallengeCard
                key={idx}
                title={title}
                organization={organization}
                description={description}
                prizes={prizes}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data: keynoteData } = await RequestHelper.get<KeynoteSpeaker[]>(
    `${protocol}://${context.req.headers.host}/api/keynotespeakers`,
    {},
  );
  const { data: challengeData } = await RequestHelper.get<Challenge[]>(
    `${protocol}://${context.req.headers.host}/api/challenges/`,
    {},
  );
  return {
    props: {
      keynoteSpeakers: keynoteData,
      challenges: challengeData,
    },
  };
};
