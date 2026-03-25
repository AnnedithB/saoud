'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';

export type StickyScrollItem = {
  title: string;
  href: string;
  imageSrc: string;
  alt?: string;
};

type StickyScrollProps = {
  items: StickyScrollItem[];
};

const Component = forwardRef<HTMLDivElement, StickyScrollProps>(({ items }, ref) => {
  if (!items?.length) return null;

  // Keep the existing sticky-scroll layout (5 left, 3 sticky center, 5 right) and
  // repeat the provided items to fill the gallery.
  const leftCount = 5;
  const centerCount = 3;
  const rightCount = 5;
  const total = leftCount + centerCount + rightCount;

  const filled = Array.from({ length: total }, (_, i) => items[i % items.length]);
  const left = filled.slice(0, leftCount);
  const center = filled.slice(leftCount, leftCount + centerCount);
  const right = filled.slice(leftCount + centerCount);

  return (
    <ReactLenis root>
      <div ref={ref} className='bg-black'>
        <section className='text-white w-full bg-slate-950'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='grid gap-2 col-span-4'>
              {left.map((item, idx) => (
                <figure key={`${item.href}-${idx}`} className='w-full'>
                  <a href={item.href} className='block' target='_blank' rel='noreferrer'>
                    <img
                      src={item.imageSrc}
                      alt={item.alt ?? item.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : undefined}
                      decoding='async'
                      className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                    />
                  </a>
                </figure>
              ))}
            </div>

            <div className='sticky top-0 h-screen w-full col-span-4 gap-2 grid grid-rows-3'>
              {center.map((item, idx) => {
                const globalIdx = leftCount + idx;
                return (
                  <figure key={`${item.href}-${globalIdx}`} className='w-full h-full'>
                    <a href={item.href} className='block' target='_blank' rel='noreferrer'>
                      <img
                        src={item.imageSrc}
                        alt={item.alt ?? item.title}
                        loading='lazy'
                        decoding='async'
                        className='transition-all duration-300 h-full w-full align-bottom object-cover rounded-md'
                      />
                    </a>
                  </figure>
                );
              })}
            </div>

            <div className='grid gap-2 col-span-4'>
              {right.map((item, idx) => {
                const globalIdx = leftCount + centerCount + idx;
                return (
                  <figure key={`${item.href}-${globalIdx}`} className='w-full'>
                    <a href={item.href} className='block' target='_blank' rel='noreferrer'>
                      <img
                        src={item.imageSrc}
                        alt={item.alt ?? item.title}
                        loading={globalIdx === 0 ? 'eager' : 'lazy'}
                        decoding='async'
                        className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                      />
                    </a>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;
