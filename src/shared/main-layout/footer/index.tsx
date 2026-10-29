import { BreadCrumbImage } from "@/shared/lib/image-config";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const shopLinks = [
  { label: "All Categories", href: "/categories" },
  { label: "New In", href: "/new-in" },
  { label: "Sale", href: "/offer" },
];

const helpLinks = [
  { label: "Contact Us", href: "/page/contact-us" },
  // { label: "Shipping", href: "/page/shipping" },
  // { label: "Returns", href: "/page/returns" },
];


const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <>
    <div
      className="relative overflow-hidden bg-[#f6f1ea]"
      style={{
        backgroundImage: `linear-gradient(90deg, #f6f1ea 0%, #f6f1ea 42%, rgba(246,241,234,0.94) 56%, rgba(246,241,234,0.45) 72%, rgba(246,241,234,0) 86%), url(${BreadCrumbImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center, right center",
        backgroundSize: "100% 100%, 250% auto",
      }}
    >
      <div className="container pb-1 pt-12 md:pt-16 lg:pt-[72px]">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-3 md:gap-0">
          <div className="md:pr-6">
            <Link href="/" aria-label="That's the Spirit home">
              <Image
                src="/logos.png"
                alt="That's the Spirit"
                width={220}
                height={72}
                quality={100}
                className="h-auto w-[200px] max-w-full"
              />
            </Link>
            <p className="mt-3.5 text-[15px] leading-snug text-[#5c5c5c]">
              Meaningful gifts inspired by faith.
            </p>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Help" links={helpLinks} />
        </div>

        <div className="mt-12 border-t border-[#e6d4b6] md:mt-14" />

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-5 text-center text-[13px] text-[#8f8f8f]">
          <span>© 2026 That&apos;s the Spirit. All rights reserved.</span>
          <span className="inline-block h-3.5 w-px bg-[#e6d4b6]" aria-hidden="true" />
          <Link href="/page/privacy-policy" className="transition-colors hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>

    </>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <nav
    aria-label={title}
    className="relative md:pl-12 md:before:absolute md:before:left-0 md:before:top-1/2 md:before:h-32 md:before:w-px md:before:-translate-y-1/2 md:before:bg-[#e6d4b6] lg:pl-16"
  >
    <h2 className="text-[17px] font-bold text-primary">{title}</h2>
    <ul className="mt-4 space-y-3 text-[15px] leading-snug text-[#3a3a3a]">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="transition-colors hover:text-primary">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Footer;
