'use client'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ScrollyComponent: React.FC = () => {
  useGSAP(() => {
    const svg1TL = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip1 .clip__inner",
        scrub: 2,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true
      }
    });

    svg1TL.fromTo("#svg1 video, #svg1 img", { y: "30%" }, { y: 0 }, 0)
      .fromTo("#svg1", { width: () => window.innerWidth < 600 ? 70 : 200 }, { width: () => window.innerWidth < window.innerHeight ? "100vh" : "100vw", ease: "none" }, 0);

    const initScrollAnimations = (svgId: string, triggerStart: number, triggerEnd: number) => {
      gsap.set(svgId, { y: "100vh" });
      gsap.to(svgId, {
        y: 0, x: 0, scrollTrigger: {
          trigger: "body",
          scrub: true,
          start: `${triggerStart} bottom`,
          end: `${triggerEnd} bottom`,
        }
      });

      const svgTL = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          scrub: 2,
          start: `${triggerEnd} bottom`,
          end: `${triggerEnd + window.innerHeight} bottom`,
          invalidateOnRefresh: true
        }
      });

      svgTL.fromTo(`${svgId} video, ${svgId} img`, { y: "30%" }, { y: 0 }, 0)
        .fromTo(svgId, { width: () => window.innerWidth < 600 ? 70 : 200 }, { width: () => window.innerWidth < window.innerHeight ? "100vh" : "100vw", ease: "none" }, 0);
    };

    initScrollAnimations("#svg2", window.innerHeight * 2, window.innerHeight * 3);
    initScrollAnimations("#svg3", window.innerHeight * 4, window.innerHeight * 5);
    initScrollAnimations("#svg4", window.innerHeight * 6, window.innerHeight * 7);
  });

  return (
    <main className="flex flex-col w-full justify-start overflow-x-hidden bg-[#f7f0ea] font-sans">
      <nav className="menu flex fixed z-50 top-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-80px)] justify-between my-10">
        <a href="#" className="menu__left font-semibold text-sm text-black no-underline">Lorem ipsum</a>
        <ul className="menu__right flex gap-x-16">
          <li><a href="#" className="font-semibold text-sm text-black no-underline">Work</a></li>
          <li><a href="#" className="font-semibold text-sm text-black no-underline">About</a></li>
          <li><a href="#" className="font-semibold text-sm text-black no-underline">Contact</a></li>
        </ul>
      </nav>
      <section className="clip h-[150vh]" id="clip1">
        <div className="clip__inner flex flex-col relative w-full h-[100vh]">
          <h1 className="flex items-end h-[40vh] text-[10vw] text-center max-w-[1100px] my-[5vw]">Find your star</h1>
          <div className="clip__cols flex w-[70vw] h-[45vh] gap-x-10 items-start max-w-[1100px]">
            <p className="text-[1.48vw] w-1/2">
              SOTD Challenge : Inspired by <a href="https://2authenticators.co/" className="text-black">2 Authenticators</a> website animation (SOTD, Apr 11, 2023)
              <br /><br />
              First time exploring Morph SVG.
            </p>
            <p className="text-[1.48vw] w-1/2">
              Nulla hendrerit metus lacinia magna rhoncus suscipit. Sed faucibus posuere tempor. Ut suscipit et urna a gravida.
              <br />
              Nulla hendrerit metus lacinia magna rhoncus suscipit. Sed faucibus posuere tempor. Ut suscipit et urna a gravida.
            </p>
          </div>
        </div>
      </section>
      {["clip1", "clip2", "clip3", "clip4"].map((clip, index) => (
        <section className={`clip__scroll flex flex-col h-[100vh] ${index === 0 ? 'pt-0' : 'pt-[100vh]'}`} id={`${clip}__scroll`} key={index}>
          <h2 className="text-white text-[10vw] mb-[6vw]">Le {clip}</h2>
          <div className="clip__cols flex w-[70vw] gap-x-10 max-w-[1100px]">
            <p className="text-[1.48vw] w-1/2 text-white">
              SOTD Challenge : Inspired by <a href="https://2authenticators.co/" className="text-white">2 Authenticators</a> website animation (SOTD, Apr 11, 2023)
              <br /><br />
              First time exploring Morph SVG.
            </p>
            <p className="text-[1.48vw] w-1/2 text-white">
              Nulla hendrerit metus lacinia magna rhoncus suscipit. Sed faucibus posuere tempor. Ut suscipit et urna a gravida.
              <br />
              Nulla hendrerit metus lacinia magna rhoncus suscipit. Sed faucibus posuere tempor. Ut suscipit et urna a gravida.
            </p>
          </div>
        </section>
      ))}
      {[1, 2, 3, 4].map((id) => (
        <figure className="fixed z-20 top-1/2 left-1/2 w-[200px] aspect-square transform -translate-x-1/2 -translate-y-1/2" id={`svg${id}`} key={id}>
          <video loop autoPlay muted className="absolute top-1/2 left-1/2 w-screen h-auto object-cover transform -translate-x-1/2 -translate-y-1/2" poster={`https://images.unsplash.com/photo-${id}800${id}0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80`}>
            <source src={`http://thenewcode.com/assets/videos/video${id}.mp4`} type="video/mp4" />
          </video>
        </figure>
      ))}
    </main>
  );
};

export default ScrollyComponent;
