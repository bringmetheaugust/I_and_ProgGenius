import { notFound } from "next/navigation";

import { KeyMapDTO, KeyPageDTO } from "./dto";
import { API_URL } from "@shared/api";

export async function getKeyList(): Promise<KeyMapDTO> {
    const res = await fetch(`${API_URL}/keys`, { cache: 'no-store' });

    return await res.json() as KeyMapDTO;
}

export async function getKey(keyName: string): Promise<KeyPageDTO> {
    const res = await fetch(`${API_URL}/key/${keyName}`);

    if (res.status === 404) notFound();

    return await res.json() as KeyPageDTO;
}
