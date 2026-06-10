// Static testimonial data — lives outside components so it's
// not re-created on every render and is tree-shakeable.
export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface Testimonial {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

export const testimonials: Testimonial[] = [
  {
    author: {
      name: "Prince Amorsolo Remo",
      handle: "@prince_amo",
      avatar: "/remo.jpg",
    },
    text: "Practicing with the AI voice coach felt so natural. The live hints were a game changer for my confidence.",
    href: "https://twitter.com/prince_amo",
  },
  {
    author: {
      name: "Samuel Muralididy",
      handle: "@samuel_m",
      avatar: "/samuel.jpg",
    },
    text: "I use Fluentia before big client pitches. It catches my filler words and helps me pace my delivery perfectly.",
    href: "https://twitter.com/samuel_m",
  },
  {
    author: {
      name: "Shadrack Castro",
      handle: "@shadrack_c",
      avatar:
        "/shad.jpeg",
    },
    text: "The judgment-free zone gave me the safe space I needed to practice academic discussions without feeling embarrassed.",
  },
  {
    author: {
      name: "Alex W.",
      handle: "@alexp",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    text: "Being able to set up custom roleplay scenarios for difficult team conversations is absolutely invaluable.",
  },
];
