import { getConfig } from "@/services/home.service";
import FooterBullet from "@/shared/icons/common/FooterBullet";
import {
  AppStore,
  CashOnHand,
  Esewa,
  FooterBg,
  Logo,
  MasterCard,
  PlayStore,
  QR,
  UnionPay,
  socials,
} from "@/shared/lib/image-config";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Footer = () => {
  const { data: config }: any = useQuery(['getConfig'])
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <div className="relative">
      <Image fill src={FooterBg} priority={true} className="z-0" alt="footer-bg" />
      <footer className="relative block p-4 !pb-0 sm:p-10 footer text-base-content">
        <div className="container flex flex-wrap items-start justify-between gap-2 footer">
          <div className="w-full xs:w-[45%] md:w-[23%] mb-3">
            <Image src={config?.data?.pageData['logo']} height={69} width={128} alt="footer-logo" priority={true} />
            <p className="text-[12px]">
              {config?.data?.pageData["section1 description"]}
            </p>
          </div>
          <div className="w-full xs:w-[45%] md:w-[23%] mb-3">
            <span className="text-base font-bold footer-title">{config?.data?.pageData['section1 title']}</span>
            <div className="flex items-start justify-start gap-4 mb-3">
              <FooterBullet className="mt-[0.2rem]" />
              <div>
                <p className="text-xs opacity-60">Call AnyTime</p>
                {/* <button className="p-0 footer-link">{config?.data?.pageData["section1 mobile2"]}</button> */}
                <button  className="p-0 footer-link">thakuri374@gmail.com</button>
              </div>
            </div>
            <div className="flex items-start justify-start gap-4 mb-3">
              <FooterBullet className="mt-[0.2rem]" />
              <div>
                <p className="text-xs opacity-60">Send Email</p>
                <button className="p-0 footer-link">
                  {/* {config?.data?.pageData["section1 email"]} */}
                  thakuri374@gmail.com
                </button>
              </div>
            </div>
            <div className="flex items-start justify-start gap-4 mb-3">
              <FooterBullet className="mt-[0.2rem]" />
              <div>
                <p className="text-xs opacity-60">Visit Office</p>
                <button className="p-0 footer-link">
                  {config?.data?.pageData["section1 address"]}
                </button>
              </div>
            </div>
            <div className="ps-4">
              {/* <Image src={QR} alt="QR" width={150} height={190} quality={100}
                style={{ width: "auto", height: "auto" }}
                className="max-w-[150px]"
              /> */}
            </div>
          </div>
          <div className="w-full xs:w-[45%] md:w-[23%] mb-3">
            <span className="text-base font-bold footer-title">{config?.data?.pageData['section2 title']}</span>
            {config?.data?.pageData && <>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href={`${config?.data?.pageData['section2 link1']}`} aria-label="about-us" className="p-0 footer-link">{config?.data?.pageData['section2 content1']}</Link>
              </div>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href={`${config?.data?.pageData['section2 link2']}`} aria-label="privacy-policy-footter" className="p-0 footer-link">{config?.data?.pageData['section2 content2']}</Link>
              </div>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href={`${config?.data?.pageData['section2 link3']}`} aria-label="faq-footer" className="p-0 footer-link">{config?.data?.pageData['section2 content3']}</Link>
              </div>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href={`${config?.data?.pageData['section2 link4']}`} aria-label="contact-us" className="p-0 footer-link">{config?.data?.pageData['section2 content4']}</Link>
              </div>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href={`${config?.data?.pageData['section2 link5']}`} aria-label="terms-and-condition" className="p-0 footer-link">{config?.data?.pageData['section2 content5']}</Link>
              </div>
            </>}

          </div>
          <div className="w-full xs:w-[45%] md:w-[23%] mb-3">
            <span className="text-base font-bold footer-title">{`${config?.data?.pageData['section4 title']}`}</span>
            {config?.data?.pageData && <>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href='/page/plant-consultation' aria-label="plant-and-consultation" className="p-0 footer-link">
                  {`${config?.data?.pageData['section4 content1']}`}
                </Link>
              </div>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href='/page/tree-installation' aria-label="tree-installation" className="p-0 footer-link">{`${config?.data?.pageData['section4 content2']}`}</Link>
              </div>
              <div className="flex items-center justify-start gap-4 mb-3">
                <FooterBullet />
                <Link href='/page/tree-installation' aria-label="tree-installation" className="p-0 footer-link">{`${config?.data?.pageData['section4 content3']}`}</Link>
              </div>
            </>}

          </div>
        </div>
        <div className="container flex flex-wrap items-center justify-between gap-4 mb-4 mt-[-50px]">
          <div className="flex gap-3">
            {config?.data?.pageData && <>
              <Link href={`${config?.data?.pageData['section5 facebook']}`} aria-label="fb-link" target="_blank" className="w-auto p-0 btn btn-circle">
                <Image
                  src={socials.facebook}
                  height={36}
                  width={36}
                  quality={100}
                  alt="facebook"
                />
              </Link>
              <Link href={`${config?.data?.pageData['section5 instagram']}`} aria-label="insta-link" target="_blank" className="w-auto p-0 btn btn-circle">
                <Image
                  src={socials.instagram}
                  height={36}
                  width={36}
                  alt="insta"
                />
              </Link>
              <Link href={`${config?.data?.pageData['section5 youtube']}`} aria-label="youtube" target="_blank" className="w-auto p-0 btn btn-circle">
                <Image
                  src={socials.youtube}
                  height={36}
                  width={36}
                  alt="yt"
                />
              </Link>
            </>}

          </div>
          <div className="flex flex-wrap items-center gap-3 mt-10">
            <h3 className="text-base font-bold text-black me-4">
              DOWNLOAD THE APP ON
            </h3>
            <div className="flex gap-3">
              {config?.data?.pageData && <>
                <Link aria-label="play-store" target="_blank" href={`${config?.data?.pageData['section4 googleplay link']}`} className="p-0 btn">
                  <Image
                    src={PlayStore}
                    height={32}
                    width={108}
                    quality={100}
                    alt="play-store"
                  />
                </Link>
                <Link target="_blank" aria-label="app-store" href={`${config?.data?.pageData['section4 appstore link']}`} className="p-0 btn">
                  <Image src={AppStore} quality={100} height={32} width={108} alt="app-store" />
                </Link>
              </>}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-wrap items-center justify-between w-full gap-4 p-5 text-white sm:p-3 bg-primary rounded-t-2xl">
            <div className="flex flex-wrap justify-center gap-2 mx-auto">
              <p className="text-center">
                © {currentYear}
                 {/* I am the Gardener. All Rights Reserved */}
              </p>
              <div className="divider divider-horizontal before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0 hidden xs:flex"></div>
              <p>Powered By  Intern Students</p>
            </div>
            <div className="flex flex-wrap justify-center mx-auto">
              {config?.data?.pageData && <>
                <button className="relative w-10 h-10 p-0 bg-transparent border-0 sm:h-14 sm:w-14 btn hover:!bg-transparent hover:cursor-default">
                  <Image src={config?.data?.pageData['section3 content1']}
                    height={300}
                    width={300}
                    quality={100}
                    alt="esewa" />
                </button>
                <div className="divider divider-horizontal before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0 my-3"></div>
                <button className="relative w-10 h-10 p-0 bg-transparent border-0 sm:h-14 sm:w-14 btn hover:!bg-transparent hover:cursor-default">
                  <Image src={config?.data?.pageData['section3 content2']}
                    height={100}
                    width={100}
                    quality={100}
                    alt="master-card" />
                </button>
                <div className="divider divider-horizontal before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0 my-3"></div>
                <button className="relative w-10 h-10 p-0 bg-transparent border-0 sm:h-14 sm:w-14 btn hover:!bg-transparent hover:cursor-default">
                  <Image src={config?.data?.pageData['section3 content3']}
                    height={100}
                    width={100}
                    quality={100}
                    alt="cash on hand" />
                </button>
                <div className="divider divider-horizontal before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0 my-3"></div>
                <button className="relative w-10 h-10 p-0 bg-transparent border-0 sm:h-14 sm:w-14 btn hover:!bg-transparent hover:cursor-default">
                  <Image src={config?.data?.pageData['section3 content4']}
                    height={100}
                    width={100}
                    quality={100}
                    alt="union pay" />
                </button>
              </>}

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
