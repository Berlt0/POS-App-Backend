import db from '../config/db.js';

export const insertUser = async (user) => {
  const connection = await db.getConnection();

  try {

    const [existing] = await connection.query(
      `SELECT id FROM users WHERE global_id = ?`,
      [user.global_id]
    );

    if (existing.length > 0) {
      return { success: true, message: 'User already exists', userId: existing[0].id };
    }


    const [result] = await connection.query(
      `INSERT INTO users (global_id,username, password, role, name,email,contact_number,address, createdAt,image_path, is_disabled, deleted_at, is_synced) 
       VALUES (?,?, ?, ?, ?, ?,?,?,?,?,?,?,?)`,
      [
        user.global_id,
        user.username,
        user.password,
        user.role,
        user.name,
        user.email,
        user.contact_number,
        user.address,
        user.createdAt,
        user.image_path,
        user.is_disabled,
        user.deleted_at,
        1
      ]
    );

    return { success: true, message: 'User synced successfully', userId: result.insertId };
  } catch (error) {
    console.error('Insert User Error:', error);
    throw error;
  } finally {
    connection.release();
  }
};




export const fetchUsers = async () => {
  const connection = await db.getConnection();

  try {
    const [users] = await connection.query("SELECT * FROM users");
    return users;
  } catch (error) {
    console.log("Server Error:", error);
    throw error;
  } finally {
    connection.release();
  }
};