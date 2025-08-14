import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href='/' className='flex w-fit items-center gap-2 group'>
      <Image
        src='/logo.png'
        width={40}
        height={40}
        priority
        quality={100}
        alt='Websonic logo mark'
        className='transition-transform duration-700 group-hover:rotate-180'
      />
      <span className='font-sans font-bold text-xl text-white'>Websonic</span>
    </Link>
  );
}
