import React, { useEffect, useState } from 'react'
import { NextPageWithLayout } from '../../_app'
import MainLayout from '@/shared/main-layout'
import Head from 'next/head'
import Loader from '@/components/Loading'
import Breadcrumb from '@/shared/components/breadcrumb'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { getFaqData, getPageData } from '@/services/page.service'

export interface IFaq {
    question: string,
    answer: string,
    id: number,
}

const Faq: NextPageWithLayout = () => {
    const router = useRouter();
    const { asPath } = router;
    const path = asPath.split("/");
    const slug = path[path.length - 1];
    const { data: faqData, isInitialLoading: fetchLoading } = useQuery({
        queryKey: ["getPageData", slug],
        queryFn: getFaqData
    });

    return (
        <>
            <Head>
                <title>Faq</title>
            </Head>
            {
                fetchLoading ? (
                    <Loader />
                ) : (
                    <>
                        <Breadcrumb title={'Faq'} />
                        <div className="container">
                            <div className='py-[60px]'>
                                <h5 className='text-[32px] text-slate-850 capitalize font-semibold mb-7 text-center'>Frequently Asked Questions</h5>
                                {
                                    faqData && faqData?.data.map((faq: IFaq, index: number) => (
                                        <div className="mb-3.5 collapse bg-base-200 faq-accordion" key={index}>
                                            <input type="radio" name="my-accordion-1" />
                                            <div className="collapse-title">
                                                {faq?.question}
                                            </div>
                                            <div className="collapse-content" dangerouslySetInnerHTML={{ __html: faq?.answer }}>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default Faq

Faq.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}