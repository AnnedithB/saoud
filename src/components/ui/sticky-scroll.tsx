import React, { forwardRef } from 'react';
import Image from 'next/image';

type StickyScrollProps = React.HTMLAttributes<HTMLElement>;

const Component = forwardRef<HTMLElement, StickyScrollProps>(({ className, ...props }, ref) => {
  const PROJECT_BASE_URL = 'https://sillylittletools.com';

  const tiles = [
    // Source images are in `saoud/public/img/works/*`
    {
      src: '/img/works/topnewsongs.png',
      alt: 'Topnewsongs Music Website',
      href: `${PROJECT_BASE_URL}/topnewsongs-music-website.html`,
    },
    {
      src: '/img/works/crossroads.png',
      alt: 'Crossroads Travel Agency',
      href: `${PROJECT_BASE_URL}/crossroads-travel-agency.html`,
    },
    {
      src: '/img/works/sanlorenzo.png',
      alt: 'San Lorenzo Investments Firm',
      href: `${PROJECT_BASE_URL}/san-lorenzo-investments.html`,
    },
    {
      src: '/img/works/dependai.png',
      alt: 'Depend AI Studio',
      href: `${PROJECT_BASE_URL}/depend-ai-studio.html`,
    },
    {
      src: '/img/works/justjobs.png',
      alt: 'Just Jobs Resume Builder',
      href: `${PROJECT_BASE_URL}/just-jobs-resume-builder.html`,
    },
    {
      src: '/img/works/brandit.png',
      alt: 'Brandit Lab Advertisement Agency',
      href: `${PROJECT_BASE_URL}/brandit-lab.html`,
    },
    // Repeat to fill 13 tiles (5 + 3 + 5)
    {
      src: '/img/works/topnewsongs.png',
      alt: 'Topnewsongs Music Website',
      href: `${PROJECT_BASE_URL}/topnewsongs-music-website.html`,
    },
    {
      src: '/img/works/crossroads.png',
      alt: 'Crossroads Travel Agency',
      href: `${PROJECT_BASE_URL}/crossroads-travel-agency.html`,
    },
    {
      src: '/img/works/sanlorenzo.png',
      alt: 'San Lorenzo Investments Firm',
      href: `${PROJECT_BASE_URL}/san-lorenzo-investments.html`,
    },
    {
      src: '/img/works/dependai.png',
      alt: 'Depend AI Studio',
      href: `${PROJECT_BASE_URL}/depend-ai-studio.html`,
    },
    {
      src: '/img/works/justjobs.png',
      alt: 'Just Jobs Resume Builder',
      href: `${PROJECT_BASE_URL}/just-jobs-resume-builder.html`,
    },
    {
      src: '/img/works/brandit.png',
      alt: 'Brandit Lab Advertisement Agency',
      href: `${PROJECT_BASE_URL}/brandit-lab.html`,
    },
    {
      src: '/img/works/topnewsongs.png',
      alt: 'Topnewsongs Music Website',
      href: `${PROJECT_BASE_URL}/topnewsongs-music-website.html`,
    },
  ] as const;

  function FillImage({
    src,
    alt,
    priority,
  }: {
    src: string;
    alt: string;
    priority?: boolean;
  }) {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-md">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-all duration-300"
          priority={Boolean(priority)}
          fetchPriority={priority ? 'high' : 'auto'}
          quality={70}
        />
      </div>
    );
  }

  function TileLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-md"
      >
        {children}
      </a>
    );
  }

  return (
    <section
      className={['text-white w-full', className].filter(Boolean).join(' ')}
      ref={ref}
      {...props}
    >
      <div className="grid grid-cols-12 gap-2">
        <div className="grid gap-2 col-span-4">
          <figure className="w-full h-96">
            <TileLink href={tiles[0].href}>
              <FillImage src={tiles[0].src} alt={tiles[0].alt} priority />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[1].href}>
              <FillImage src={tiles[1].src} alt={tiles[1].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[2].href}>
              <FillImage src={tiles[2].src} alt={tiles[2].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[3].href}>
              <FillImage src={tiles[3].src} alt={tiles[3].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[4].href}>
              <FillImage src={tiles[4].src} alt={tiles[4].alt} />
            </TileLink>
          </figure>
        </div>

        <div className="sticky top-0 h-screen w-full col-span-4 gap-2 grid grid-rows-3">
          <figure className="w-full h-full">
            <TileLink href={tiles[5].href}>
              <FillImage src={tiles[5].src} alt={tiles[5].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-full">
            <TileLink href={tiles[6].href}>
              <FillImage src={tiles[6].src} alt={tiles[6].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-full">
            <TileLink href={tiles[7].href}>
              <FillImage src={tiles[7].src} alt={tiles[7].alt} />
            </TileLink>
          </figure>
        </div>

        <div className="grid gap-2 col-span-4">
          <figure className="w-full h-96">
            <TileLink href={tiles[8].href}>
              <FillImage src={tiles[8].src} alt={tiles[8].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[9].href}>
              <FillImage src={tiles[9].src} alt={tiles[9].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[10].href}>
              <FillImage src={tiles[10].src} alt={tiles[10].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[11].href}>
              <FillImage src={tiles[11].src} alt={tiles[11].alt} />
            </TileLink>
          </figure>
          <figure className="w-full h-96">
            <TileLink href={tiles[12].href}>
              <FillImage src={tiles[12].src} alt={tiles[12].alt} />
            </TileLink>
          </figure>
        </div>
      </div>
    </section>
  );
});

Component.displayName = 'Component';

export default Component;
