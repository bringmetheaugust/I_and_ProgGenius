import { StoreProvider } from "@app/store";
import KeyBarInteractive from "@widgets/ui/KeyBarInteractive";
import { getKeyList } from "@entities/model/api";

export default async function Home() {
    const keys = await getKeyList();

    return (
        <StoreProvider initialData={{ keys }}>
            <main className="flex align-center flex-col h-full">
                <KeyBarInteractive />
            </main>
        </StoreProvider>
    );
}
