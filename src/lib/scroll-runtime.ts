import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Loaded on the client only, shared by the scroll driver and hero choreography.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
