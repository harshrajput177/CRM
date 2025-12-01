const ADMIN_USER = "admin123";
const ADMIN_PASS = "admin@123";

export const adminLogin = (req, res) => {
  const { userId, password } = req.body;

  if (userId === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, role: "admin", message: "Admin Login Successful ✅" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid Admin Credentials ❌" });
  }
};