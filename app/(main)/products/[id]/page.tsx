import { findProduct } from "@/app/serverQueries";
import { Button } from "@/components/ui/button";
import { YuGiOhCardTypeBadge } from "@/components/yugioh-card-type-badge";
import { YuGiOhRarityBadge } from "@/components/yugioh-rarity-badge";
import { RarityType } from "@/types/yugiohCard";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import CardDetailsSection from "./card-details-section";
import CardListingsTable from "./card-listing-table";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id } = await params;

  if (!id) {
    return null;
  }
  const product = await findProduct(id);

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[300px] aspect-[3/4] mb-4">
            <Image
              src={product.card_image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Card Details Section */}
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <YuGiOhCardTypeBadge
                cardType={product.human_readable_card_type}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{product.set_name}</span>
              <span>•</span>
              <span>{product.set_code}</span>
              <span>•</span>
              <span>
                <YuGiOhRarityBadge
                  rarityCode={product.set_rarity_code as RarityType}
                  rarity={product.set_rarity}
                />
              </span>
            </div>

            <div className="mt-4">
              <p className="text-lg font-semibold">
                Average Price: €{product.set_price}
              </p>
              <div className="flex flex-row gap-4">
                <Button className="w-full md:w-auto">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to wishlist
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Sell Yours
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <CardDetailsSection card={product} />
        </div>
      </div>

      <Separator className="my-8" />

      <h2 className="text-xl font-bold mb-4">Available Listings</h2>
      <Suspense fallback={<div>Loading listings...</div>}>
        <CardListingsTable cardId={product.id.toString()} />
      </Suspense>
    </div>
  );
}
