import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YugiohCard } from "@/types/yugiohCard";

interface CardDetailsProps {
  card: YugiohCard;
}

export default function CardDetailsSection({ card }: CardDetailsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Card Details</TabsTrigger>
        <TabsTrigger value="sets">Set Information</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <Card>
          <CardContent className="pt-6">
            <p className="whitespace-pre-line">{card.description}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold">Card Type:</div>
              <div>{card.type}</div>

              <div className="font-semibold">Property:</div>
              <div>{card.race}</div>

              <div className="font-semibold">Archetype:</div>
              <div>{card.archetype}</div>

              <div className="font-semibold">More Info:</div>
              <div>
                <a
                  href={card.ygoprodeck_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  View on YGOPRODeck
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sets">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold">Set Name:</div>
              <div>{card.set_name}</div>

              <div className="font-semibold">Set Code:</div>
              <div>{card.set_code}</div>

              <div className="font-semibold">Rarity:</div>
              <div>
                {card.set_rarity} ({card.set_rarity_code})
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
