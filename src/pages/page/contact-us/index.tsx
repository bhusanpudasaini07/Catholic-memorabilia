import React from 'react'
import { NextPageWithLayout } from '../../_app'
import MainLayout from '@/shared/main-layout'
import Head from 'next/head'
import Breadcrumb from '@/shared/components/breadcrumb'
import ContactUsForm from '@/features/Contact/contact-form'

const ContactUs: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Contact Us</title>
            </Head>
            <Breadcrumb title="Contact Us" />
            <div className="container">
                <ContactUsForm />
            </div>
        </>
    )
}

export default ContactUs

ContactUs.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}
