import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Star } from "lucide-react"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Luna Rodriguez - Midnight Dreams Vinyl",
    artist: "Luna Rodriguez",
    price: 29.99,
    originalPrice: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Vinyl",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "MBTM Logo T-Shirt",
    artist: "Man Behind The Music",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Apparel",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: false,
  },
  {
    id: 3,
    name: "Sarah Williams - Country Roads Poster",
    artist: "Sarah Williams",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Posters",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: "Electronic Beats Hoodie",
    artist: "Marcus Thompson",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Apparel",
    rating: 4.7,
    reviews: 156,
    inStock: false,
    featured: false,
  },
  {
    id: 5,
    name: "MBTM Premium Headphones",
    artist: "Man Behind The Music",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    featured: true,
  },
  {
    id: 6,
    name: "Alex Chen - Beat Drop CD",
    artist: "Alex Chen",
    price: 14.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "CD",
    rating: 4.5,
    reviews: 78,
    inStock: true,
    featured: false,
  },
]

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Merch Store</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Support your favorite artists with exclusive merchandise and music
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search products, artists, or categories..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vinyl">Vinyl</SelectItem>
              <SelectItem value="cd">CD</SelectItem>
              <SelectItem value="apparel">Apparel</SelectItem>
              <SelectItem value="posters">Posters</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter((product) => product.featured)
            .map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                  {product.featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <CardDescription>{product.artist}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Button className="w-full" disabled={!product.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="text-sm">{product.artist}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
                <Button className="w-full" size="sm" disabled={!product.inStock}>
                  <ShoppingCart className="mr-2 h-3 w-3" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Products
        </Button>
      </div>
    </div>
  )
}
