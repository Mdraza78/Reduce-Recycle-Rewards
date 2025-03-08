import React, { useState, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const GarbageDetection = () => {
  const [image, setImage] = useState(null); // State for the uploaded image
  const [description, setDescription] = useState(""); // State for the description
  const [category, setCategory] = useState(""); // State for the category
  const imageRef = useRef(); // Ref for the image element

  // Load the MobileNet model
  const loadModel = async () => {
    try {
      const model = await mobilenet.load();
      console.log("MobileNet model loaded successfully!");
      return model;
    } catch (error) {
      console.error("Error loading model: ", error);
      throw error;
    }
  };

  // Analyze the image
  const analyzeImage = async (imageElement) => {
    try {
      const model = await loadModel();
      const predictions = await model.classify(imageElement);
      console.log("Predictions:", predictions);

      // Define categories for degradable and non-degradable items
      const categories = {
        fruit: [
          "apple", "banana", "orange", "mango", "pear", "grapes", "watermelon", "cherry", "strawberry"
        ],
        vegetable: [
          "carrot", "potato", "onion", "tomato", "cucumber", "lettuce", "spinach", "broccoli", "cauliflower"
        ],
        degradable: [
          "fruit", "vegetable", "peel", "organic", "leaf", "plant", "compostable", "natural", "food waste"
        ],
        nonDegradable: [
          "plastic", "metal", "glass", "bottle", "can", "styrofoam", "rubber", "electronics", "wire", "iron", "steel", "screw"
        ],
      };

      // Default response if no classification matches
      let description = "Unclassified item.";
      let category = "Unclassified";

      // Analyze predictions to categorize the image
      for (let pred of predictions) {
        const { className, probability } = pred;

        // Check for degradable category (fruits, vegetables, etc.)
        if (categories.fruit.includes(className)) {
          description = `This item is classified as a ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is a fruit.`;
          category = "Degradable (Fruit)";
          break;
        } else if (categories.vegetable.includes(className)) {
          description = `This item is classified as a ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is a vegetable.`;
          category = "Degradable (Vegetable)";
          break;
        } else if (categories.degradable.some((keyword) => className.includes(keyword))) {
          description = `This item is classified as ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is a degradable item.`;
          category = "Degradable";
          break;
        }

        // Check for non-degradable category (plastics, metals, etc.)
        else if (categories.nonDegradable.some((keyword) => className.includes(keyword))) {
          description = `This item is classified as ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is made of non-degradable material.`;
          category = "Non-Biodegradable: Recycle";
          break;
        }
      }

      // If no category matches, return the most probable class and mark as unclassified
      if (category === "Unclassified" && predictions.length > 0) {
        const { className, probability } = predictions[0];
        description = `Unclassified item. Closest match: ${className} with a confidence of ${(probability * 100).toFixed(2)}%.`;
        category = "Unclassified";
      }

      // Set the description and category
      setDescription(description);
      setCategory(category);
    } catch (error) {
      console.error("Error analyzing image: ", error);
      setDescription("Error analyzing the image.");
      setCategory("Error");
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setDescription("");
      setCategory("");

      // Analyze the image after it loads
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => analyzeImage(img);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Garbage Detection</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div>
        {image && (
          <div style={{ marginTop: "20px" }}>
            <img
  src={image}
  alt="Uploaded"
  ref={imageRef}
  style={{
    width: "300px",  // Fixed width
    height: "400px", // Fixed height
    objectFit: "contain", // Adjust the image to fit within the container
  }}
/>
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Results:</h2>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Category:</strong> {category}</p>
      </div>
    </div>
  );
};

export default GarbageDetection;