import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
export const registerUser = TryCatch(async (req, res, next) => {
  const { name, email, password, phoneNumber, role, bio } = req.body;
  if (!name || !email || !password || !phoneNumber || !role) {
    throw new ErrorHandler(400, "Vui lòng điền đầy đủ thông tin");
  }

  const existingUser =
    await sql`SELECT user_id FROM users WHERE email = ${email}`;
  if (existingUser.length > 0) {
    throw new ErrorHandler(409, "Email đã tồn tại");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  let registeredUser;
  if (role === "recruiter") {
    const [user] = await sql`
      INSERT INTO users (name, email, password, phone_number, role, bio) 
      VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}) 
      RETURNING user_id, name, email, phone_number, role, created_at
    `;
    registeredUser = user;
  } else if (role === "jobseeker") {
    const file = req.file;
    if (!file) {
      throw new ErrorHandler(
        400,
        "Hồ sơ xin việc là bắt buộc đối với ứng viên",
      );
    }

    if (file.size === 0) {
      throw new ErrorHandler(400, "Hồ sơ xin việc không được để trống");
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler(500, "Không thể lưu vào bộ nhớ đệm");
    }

    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      { buffer: fileBuffer.content },
    );

    const [user] = await sql`
      INSERT INTO users (name, email, password, phone_number, role, bio, resume, resume_public_id) 
      VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}, ${bio || null}, ${data.url}, ${data.public_id}) 
      RETURNING user_id, name, email, phone_number, role, bio, resume, created_at
    `;
    registeredUser = user;
  } else {
    throw new ErrorHandler(400, "Vai trò (role) không hợp lệ");
  }

  const token = jwt.sign(
    { id: registeredUser?.user_id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
    user: registeredUser,
    token,
  });
});
