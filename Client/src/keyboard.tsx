import React, { useEffect, useState } from "react";
import axios from "axios";

interface Key {
  row: number;
  col: number;
  state: "white" | "red" | "yellow";
}

interface KeyboardProps {
  userId: any;
}

const API_BASE_URL = "http://localhost:8080/api/keyboard";

const Keyboard: React.FC<KeyboardProps> = ({ userId }) => {
  const [keyboard, setKeyboard] = useState<{
    keys: Key[];
    currentControl: {
      user: string | null;
      acquiredAt: string | null;
      timeout: number;
    };
  } | null>(null);
  const [hasControl, setHasControl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const fetchKeyboard = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get-keyboard`);
      const data = response.data.results;

      if (!data) {
        throw new Error("Invalid keyboard data received");
      }

      setKeyboard({
        keys: data.keys.map((key: Key) => ({
          row: key.row,
          col: key.col,
          state: key.state,
        })),
        currentControl: data.currentControl,
      });

      const currentlyControlling = data.currentControl?.user === userId;
      setHasControl(currentlyControlling);
      if (currentlyControlling && data.currentControl.acquiredAt) {
        const acquiredTime = new Date(data.currentControl.acquiredAt).getTime();
        const now = new Date().getTime();
        const remaining = Math.max(
          0,
          120 - Math.floor((now - acquiredTime) / 1000)
        );
        setTimeRemaining(remaining);
      } else {
        setTimeRemaining(0);
      }

      setError(null);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Network error"
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error fetching keyboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeKeyboard = async () => {
      try {
        setIsLoading(true);
        await axios.get(`${API_BASE_URL}/initialize-keyboard`);
        await fetchKeyboard();
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Network error"
          : error instanceof Error
          ? error.message
          : "An unexpected error occurred";

        setError(errorMessage);
        console.error("Error initializing keyboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeKeyboard();
    const interval = setInterval(fetchKeyboard, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  const acquireControl = async () => {
    try {
      setIsLoading(true);
      await axios.get(`${API_BASE_URL}/acquire-control?userId=${userId}`);
      await fetchKeyboard();
      setError(null);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Network error"
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred";

      setError(errorMessage);
      console.error("Error acquiring control:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKey = async (row: number, col: number) => {
    if (!hasControl) return;
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/toggle-key`, {
        userId,
        row,
        col,
      });
      await fetchKeyboard();
      setError(null);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Network error"
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred";

      setError(errorMessage);
      console.error("Error toggling key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!keyboard) return <p>No keyboard data available</p>;

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={acquireControl} disabled={hasControl || isLoading}>
          {hasControl
            ? `You have control (${timeRemaining}s remaining)`
            : "Acquire Control"}
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 50px)",
          gap: "5px",
          marginTop: "10px",
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {keyboard.keys.map((key) => (
          <div
            key={`${key.row}-${key.col}`}
            onClick={() => toggleKey(key.row, key.col)}
            style={{
              width: 50,
              height: 50,
              backgroundColor: key.state,
              border: "1px solid black",
              cursor: hasControl && !isLoading ? "pointer" : "not-allowed",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
