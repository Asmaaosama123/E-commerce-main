import React, { useEffect, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CategoriesType = {
  [key: string]: {
    [sub: string]: string[];
  };
};

const CATEGORIES: CategoriesType = {
  women: {
    dresses: ["maxi", "midi", "mini"],
    shoes: ["sneakers", "sandals", "heels"],
    bags: ["totes", "clutches"],
  },
  men: {
    shirts: ["casual", "formal"],
    shoes: ["sneakers", "loafers"],
    accessories: ["belts", "hats"],
  },
  kids: {
    clothes: ["tops", "bottoms"],
    toys: ["soft", "plastic"],
  },
};

const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<string>(Object.keys(CATEGORIES)[0]);
  const [subcategory, setSubcategory] = useState<string>("");
  const [subSubcategory, setSubSubcategory] = useState<string>("");

  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState<{ name: string }[]>([]);

  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p));
      return urls;
    });
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  useEffect(() => {
    const subs = Object.keys(CATEGORIES[category] || {});
    setSubcategory(subs[0] || "");
    setSubSubcategory("");
  }, [category]);

  useEffect(() => {
    const subSubs = (CATEGORIES[category] && CATEGORIES[category][subcategory]) || [];
    setSubSubcategory(subSubs[0] || "");
  }, [subcategory, category]);

  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    e.currentTarget.value = "";
  };

  const removeImageAt = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddColor = () => {
    const name = colorName.trim();
    if (!name) return alert("Enter color name");
    setColors((s) => [...s, { name }]);
    setColorName("");
  };

  const removeColorAt = (index: number) => {
    setColors((s) => s.filter((_, i) => i !== index));
  };

  const addSize = () => {
    const v = sizeInput.trim();
    if (!v) return;
    if (!sizes.includes(v)) setSizes((s) => [...s, v]);
    setSizeInput("");
  };

  const removeSizeAt = (index: number) => {
    setSizes((s) => s.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  
    const newProduct = {
      id: Date.now(), // id مؤقت
      name: productName,
      price,
      category,
      subcategory,
      subSubcategory,
      sizes,
      colors,
      imagesCount: imageFiles.length,
    };
  
    // نروح لصفحة MyStore مع تمرير المنتج والكاتيجوري المختارة
    navigate("/my-store", { state: { newProduct, selectedTab: "offers" } });
  };
  

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer text-gray-700"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-bold mx-auto">ADD NEW PRODUCT</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Multi images upload */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">IMAGES</h2>
          <label className="relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-40 overflow-hidden cursor-pointer">
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
                alt="upload"
                className="w-9 h-9 opacity-60"
              />
              <p className="text-gray-500 text-sm text-center">
                UPLOAD PRODUCT IMAGES
                <br />
                <span className="text-xs">
                  PNG, JPG UP TO 5MB — يمكنك رفع صور متعددة
                </span>
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-md overflow-hidden">
                  <img
                    src={src}
                    alt={`img-${i}`}
                    className="w-full h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageAt(i)}
                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow"
                  >
                    <Trash2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">DETAILS</h2>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm mb-3"
            placeholder="PRODUCT NAME"
            required
          />
          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            type="number"
            min={0}
            className="w-full border border-gray-300 px-4 py-3 text-sm mb-3"
            placeholder="PRICE (MRU)"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm h-24 resize-none"
            placeholder="DESCRIPTION (OPTIONAL)"
          />
        </div>

        {/* Category cascade */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">CATEGORY</h2>
          <div className="flex flex-col gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 px-4 py-3 text-sm"
            >
              {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="border border-gray-300 px-4 py-3 text-sm"
            >
              {Object.keys(CATEGORIES[category] || {}).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={subSubcategory}
              onChange={(e) => setSubSubcategory(e.target.value)}
              className="border border-gray-300 px-4 py-3 text-sm"
            >
              {(CATEGORIES[category] &&
                CATEGORIES[category][subcategory])?.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              )) || <option value="">—</option>}
            </select>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">COLORS</h2>
          <div className="flex gap-2 items-center mb-2">
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Color name (e.g. Red)"
              className="flex-1 border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm"
            >
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {colors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-100 px-2 py-1"
              >
                <div className="text-sm">{c.name}</div>
                <button type="button" onClick={() => removeColorAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">SIZE</h2>
          <div className="flex items-center gap-2 mb-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Add size (e.g. M / 42)"
              className="flex-1 border border-gray-300  px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addSize}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 text-sm"
            >
              <Plus className="w-4 h-4 inline-block" /> Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {sizes.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-2 bg-yellow-300 px-3 py-1.5 text-sm font-semibold"
              >
                <span>{s}</span>
                <button type="button" onClick={() => removeSizeAt(i)}>
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 pb-6">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 font-semibold"
          >
            ADD NEW
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
