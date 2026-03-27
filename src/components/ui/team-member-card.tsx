'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TeamMemberCardProps {
  position?: 'left' | 'right';
  jobPosition?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  description?: string;
  className?: string;
}

export default function TeamMemberCard({
  position = 'left',
  jobPosition = 'Backend Engineer',
  firstName = 'Jennie',
  lastName = 'Garcia',
  imageUrl = 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?fm=jpg&q=60',
  description = 'Jennie is a skilled developer with expertise in modern web technologies and a passion for creating seamless user experiences.',
  className,
}: TeamMemberCardProps) {
  const fullName = `${firstName} ${lastName}`;
  const isPositionRight = position === 'right';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative flex flex-col justify-center', className)}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p
          className={cn(
            'mb-4 text-xs font-medium tracking-[0.3em] text-zinc-300/80 uppercase',
            isPositionRight && 'text-right',
          )}
        >
          {jobPosition}
        </p>
      </motion.div>

      <div
        className={cn(
          'relative flex flex-col items-stretch gap-8 md:flex-row md:items-center md:gap-12',
          isPositionRight && 'md:flex-row-reverse',
        )}
      >

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative h-[420px] w-full shrink-0 overflow-hidden md:h-[500px] md:w-[360px]',
          )}
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          <Image
            src={imageUrl}
            alt={fullName}
            fill
            sizes="(min-width: 768px) 360px, 100vw"
            className="object-cover duration-500 ease-[0.22,1,0.36,1] hover:scale-105 will-change-transform"
            // Keep main-thread work low; Next will lazy-load by default when offscreen.
            priority={false}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative z-10 flex flex-col gap-6 md:w-[calc(100%-360px)]',
            isPositionRight && 'md:items-end',
          )}
        >
          <div className={cn('space-y-3', isPositionRight && 'text-right')}>
            <p className={cn('text-5xl leading-[1.05] font-extralight tracking-tight text-white', isPositionRight && 'text-right')}>
              {firstName}
              <br />
              <span className="font-normal text-white/95">{lastName}</span>
            </p>
            <p className="text-base md:text-lg leading-7 md:leading-8 text-white/65">
              {description}
            </p>
          </div>

          <div className={cn('flex items-center gap-8', isPositionRight && 'justify-end')}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'group flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors duration-300 hover:border-white/60 hover:bg-white/10',
                isPositionRight && 'order-1',
              )}
              role="button"
              aria-label="Open details"
              tabIndex={0}
            >
              <ArrowRight
                size={22}
                className={cn(
                  'text-white/70 transition-all duration-300 group-hover:-rotate-45 group-hover:text-white',
                  isPositionRight && 'rotate-180 group-hover:rotate-[225deg]',
                )}
              />
            </motion.div>

            <div className="h-px flex-1 bg-white/10" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

