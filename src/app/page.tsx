import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const recommendedPosts = [
  {
    id: 1,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and delightful.",
    tags: ["Programming", "Frontend", "Coding"],
    author: "John Doe",
    date: "27 May 2025",
    image: "/dummy-home-article.png",
  },
  {
    id: 2,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and delightful.",
    tags: ["Programming", "Frontend", "Coding"],
    author: "John Doe",
    date: "27 May 2025",
    image: "/dummy-home-article.png",
  },
  {
    id: 3,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and delightful.",
    tags: ["Programming", "Frontend", "Coding"],
    author: "John Doe",
    date: "27 May 2025",
    image: "/dummy-home-article.png",
  },
  {
    id: 4,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and delightful.",
    tags: ["Programming", "Frontend", "Coding"],
    author: "John Doe",
    date: "27 May 2025",
    image: "/dummy-home-article.png",
  },
  {
    id: 5,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and delightful.",
    tags: ["Programming", "Frontend", "Coding"],
    author: "John Doe",
    date: "27 May 2025",
    image: "/dummy-home-article.png",
  },
];

const mostLikedPosts = [
  {
    id: 1,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about...",
  },
  {
    id: 2,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about...",
  },
  {
    id: 3,
    title: "5 Reasons to Learn Frontend Development in 2025",
    excerpt:
      "Frontend development is more than just building beautiful user interfaces — it's about...",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          <section className="w-full lg:flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl leading-8.5 -tracking-[0.03em] md:text-[28px] md-leading-[38px]">
                Recommend For You
              </h2>
            </div>

            <div className="mt-6 space-y-8">
              {recommendedPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-5 border-b border-[#e7e9ee] pb-8 md:flex-row md:items-stretch"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="hidden md:flex rounded-[6px] object-cover md:h-64.5 md:w-85"
                  />
                  <div className="flex-1 space-y-3">
                    <h3 className="text-base font-bold leading-7.5 -tracking-[0.03em] md:text-xl md:leading-8.5 ">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full ring ring-inset ring-neutral-300 py-1 px-3 text-xs leading-6 -tracking-[0.03em] text-neutral-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs leading-6 -tracking-[0.03em] md:text-sm md:leading-7 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 overflow-hidden rounded-full bg-[#e5e7eb]">
                          <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                            alt={post.author}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-[#111827]">
                          {post.author}
                        </span>
                      </div>
                      <span>•</span>
                      <span className="text-neutral-600">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                      <div className="flex items-center gap-2">
                        <img
                          src="/like-icon.svg"
                          alt="Likes"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">20</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="/comment-icon.svg"
                          alt="Comments"
                          className="h-4 w-4"
                        />
                        <span className="text-neutral-600">200</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-neutral-600">
              <button className="flex items-center gap-2 rounded-full px-4 py-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>
              <button className="h-9 w-9 rounded-full border border-[#e7e9ee]">
                1
              </button>
              <button className="h-9 w-9 rounded-full bg-[#0b8bd3] text-white">
                2
              </button>
              <button className="h-9 w-9 rounded-full border border-[#e7e9ee]">
                3
              </button>
              <span>...</span>
              <button className="flex items-center gap-2 rounded-full px-4 py-2">
                Next
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </section>

          <aside className="w-full lg:w-[320px]">
            <div className="lg:sticky lg:top-8">
              <div className="lg:border-l lg:border-[#e7e9ee] lg:pl-6">
                <h2 className="text-xl font-bold leading-8.5 -tracking-[0.03em md:text-2xl md:leading-9">
                  Most Liked
                </h2>
                <div className="mt-6 space-y-6">
                  {mostLikedPosts.map((post) => (
                    <article
                      key={post.id}
                      className="space-y-3 border-b border-[#e7e9ee] pb-6"
                    >
                      <h3 className="text-base leading-7.5 -tracking-[0.03em] font-bold">
                        {post.title}
                      </h3>
                      <p className="text-xs leading-6 -tracking-[0.03em] md:text-sm md:leading-7 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                        <div className="flex items-center gap-2">
                          <img
                            src="/like-icon.svg"
                            alt="Likes"
                            className="h-4 w-4"
                          />
                          <span className="text-neutral-600">20</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src="/comment-icon.svg"
                            alt="Comments"
                            className="h-4 w-4"
                          />
                          <span className="text-neutral-600">20</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
