export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  sizes?: string[]
  colors?: string[]
  isNewArrival?: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Band Collar Short Sleeve Shirt",
    price: 185,
    image: "/SOG1.jpg",
    category: "Essentials",
    description: "Premium band collar shirt crafted from fine cotton blend",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Cream"],
    isNewArrival: true,
  },
  {
    id: "2",
    name: "Croc Embossed Slide",
    price: 145,
    image: "/SOG2.jpg",
    category: "Essentials",
    description: "Minimalist slide with embossed croc texture",
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    colors: ["Black"],
    isNewArrival: true,
  },
  {
    id: "3",
    name: "Oversized Wool Coat",
    price: 595,
    image: "/SOG3.jpg",
    category: "Athletics",
    description: "Luxurious oversized wool coat for elevated style",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    isNewArrival: false,
  },
  {
    id: "4",
    name: "Essential Tee",
    price: 95,
    image: "/SOG4.jpg",
    category: "Essentials",
    description: "Premium cotton essential t-shirt",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Cream", "Gray"],
    isNewArrival: true,
  },
  {
    id: "5",
    name: "Tailored Trousers",
    price: 325,
    image: "/SOG5.jpg",
    category: "Essentials",
    description: "Perfectly tailored trousers in premium fabric",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Charcoal", "Cream"],
    isNewArrival: false,
  },
  {
    id: "6",
    name: "Leather Crossbody Bag",
    price: 425,
    image: "/SOG6.jpg",
    category: "Essentials",
    description: "Minimalist leather crossbody bag",
    sizes: ["One Size"],
    colors: ["Black"],
    isNewArrival: false,
  },
  {
    id: "7",
    name: "Classic Denim Jacket",
    price: 275,
    image: "/SOG7.jpg",
    category: "Essentials",
    description: "Timeless denim jacket with modern fit",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Black"],
    isNewArrival: true,
  },
  {
    id: "8",
    name: "Wool Blazer",
    price: 485,
    image: "/SOG8.jpg",
    category: "Essentials",
    description: "Sophisticated wool blazer for formal occasions",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Black", "Charcoal"],
    isNewArrival: true,
  },
  {
    id: "9",
    name: "Cotton Sweatshirt",
    price: 135,
    image: "/SOG9.jpg",
    category: "Essentials",
    description: "Comfortable premium cotton sweatshirt",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Cream"],
    isNewArrival: false,
  },
  {
    id: "10",
    name: "Leather Boots",
    price: 525,
    image: "/SOG10.jpg",
    category: "Essentials",
    description: "Handcrafted leather boots with premium finish",
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    colors: ["Brown", "Black"],
    isNewArrival: true,
  },
]
