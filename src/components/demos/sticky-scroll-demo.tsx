import React from 'react';
import StickyScroll, { type StickyScrollItem } from '@/components/ui/sticky-scroll';

function StickyScrollDemo() {
  const items: StickyScrollItem[] = [
    {
      title: 'Topnewsongs Music Website',
      href: 'https://sillylittletools.com/topnewsongs-music-website.html',
      imageSrc: 'https://sillylittletools.com/img/works/topnewsongs.png',
    },
    {
      title: 'Crossroads Travel Agency',
      href: 'https://sillylittletools.com/crossroads-travel-agency.html',
      imageSrc: 'https://sillylittletools.com/img/works/crossroads.png',
    },
    {
      title: 'San Lorenzo Investments Firm',
      href: 'https://sillylittletools.com/san-lorenzo-investments.html',
      imageSrc: 'https://sillylittletools.com/img/works/sanlorenzo.png',
    },
    {
      title: 'Depend AI Studio',
      href: 'https://sillylittletools.com/depend-ai-studio.html',
      imageSrc: 'https://sillylittletools.com/img/works/dependai.png',
    },
    {
      title: 'Just Jobs Resume Builder',
      href: 'https://sillylittletools.com/just-jobs-resume-builder.html',
      imageSrc: 'https://sillylittletools.com/img/works/justjobs.png',
    },
    {
      title: 'Brandit Lab Advertisement Agency',
      href: 'https://sillylittletools.com/brandit-lab.html',
      imageSrc: 'https://sillylittletools.com/img/works/brandit.png',
    },
  ];

  return <StickyScroll items={items} />;
}

export { StickyScrollDemo as DemoOne };
