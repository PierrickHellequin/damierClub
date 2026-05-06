import { Container } from "@/components/Container";

export default function Loading() {
  return (
    <Container className="py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-2/3 bg-paper-deep" />
        <div className="h-4 w-1/2 bg-paper-deep" />
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-paper-deep border border-rule" />
          ))}
        </div>
      </div>
    </Container>
  );
}
