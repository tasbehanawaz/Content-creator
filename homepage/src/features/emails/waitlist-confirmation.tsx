import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

import tailwindConfig from './tailwind.config';

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

interface WaitlistConfirmationEmailProps {
  fullName?: string;
}

export default function WaitlistConfirmationEmail({ fullName = 'there' }: WaitlistConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the Websonic waitlist!</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className='mx-auto my-auto bg-slate-500 px-2 py-10 font-sans'>
          <Container className='mx-auto mt-[40px] w-[464px] overflow-hidden rounded-md bg-white'>
            <Section className={`h-[255px] w-full bg-black bg-[url('${baseUrl + '/hero-shape.png'}')] bg-center`}>
              <Heading className='mb-0 mt-[70px] text-center text-[48px] font-bold text-white'>Welcome!</Heading>
            </Section>
            <Section className='p-8'>
              <Heading as='h2' className='m-0 text-[24px] font-bold'>
                Hey {fullName}! 👋
              </Heading>
              <Text className='my-6 text-[16px]'>
                Thanks for joining the Websonic waitlist! You&apos;re officially on the list for early access to the future of hands-free browsing.
              </Text>
              <Text className='my-6 text-[16px]'>
                We&apos;re working hard to bring you an amazing experience. You&apos;ll be among the first to know when Websonic is ready to transform how you browse the web with your voice.
              </Text>
              <Text className='my-6 text-[16px]'>
                Stay tuned for updates!
              </Text>
              <Text className='my-6 text-[14px] text-gray-600'>
                Best regards,<br />
                The Websonic Team
              </Text>
            </Section>
          </Container>
          <Container className='mx-auto mt-4'>
            <Section className='text-center'>
              <Text className='m-0 text-xs text-white'>Questions? Just reply to this email.</Text>
              <Link className='text-center text-xs text-white underline' href={baseUrl}>
                Visit our website
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}