import { ROBOT_SCENE_URL } from '@/lib/hero-assets';

export default function Head() {
  return (
    <>
      <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://prod.spline.design" />
      <link
        rel="preload"
        as="fetch"
        href={ROBOT_SCENE_URL}
        crossOrigin="anonymous"
        fetchPriority="high"
      />
    </>
  );
}

