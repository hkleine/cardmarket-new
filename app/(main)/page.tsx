import { ProductSearch } from "@/components/product-search";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="py-28 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Find Your Cards, Set, Decks and everything you need
          </h2>
          <div className="flex-1">
            <ProductSearch />
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center content-center place-items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Yu-Gi-Oh! Singles & Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the best prices on Yu-Gi-Oh! cards from trusted sellers
              across Europe.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Browse Cards</Button>
              <Button size="lg" variant="outline">
                Sell Cards
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src="/placeholder.svg?height=400&width=400"
                width={400}
                height={400}
                alt="Yu-Gi-Oh! Cards"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
