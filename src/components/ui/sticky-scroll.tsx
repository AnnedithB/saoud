import React, { forwardRef } from 'react';
import Image from 'next/image';

type StickyScrollProps = React.HTMLAttributes<HTMLElement>;

const Component = forwardRef<HTMLElement, StickyScrollProps>(({ className, ...props }, ref) => {
  const PROJECT_BASE_URL = 'https://sillylittletools.com';

  const baseTiles = (
    [
      'brandit.png',
      'crossroads.png',
      'sanlorenzo.png',
      'topnewsongs.png',
      'arli.png',
      'ink.png',
      'fileconverter.png',
      'dependai.png',
      'sillylittletools.png',
      'holidayupsell.png',
      'aegean1.png',
      'holyghost.png',
      'futures.png',
      'justjobs.png',
      'kitimat.png',
      'plhh.png',
      'belle.png',
      'autest.jpeg',
    ] as const
  ).map((file) => {
    const slug = file.replace(/\.[^/.]+$/, '');
    const alt = slug.replace(/[-_]+/g, ' ').trim() || 'Project';
    return {
      src: `/img/projects/${file}`,
      alt,
      href: `${PROJECT_BASE_URL}/${slug}.html`,
    };
  });

  const MIN_TILES = 13;
  const stickyCountTarget = 3;
  const tilesUnpadded =
    baseTiles.length >= MIN_TILES
      ? baseTiles
      : Array.from({ length: MIN_TILES }, (_, i) => baseTiles[i % baseTiles.length]);

  // Ensure left and right columns have the same count:
  // after removing the sticky middle tiles, the remainder must be even.
  const tiles =
    (tilesUnpadded.length - Math.min(stickyCountTarget, tilesUnpadded.length)) % 2 === 0
      ? tilesUnpadded
      : [...tilesUnpadded, tilesUnpadded[0]];

  const stickyCount = Math.min(stickyCountTarget, tiles.length);
  const remaining = tiles.length - stickyCount;
  const leftCount = Math.ceil(remaining / 2);
  const leftTiles = tiles.slice(0, leftCount);
  const stickyTiles = tiles.slice(leftCount, leftCount + stickyCount);
  const rightTiles = tiles.slice(leftCount + stickyCount);

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
      className={['text-white w-[calc(100%+4rem)] -mx-8 max-w-none', className].filter(Boolean).join(' ')}
      ref={ref}
      {...props}
    >
      <div className="grid grid-cols-12 gap-2">
        <div className="grid gap-2 col-span-4">
          {leftTiles.map((t, idx) => (
            <figure key={`${t.src}:${idx}`} className="w-full h-96">
              <TileLink href={t.href}>
                <FillImage src={t.src} alt={t.alt} priority={idx === 0} />
              </TileLink>
            </figure>
          ))}
        </div>

        <div
          className="sticky top-0 h-screen w-full col-span-4 gap-2 grid"
          style={{ gridTemplateRows: `repeat(${Math.max(1, stickyTiles.length)}, minmax(0, 1fr))` }}
        >
          {stickyTiles.map((t, idx) => (
            <figure key={`${t.src}:sticky:${idx}`} className="w-full h-full">
              <TileLink href={t.href}>
                <FillImage src={t.src} alt={t.alt} />
              </TileLink>
            </figure>
          ))}
        </div>

        <div className="grid gap-2 col-span-4">
          {rightTiles.map((t, idx) => (
            <figure key={`${t.src}:right:${idx}`} className="w-full h-96">
              <TileLink href={t.href}>
                <FillImage src={t.src} alt={t.alt} />
              </TileLink>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
});

Component.displayName = 'Component';

export default Component;
