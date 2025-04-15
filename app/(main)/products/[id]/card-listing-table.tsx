"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart, Star, StarHalf } from "lucide-react";
import { useState } from "react";

// Mock data for listings
const mockListings = [
  {
    id: 1,
    seller: "YugiCollector",
    sellerRating: 4.8,
    condition: "Near Mint",
    price: 2.25,
    shipping: 1.5,
    location: "United States",
    quantity: 3,
    listedDate: "2023-04-01",
  },
  {
    id: 2,
    seller: "CardKingdom",
    sellerRating: 5.0,
    condition: "Mint",
    price: 3.99,
    shipping: 0,
    location: "United States",
    quantity: 10,
    listedDate: "2023-04-05",
  },
  {
    id: 3,
    seller: "DuelistCorner",
    sellerRating: 4.2,
    condition: "Lightly Played",
    price: 1.5,
    shipping: 0.99,
    location: "Canada",
    quantity: 2,
    listedDate: "2023-04-10",
  },
  {
    id: 4,
    seller: "ShadowRealm",
    sellerRating: 4.5,
    condition: "Moderately Played",
    price: 1.25,
    shipping: 1.25,
    location: "United Kingdom",
    quantity: 1,
    listedDate: "2023-04-12",
  },
  {
    id: 5,
    seller: "DarkMagician",
    sellerRating: 3.9,
    condition: "Heavily Played",
    price: 0.75,
    shipping: 1.99,
    location: "Germany",
    quantity: 4,
    listedDate: "2023-04-15",
  },
];

interface CardListingsTableProps {
  cardId: string;
}

export default function CardListingsTable({ cardId }: CardListingsTableProps) {
  // State for filters
  const [priceRange, setPriceRange] = useState<number[]>([0, 5]);
  const [condition, setCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("price-low");
  const [location, setLocation] = useState<string>("all");

  // Filter and sort listings
  const filteredListings = mockListings
    .filter((listing) => {
      const totalPrice = listing.price + listing.shipping;
      const conditionMatch =
        condition === "all" || listing.condition === condition;
      const priceMatch =
        totalPrice >= priceRange[0] && totalPrice <= priceRange[1];
      const locationMatch = location === "all" || listing.location === location;

      return conditionMatch && priceMatch && locationMatch;
    })
    .sort((a, b) => {
      const totalPriceA = a.price + a.shipping;
      const totalPriceB = b.price + b.shipping;

      switch (sortBy) {
        case "price-low":
          return totalPriceA - totalPriceB;
        case "price-high":
          return totalPriceB - totalPriceA;
        case "rating":
          return b.sellerRating - a.sellerRating;
        case "newest":
          return (
            new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
          );
        default:
          return 0;
      }
    });

  // Render seller rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        )}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Get condition badge color
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Mint":
        return "bg-green-100 text-green-800 border-green-300";
      case "Near Mint":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Lightly Played":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Moderately Played":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Heavily Played":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Damaged":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div>
      <div className="bg-slate-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-4">Filter Listings</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Price Range (${priceRange[0]} - ${priceRange[1]})
            </label>
            <Slider
              defaultValue={[0, 5]}
              max={10}
              step={0.25}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Condition</label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Mint">Mint</SelectItem>
                <SelectItem value="Near Mint">Near Mint</SelectItem>
                <SelectItem value="Lightly Played">Lightly Played</SelectItem>
                <SelectItem value="Moderately Played">
                  Moderately Played
                </SelectItem>
                <SelectItem value="Heavily Played">Heavily Played</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Seller Rating</SelectItem>
                <SelectItem value="newest">Newest Listings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{listing.seller}</div>
                      <div className="text-xs">
                        {renderRating(listing.sellerRating)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getConditionColor(listing.condition)}
                    >
                      {listing.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>${listing.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {listing.shipping === 0 ? (
                      <span className="text-green-600 text-sm">Free</span>
                    ) : (
                      <span>${listing.shipping.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${(listing.price + listing.shipping).toFixed(2)}
                  </TableCell>
                  <TableCell>{listing.quantity}</TableCell>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4" />
                      Add to cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No listings found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
