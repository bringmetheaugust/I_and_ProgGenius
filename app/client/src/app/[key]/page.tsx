import Link from 'next/link';

import { getKey } from '@entities/model/api';

type Props = { params: { key: string } };

export const revalidate = 60; // наш SSR на кожну хвилину

export default async function KeyPage({ params }: Props) {
    const keyName = (await params).key;
    const keyData = await getKey(keyName);

    return (
        <main className="flex gap-10 min-h-screen flex-col items-center justify-center">
            <div className='text-center'>
                <div>
                    Клавіша&nbsp;
                    <h1 className='inline-block text-2xl font-bold'>{decodeURIComponent(keyName)}</h1>
                </div>
                <div>Натиснута <b>{keyData.key.count}</b> разів</div>
            </div>
            <nav className='grid gap-4'>
                <div className='flex gap-4 justify-center'>
                    {keyData.prevKey && <Link href={`/${keyData.prevKey}`}>Назад</Link>}
                    {keyData.nextKey && <Link href={`/${keyData.nextKey}`}>Вперед</Link>}
                </div>
                <Link href="/" className='text-center'>На головну</Link>
            </nav>
        </main>
    );
};
