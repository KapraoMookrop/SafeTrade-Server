import axios from "axios";

export default async function handler(req: any, res: any) {
  try {
    const response = await axios.get("https://safetrade-socket.onrender.com/");
    
    console.log("Ping success:", new Date().toISOString());

    res.status(200).json({
      ok: true,
      status: response.status
    });
  } catch (err: any) {
    console.error("Ping error:", err.message);

    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}