import { v2 as cloudinary } from "cloudinary";
import { db,pool } from "../db/index.js";
import { products } from "../models/productModel.js";
import { eq } from "drizzle-orm";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((img) => img !== undefined);

    const imagesUrl = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

   
    const result = await db.insert(products).values(productData).returning();

    res.json({ success: true, message: "Product Added", product: result[0] });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: error.message });
  }
};





const listProduct =async (req,res)=>{
    try {
        const allproducts= await db.select().from(products)
        res.json ({success:true,allproducts}) 
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}



const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (deleted.length === 0) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.json({ success: false, message: error.message });
  }
};


const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: "Product id is required" });
    }
    const [product] = await db.select().from(products).where(eq(products.id, id));

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};




export {listProduct,addProduct,removeProduct,singleProduct}
