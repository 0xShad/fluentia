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
      avatar:
        "https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/467770476_1247973759653184_403617074245582823_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHOzfANKy-oqm-k8EAZXmmxQJ-_AXk1RDVAn78BeTVENSnAkyxhKw8xs_t5wnLTKFSqpqd8GeTFelZA7-DVqTfz&_nc_ohc=wxwhMii9hP8Q7kNvwEpQsQ4&_nc_oc=AdkeTi7aF2hHAcEuADiqWNAnepQ0lDh1oP03ucGnKoKKVGxN_0efLhf0R8RThT8c3kA&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&_nc_gid=Bdv_O6WO0bAUDBBgoCen_w&_nc_ss=8&oh=00_AfxAslkRy6Oz46-Yb8KIqubVK1Xe80IbODUJX295J_N7og&oe=69BD9E0D",
    },
    text: "Practicing with the AI voice coach felt so natural. The live hints were a game changer for my confidence.",
    href: "https://twitter.com/prince_amo",
  },
  {
    author: {
      name: "Samuel Muralididy",
      handle: "@samuel_m",
      avatar:
        "https://i.guim.co.uk/img/media/89185ff1a69b7f790d3d69ebef205e5451ea4bb5/0_273_6720_4032/master/6720.jpg?width=465&dpr=1&s=none&crop=none",
    },
    text: "I use Fluentia before big client pitches. It catches my filler words and helps me pace my delivery perfectly.",
    href: "https://twitter.com/samuel_m",
  },
  {
    author: {
      name: "Shadrack Castro",
      handle: "@shadrack_c",
      avatar:
        "https://scontent.fmnl17-7.fna.fbcdn.net/v/t1.6435-9/66521667_920359664982123_5510012998577553408_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeGO8Eevp5x_wkORWF9Y6q9mr76JoSO3rmevvomhI7euZ2VFB9vF5rMrdbqmtOAqAX6x8P3quk1L8HPfA7LtkFWL&_nc_ohc=dD-M0MucD84Q7kNvwGU9woY&_nc_oc=AdmMrojeUumNAMg4oKDXoXERcR3NhPZp2fUWN9tTCTW2gvJ5BrNhyqtaMLRsjF0zKZg&_nc_zt=23&_nc_ht=scontent.fmnl17-7.fna&_nc_gid=JGqrdCKx6OGhP3USr3wwNA&_nc_ss=8&oh=00_AfwPVDZtbC9I1ZC90jd3IyT4UJ_vWN24ARr8ljdDHuycWg&oe=69DF4761",
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
