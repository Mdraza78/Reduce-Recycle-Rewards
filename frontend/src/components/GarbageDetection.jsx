import React, { useState, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import "./garbageDetection.css";

const GarbageDetection = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const imageRef = useRef();
  const [materialType, setMaterialType] = useState("");
  const [weight, setWeight] = useState("");
  const [coinsEarned, setCoinsEarned] = useState(0);

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

  const analyzeImage = async (imageElement) => {
    try {
      const model = await loadModel();
      const predictions = await model.classify(imageElement);
      console.log("Predictions:", predictions);

      const categories = {
        fruit: ["apple", "banana", "orange", "mango", "pear", "grapes", "watermelon", "cherry", "strawberry"],
        vegetable: ["carrot", "potato", "onion", "tomato", "cucumber", "lettuce", "spinach", "broccoli", "cauliflower"],
        degradable: ["fruit", "vegetable", "peel", "organic", "leaf", "plant", "compostable", "natural", "food waste"],
        nonDegradable: ["plastic", "metal", "glass", "bottle", "can", "styrofoam", "rubber", "electronics", "wire", "iron", "steel", "screw"],
      };

      let description = "Unclassified item.";
      let category = "Unclassified";

      for (let pred of predictions) {
        const { className, probability } = pred;

        if (categories.fruit.includes(className)) {
          description = `This item is classified as a ${className} with ${(probability * 100).toFixed(2)}% confidence. It is a fruit.`;
          category = "Degradable (Fruit)";
          break;
        } else if (categories.vegetable.includes(className)) {
          description = `This item is classified as a ${className} with ${(probability * 100).toFixed(2)}% confidence. It is a vegetable.`;
          category = "Degradable (Vegetable)";
          break;
        } else if (categories.degradable.some((keyword) => className.includes(keyword))) {
          description = `This item is classified as ${className} with ${(probability * 100).toFixed(2)}% confidence. It is degradable.`;
          category = "Degradable";
          break;
        } else if (categories.nonDegradable.some((keyword) => className.includes(keyword))) {
          description = `This item is classified as ${className} with ${(probability * 100).toFixed(2)}% confidence. It is non-degradable.`;
          category = "Non-Biodegradable: Recycle";
          break;
        }
      }

      if (category === "Unclassified" && predictions.length > 0) {
        const { className, probability } = predictions[0];
        description = `Unclassified item. Closest match: ${className} with ${(probability * 100).toFixed(2)}% confidence.`;
        category = "Unclassified";
      }

      setDescription(description);
      setCategory(category);
    } catch (error) {
      console.error("Error analyzing image: ", error);
      setDescription("Error analyzing the image.");
      setCategory("Error");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setDescription("");
      setCategory("");
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => analyzeImage(img);
    }
  };

  const handleWeightChange = (e) => {
    const inputWeight = parseFloat(e.target.value);
    setWeight(e.target.value);

    const rates = {
      plastic: 0.04,
      metal: 0.20,
      glass: 0.10,
      other: 0.02,
    };

    if (materialType && !isNaN(inputWeight)) {
      const rate = rates[materialType] || 0;
      const coins = inputWeight * rate;
      setCoinsEarned(coins.toFixed(2));
    } else {
      setCoinsEarned(0);
    }
  };

  return (
    //body of page
    <div className="container">
      <h1>Garbage Detection</h1>
      <p>Upload Garbage Image:</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
      {image && (
        <>
          <div className="image-container">
            <img src={image} alt="Uploaded Preview" />
          </div>

          <div className="dropdown-container">
            <label htmlFor="material-type">Select Material Type:</label>
            <select
              id="material-type"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="dropdown-select"
            >
              <option value="">-- Choose Material --</option>
              <option value="metal">Metal</option>
              <option value="plastic">Plastic</option>
              <option value="glass">Glass</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="weight-input-container">
            <label htmlFor="weight">Enter Weight (in grams):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={handleWeightChange}
              className="weight-input"
              placeholder="e.g. 50"
              min="0"
            />
          </div>
        
          <div className="coins-earned">
            <strong>Coins Earned:</strong> {coinsEarned}
          </div>
        </>
      )}

      <div className="predictions-container">
        <h2>Results:</h2>
        <p className="prediction-item"><strong>Description:</strong> {description}</p>
        <p className={`prediction-item biodegradability ${
          category.includes("Non-Biodegradable") ? "non-biodegradable" :
          category.includes("Degradable") ? "biodegradable" : ""
        }`}>
          <strong>Category:</strong> {category}
        </p>
      </div>


      <div className="button-container">
        <button className="action-button back-button">Back to Calendar</button>
        <div className="middle-buttons">
          <button className="action-button">Money Make</button>
          <button className="action-button">Provide</button>
        </div>
        <button className="action-button find-button">Find Municipality</button>
      </div>
    </div>
  );
};

export default GarbageDetection;
