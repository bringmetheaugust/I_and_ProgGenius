// кастомний бар-чарт
// виніс в entity, так як цей бар-чарт можна використовувати як і неінтерактивний компонент (наприклад, для звіту)

import { FC } from 'react';
import Link from 'next/link';

import { KeyDTO } from '@entities/model/dto';

interface KeyProps {
    keyData: KeyDTO
    width: number
}

interface RullerProps {
    max: number
}

interface KeyBarProps {
    keys: KeyDTO[]
}

const Key: FC<KeyProps> = ({ keyData: { keyName, count }, width }) => (
    <div className='grid grid-cols-[100px_1fr] gap-4 align-center'>
        <div className='font-bold text-right text-lg'>{keyName}</div>
        <Link href={`/${keyName}`}
            className='flex align-center justify-center bg-cyan-400 transform hover:scale-101 transition duration-300 ease-in-out hover:bg-cyan-500'
            style={{ width: `${width}%` }}
        >
            {count}
        </Link>
    </div>
);

// підложка для візуалізації метрики
const Ruller: FC<RullerProps> = ({ max }) => (
    <div className='absolute w-full h-full grid grid-cols-[100px_1fr] gap-4 text-right'>
        <div />
        <div className='grid grid-flow-col'>
            {[...new Array(max / 10)].map((_, i) => (
                <div
                    className='relative font-bold border-r border-b border-gray-300'
                    key={i}
                >
                    <span className='absolute right-[-10px] bottom-[-30px]'>{(i + 1) * 10}</span>
                </div>
            ))}
        </div>
    </div>
);

const KeyBar: FC<KeyBarProps> = ({ keys }) => {
    if (!keys.length) return <div>Поки що немає даних про клавіш</div>;

    const maxCountKey = keys.sort((a, b) => b.count - a.count)[0].count;
    const rullerMaxCount = Math.ceil(maxCountKey / 10) * 10;

    return (
        <div className='grid gap-4 relative m-4'>
            <ul className='grid gap-2 z-1'>
                {keys.map(key => (
                    <li key={key.keyName}>
                        <Key keyData={key} width={key.count / rullerMaxCount * 100} />
                    </li>
                ))}
            </ul>
            <Ruller max={rullerMaxCount} />
        </div>
    );
};

export default KeyBar;
