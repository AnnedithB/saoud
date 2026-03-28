import React, { forwardRef } from 'react';
import Image from 'next/image';

type StickyScrollProps = React.HTMLAttributes<HTMLElement>;

const PROJECT_FILES = [
  'brandit.png',
  'crossroads.png',
  'sanlorenzo.png',
  'topnewsongs.png',
  'arli.png',
  'ink.png',
  'fileconverter.png',
  'dependai.png',
  'holidayupsell.png',
  'sillylittletools.png',
  'aegean1.png',
  'holyghost.png',
  'futures.png',
  'justjobs.png',
  'kitimat.png',
  'plhh.png',
  'belle.png',
  'autest.jpeg',
] as const;

/** Canonical HTML filename on sillylittletools.com (see repo root *.html). */
const PROJECT_PAGE_HTML: Record<(typeof PROJECT_FILES)[number], string> = {
  'brandit.png': 'brandit-lab.html',
  'crossroads.png': 'crossroads-travel-agency.html',
  'sanlorenzo.png': 'san-lorenzo-investments.html',
  'topnewsongs.png': 'topnewsongs-music-website.html',
  'arli.png': 'arli.html',
  'ink.png': 'ink.html',
  'fileconverter.png': 'fileconverter.html',
  'dependai.png': 'depend-ai-studio.html',
  'holidayupsell.png': 'holidayupsell.html',
  'sillylittletools.png': 'sillylittletools.html',
  'aegean1.png': 'aegean1.html',
  'holyghost.png': 'holyghost.html',
  'futures.png': 'futures.html',
  'justjobs.png': 'just-jobs-resume-builder.html',
  'kitimat.png': 'kitimat.html',
  'plhh.png': 'plhh.html',
  'belle.png': 'belle.html',
  'autest.jpeg': 'autest.html',
};

const Component = forwardRef<HTMLElement, StickyScrollProps>(({ className, ...props }, ref) => {
  const PROJECT_BASE_URL = 'https://sillylittletools.com';

  const baseTiles = PROJECT_FILES.map(file => {
    const slug = file.replace(/\.[^/.]+$/, '');
    const alt = slug.replace(/[-_]+/g, ' ').trim() || 'Project';
    const pageHtml = PROJECT_PAGE_HTML[file];
    return {
      src: `/img/projects/${file}`,
      alt,
      href: `${PROJECT_BASE_URL}/${pageHtml}`,
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
      <div className="relative h-full w-full overflow-hidden rounded-lg border-[3px] border-white/20 shadow-md transition-[box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-violet-300/55 group-hover:shadow-[0_28px_56px_-12px_rgba(0,0,0,0.65)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
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
        className="group relative z-0 block h-full w-full cursor-pointer rounded-lg outline-none transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:z-20 hover:-translate-y-2 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        {children}
      </a>
    );
  }

  return (
    <section
      className={['text-white w-[calc(100%+4rem)] -mx-8 max-w-none overflow-visible', className].filter(Boolean).join(' ')}
      ref={ref}
      {...props}
    >
      <div className="grid grid-cols-12 gap-2 overflow-visible">
        <div className="grid gap-2 col-span-4 overflow-visible">
          {leftTiles.map((t, idx) => (
            <figure key={`${t.src}:${idx}`} className="relative w-full h-96 overflow-visible">
              <TileLink href={t.href}>
                <FillImage src={t.src} alt={t.alt} priority={idx === 0} />
              </TileLink>
            </figure>
          ))}
        </div>

        <div
          className="sticky top-0 h-screen w-full col-span-4 grid gap-2 overflow-visible"
          style={{ gridTemplateRows: `repeat(${Math.max(1, stickyTiles.length)}, minmax(0, 1fr))` }}
        >
          {stickyTiles.map((t, idx) => (
            <figure key={`${t.src}:sticky:${idx}`} className="relative w-full min-h-0 h-full overflow-visible">
              <TileLink href={t.href}>
                <FillImage src={t.src} alt={t.alt} />
              </TileLink>
            </figure>
          ))}
        </div>

        <div className="grid gap-2 col-span-4 overflow-visible">
          {rightTiles.map((t, idx) => (
            <figure key={`${t.src}:right:${idx}`} className="relative w-full h-96 overflow-visible">
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
