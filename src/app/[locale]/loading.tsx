import { Container, Main } from "@/components/frame";

export default function Loading() {
  return (
    <Main>
      <Container className="py-14">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-5 h-14 w-2/3 max-w-md" />
        <div className="skeleton mt-4 h-4 w-full max-w-sm" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton aspect-square" />)}
        </div>
        <p className="sr-only">Loading</p>
      </Container>
    </Main>
  );
}
