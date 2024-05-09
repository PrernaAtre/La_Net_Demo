import Image from "next/image";

export default function OpenSource() {
  return (
    <section id="open-source">
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-muted py-8 text-center md:py-12 xl:py-16">
        <h2 className="font-heading text-3xl drop-shadow-xl dark:bg-gradient-to-br dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text dark:text-transparent sm:text-3xl md:text-6xl">
          Proudly Open Source
        </h2>

        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          JetBrain is open source and powered by open source software. <br />{" "}
          The code is available on{" "}
          <a
            href=""
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 duration-200 hover:text-foreground"
          >
            GitHub
          </a>
          .
        </p>
      </div>

      <Image
        src="/illustrations/work-party.svg"
        alt="Work Party"
        width={500}
        height={500}
        className="ml-auto drop-shadow-xl dark:invert"
      />
    </section>
  );
}
