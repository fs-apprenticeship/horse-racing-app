export default function HorseDetailLoading() {
    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1100px] flex-col gap-6 px-4 py-12 sm:py-16">
            <div className="animate-pulse rounded-lg border border-border bg-background p-6 shadow-sm">
                <div className="h-6 w-1/3 rounded-full bg-muted" />
                <div className="mt-3 h-4 w-2/3 rounded-full bg-muted" />
                <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
                    <div className="space-y-4 rounded-lg bg-slate-950/5 p-4">
                        <div className="h-48 w-full rounded-md bg-muted" />
                        <div className="space-y-3">
                            <div className="h-4 w-3/4 rounded-full bg-muted" />
                            <div className="h-4 w-1/2 rounded-full bg-muted" />
                            <div className="h-4 w-1/3 rounded-full bg-muted" />
                        </div>
                    </div>
                    <div className="rounded-lg bg-slate-950/5 p-4">
                        <div className="mb-4 h-6 w-1/4 rounded-full bg-muted" />
                        <div className="space-y-3">
                            {Array.from({ length: 6 }, (_, index) => (
                                <div
                                    key={index}
                                    className="h-10 rounded-md bg-muted"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
