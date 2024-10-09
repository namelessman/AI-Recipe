import { useState } from "react";
import { TextArea, Card, Button, Text } from "@radix-ui/themes";
import "./App.css";

function App() {
  const [ingredient, setIngredient] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [result, setResult] = useState<string>("");
  return (
    <>
      <h1>AI Recipe</h1>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", padding: "0.5rem" }}>
          <Card>
            <Text as="div" size="4" weight="bold">
              Ingredients
            </Text>
            <TextArea
              resize="vertical"
              style={{ marginTop: "0.5rem" }}
              placeholder="Enter ingredients here"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </Card>
          <Card style={{ marginTop: "1rem" }}>
            <Text as="div" size="4" weight="bold">
              Instructions
            </Text>
            <TextArea
              resize="vertical"
              style={{ marginTop: "0.5rem" }}
              placeholder="Enter instructions here"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Card>

          <Button
            disabled={!ingredient || !instructions}
            onClick={() => {
              console.log(ingredient, instructions);
            }}
            style={{ marginTop: "1rem" }}
          >
            Generate
          </Button>
        </div>

        <div style={{ width: "50%", padding: "0.5rem" }}>
          <TextArea readOnly style={{ minHeight: 300 }} />
          <Button style={{ marginTop: "1rem" }} disabled={!result}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
