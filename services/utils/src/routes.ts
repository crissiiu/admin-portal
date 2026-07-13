import cloudinary from "cloudinary";
import express from "express";
const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;
    if (!buffer) {
      return res.status(400).json({ message: "No buffer provided" });
    }

    if (typeof buffer === "string" && buffer.startsWith("data:")) {
      const parts = buffer.split(",");
      if (parts.length < 2 || !parts[1] || !parts[1].trim()) {
        return res
          .status(400)
          .json({ message: "Invalid or empty data URI buffer" });
      }
    }

    const options: any = {
      resource_type: "auto",
    };
    if (public_id) {
      options.public_id = public_id;
      options.overwrite = true;
      options.invalidate = true;
    }

    const cloud = await cloudinary.v2.uploader.upload(buffer, options);

    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    console.error("Error in /upload route:", error);
    res.status(500).json({
      message: error.message || error,
    });
  }
});

export default router;
