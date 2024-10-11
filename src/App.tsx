import { useState, useEffect } from "react";
import {
  TextArea,
  Card,
  Button,
  Text,
  Callout,
  AlertDialog,
  Flex,
} from "@radix-ui/themes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import "./App.css";

interface Fav {
  create_date: string;
  id: number;
  user_id: string;
  message: string;
}

function App() {
  const [ingredient, setIngredient] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [fav, setFav] = useState<Fav[]>([]);
  const [refresh, setRefresh] = useState<number>(0);

  const { user } = useUser();
  const baseUrl = "https://65af-202-74-210-235.ngrok-free.app";

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    fetch(`${baseUrl}/cook_list/${user.id}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFav(data);
      });
  }, [user?.id, refresh]);

  const onSave = async () => {
    const userId = user.id;
    const cookMessage = result;
    fetch(`${baseUrl}//saveCookMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, cookMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        // alert("saved");
        setRefresh(refresh + 1);
      });
  };

  const onRemove = (id: number) => {
    fetch(`${baseUrl}/cook_list/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // alert("removed");
        setRefresh(refresh + 1);
      });
  };

  const generate = () => {
    fetch(`${baseUrl}/getFoodSmart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: ingredient,
        instructions: instructions,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.message);
      });
  };
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.2rem",
          marginBottom: "1rem",
        }}
      >
        <Text size="8" weight="bold">
          AI Recipe
        </Text>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
      </header>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", padding: "0.5rem" }}>
          <Card>
            <Text as="div" size="4" weight="bold">
              Ingredients 🥬
            </Text>
            <TextArea
              resize="vertical"
              style={{ marginTop: "0.5rem" }}
              placeholder="Enter ingredients here: onion, tomato, beef ..."
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </Card>
          <Card style={{ marginTop: "1rem" }}>
            <Text as="div" size="4" weight="bold">
              Instructions 📝
            </Text>
            <TextArea
              resize="vertical"
              style={{ marginTop: "0.5rem" }}
              placeholder="Enter instructions here: make a traditional Maori food, add more ingridents if needed ..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Card>

          <Button
            disabled={!ingredient || !instructions}
            onClick={() => {
              generate();
            }}
            style={{ marginTop: "1rem" }}
          >
            Generate
          </Button>
        </div>

        <div style={{ width: "50%", padding: "0.5rem" }}>
          {/* <TextArea value={result} readOnly style={{ minHeight: 300 }} /> */}
          <Card style={{ minHeight: 300 }}>
            <ReactMarkdown style={{ minHeight: 300, border: "1px solid #eee" }}>
              {result}
            </ReactMarkdown>
          </Card>
          <SignedIn>
            <Button
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
              disabled={!result}
              onClick={() => {
                onSave();
              }}
            >
              Save
            </Button>
          </SignedIn>
          <SignedOut>
            <Callout.Root>
              <Callout.Text>
                If you want to save the recipe, please sign in
              </Callout.Text>
            </Callout.Root>
          </SignedOut>
        </div>
      </div>
      <SignedIn>
        <Text as="div" size="4" weight="bold" align="left">
          Saved Recipe 📖
        </Text>
        <div>
          {fav.map((item) => (
            <Card
              key={item.id}
              style={{ marginTop: "1rem", position: "relative" }}
            >
              <Text as="div" size="3" style={{ marginTop: "0.5rem" }}>
                <ReactMarkdown>{item.message}</ReactMarkdown>
              </Text>

              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    color="red"
                    style={{ position: "absolute", top: "1rem", right: "1rem" }}
                  >
                    Remove
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="450px">
                  <AlertDialog.Title>Remove recipe</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button
                        variant="solid"
                        color="red"
                        onClick={() => onRemove(item.id)}
                      >
                        Remove
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Card>
          ))}
        </div>
      </SignedIn>
    </>
  );
}

export default App;
