export function GridSkeleton() {
    return (
        <div
            className="w-full max-w-7xl mx-auto px-4"
            role="status"
            aria-live="polite"
            aria-label="Loading media grid"
        >
            <div
                className="grid gap-3 h-[90vh]"
                style={{
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(4, 1fr)',
                }}
            >
                {Array.from({ length: 24 }, (_, i) => (
                    <div
                        key={i}
                        className="bg-muted/60 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}
